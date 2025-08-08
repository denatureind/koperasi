import db from '../config/db.js';

// --- ID AKUN YANG SUDAH SINKRON ---
const AKUN_KAS_ID = 11;
const AKUN_PIUTANG_PINJAMAN_ID = 13;
const AKUN_PENDAPATAN_JASA_ID = 41;

// Fungsi untuk membuat pinjaman baru (versi final)
export const createPinjaman = async (req, res) => {
  const { anggota_id, jumlah_pinjaman, tenor, tingkat_jasa_persen, tgl_pencairan } = req.body;

  const jasa_per_bulan = jumlah_pinjaman * (tingkat_jasa_persen / 100);
  const angsuran_pokok_per_bulan = jumlah_pinjaman / tenor;
  const no_pinjaman = `PIN-${String(anggota_id).padStart(4, '0')}-${String(Date.now()).slice(-6)}`;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Insert ke rekening_pinjaman
    const pinjamanQuery = `
      INSERT INTO rekening_pinjaman(anggota_id, no_pinjaman, jumlah_pinjaman, tenor, tingkat_jasa_persen, tgl_pencairan, sisa_pokok)
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id;
    `;
    const pinjamanResult = await client.query(pinjamanQuery, [anggota_id, no_pinjaman, jumlah_pinjaman, tenor, tingkat_jasa_persen, tgl_pencairan, jumlah_pinjaman]);
    const rekeningPinjamanId = pinjamanResult.rows[0].id;

    // Generate jadwal angsuran
    const angsuranQuery = `
      INSERT INTO jadwal_angsuran(rekening_pinjaman_id, angsuran_ke, tgl_jatuh_tempo, jumlah_angsuran_pokok, jumlah_angsuran_jasa)
      VALUES($1, $2, $3, $4, $5);
    `;
    let tanggalJatuhTempo = new Date(tgl_pencairan);
    for (let i = 1; i <= tenor; i++) {
      tanggalJatuhTempo.setMonth(tanggalJatuhTempo.getMonth() + 1);
      await client.query(angsuranQuery, [rekeningPinjamanId, i, tanggalJatuhTempo, angsuran_pokok_per_bulan, jasa_per_bulan]);
    }

    // Buat Jurnal Pencairan
    const keteranganPencairan = `Pencairan pinjaman ${no_pinjaman}`;
    const jurnalQuery = `INSERT INTO jurnal_umum(keterangan, akun_id, debit, kredit) VALUES ($1, $2, $3, $4);`;
    // Debit: Piutang Pinjaman bertambah
    await client.query(jurnalQuery, [keteranganPencairan, AKUN_PIUTANG_PINJAMAN_ID, jumlah_pinjaman, 0]);
    // Kredit: Kas berkurang
    await client.query(jurnalQuery, [keteranganPencairan, AKUN_KAS_ID, 0, jumlah_pinjaman]);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Pinjaman berhasil dibuat', id: rekeningPinjamanId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saat membuat pinjaman:', error);
    res.status(500).json({ message: 'Gagal membuat pinjaman' });
  } finally {
    client.release();
  }
};

// Fungsi untuk membayar angsuran (versi final)
export const createPembayaranAngsuran = async (req, res) => {
  const { jadwalId } = req.params;
  const { bayar_pokok, bayar_jasa } = req.body;

  if (bayar_pokok < 0 || bayar_jasa < 0) {
    return res.status(400).json({ message: 'Jumlah pembayaran tidak boleh negatif.' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const jadwalQuery = 'SELECT j.*, p.no_pinjaman FROM jadwal_angsuran j JOIN rekening_pinjaman p ON j.rekening_pinjaman_id = p.id WHERE j.id = $1 FOR UPDATE;';
    const jadwalResult = await client.query(jadwalQuery, [jadwalId]);
    if (jadwalResult.rows.length === 0) throw new Error('Jadwal angsuran tidak ditemukan.');

    const jadwal = jadwalResult.rows[0];
    if (jadwal.status_pembayaran === 'lunas') throw new Error('Angsuran ini sudah lunas.');

    // Hitung total pembayaran baru
    const totalPokokTerbayar = parseFloat(jadwal.pokok_dibayar) + parseFloat(bayar_pokok);
    const totalJasaTerbayar = parseFloat(jadwal.jasa_dibayar) + parseFloat(bayar_jasa);

    // Tentukan status pembayaran baru
    const sisaPokok = parseFloat(jadwal.jumlah_angsuran_pokok) - totalPokokTerbayar;
    const sisaJasa = parseFloat(jadwal.jumlah_angsuran_jasa) - totalJasaTerbayar;
    let status_pembayaran_baru = 'sebagian_bayar';
    if (sisaPokok <= 0 && sisaJasa <= 0) {
      status_pembayaran_baru = 'lunas';
    }

    // Update ke tabel jadwal_angsuran
    const updateJadwalQuery = `
      UPDATE jadwal_angsuran 
      SET pokok_dibayar = $1, jasa_dibayar = $2, status_pembayaran = $3 
      WHERE id = $4;
    `;
    await client.query(updateJadwalQuery, [totalPokokTerbayar, totalJasaTerbayar, status_pembayaran_baru, jadwalId]);

    // Update sisa pokok di rekening_pinjaman
    if (bayar_pokok > 0) {
      const updateRekeningQuery = `
        UPDATE rekening_pinjaman SET sisa_pokok = sisa_pokok - $1 WHERE id = $2;
      `;
      await client.query(updateRekeningQuery, [bayar_pokok, jadwal.rekening_pinjaman_id]);
    }

    // Buat Jurnal Pembayaran Angsuran
    const keteranganPembayaran = `Pembayaran angsuran ke-${jadwal.angsuran_ke} pinjaman ${jadwal.no_pinjaman}`;
    const totalBayar = parseFloat(bayar_pokok) + parseFloat(bayar_jasa);
    const jurnalQuery = `INSERT INTO jurnal_umum(keterangan, akun_id, debit, kredit) VALUES ($1, $2, $3, $4);`;
    
    if (totalBayar > 0) {
      // Debit: Kas bertambah
      await client.query(jurnalQuery, [keteranganPembayaran, AKUN_KAS_ID, totalBayar, 0]);
    }
    if (bayar_pokok > 0) {
      // Kredit: Piutang Pinjaman berkurang
      await client.query(jurnalQuery, [keteranganPembayaran, AKUN_PIUTANG_PINJAMAN_ID, 0, bayar_pokok]);
    }
    if (bayar_jasa > 0) {
      // Kredit: Pendapatan Jasa bertambah
      await client.query(jurnalQuery, [keteranganPembayaran, AKUN_PENDAPATAN_JASA_ID, 0, bayar_jasa]);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: `Pembayaran angsuran ke-${jadwal.angsuran_ke} berhasil diproses.` });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saat bayar angsuran:', error);
    res.status(500).json({ message: error.message || 'Gagal memproses pembayaran.' });
  } finally {
    client.release();
  }
};

// Fungsi untuk melihat semua pinjaman milik satu anggota
export const getPinjamanByAnggotaId = async (req, res) => {
  const { anggotaId } = req.params;
  try {
    const query = 'SELECT * FROM rekening_pinjaman WHERE anggota_id = $1 ORDER BY tgl_pencairan DESC;';
    const result = await db.query(query, [anggotaId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error mengambil data pinjaman.' });
  }
};

// Fungsi untuk melihat detail satu pinjaman beserta jadwalnya
export const getDetailPinjamanById = async (req, res) => {
  const { id } = req.params;
  try {
    // Query 1: Ambil data induk pinjaman
    const pinjamanQuery = 'SELECT * FROM rekening_pinjaman WHERE id = $1;';
    const pinjamanResult = await db.query(pinjamanQuery, [id]);

    if (pinjamanResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pinjaman tidak ditemukan' });
    }

    // Query 2: Ambil data jadwal angsuran
    const jadwalQuery = 'SELECT * FROM jadwal_angsuran WHERE rekening_pinjaman_id = $1 ORDER BY angsuran_ke ASC;';
    const jadwalResult = await db.query(jadwalQuery, [id]);

    // Gabungkan hasilnya
    const detailPinjaman = pinjamanResult.rows[0];
    detailPinjaman.jadwal_angsuran = jadwalResult.rows;

    res.status(200).json(detailPinjaman);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error mengambil detail pinjaman.' });
  }
};

// Tambahkan fungsi baru ini di controller Anda
export const getAllPinjaman = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id, p.no_pinjaman, p.jumlah_pinjaman, p.tenor, p.status,
        a.id as anggota_id, a.nama as nama_anggota 
      FROM 
        rekening_pinjaman p
      JOIN 
        anggota a ON p.anggota_id = a.id
      ORDER BY 
        p.tgl_pencairan DESC;
    `;
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error mengambil semua pinjaman:', error);
    res.status(500).json({ message: 'Gagal mengambil data pinjaman' });
  }
};

// Tambahkan fungsi baru ini di controller Anda
export const getAllTransaksi = async (req, res) => {
  try {
    const query = `
      SELECT 
        j.id, j.pokok_dibayar, j.jasa_dibayar, j.tgl_jatuh_tempo,
        p.no_pinjaman,
        a.nama as nama_anggota
      FROM 
        jadwal_angsuran j
      JOIN 
        rekening_pinjaman p ON j.rekening_pinjaman_id = p.id
      JOIN 
        anggota a ON p.anggota_id = a.id
      WHERE 
        j.status_pembayaran != 'belum_bayar'
      ORDER BY 
        j.id DESC;
    `;
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error)
     {
    console.error('Error mengambil semua transaksi pinjaman:', error);
    res.status(500).json({ message: 'Gagal mengambil data transaksi' });
  }
};

// Tambahkan fungsi baru ini di controller Anda
export const hitungSHU = async (req, res) => {
  // Untuk saat ini, periode kita setahun penuh. Nanti bisa dibuat dinamis.
  const tahun = new Date().getFullYear();
  const startDate = `${tahun}-01-01`;
  const endDate = `${tahun}-12-31`;

  const client = await db.connect();
  try {
    // --- Tahap 1: Ambil semua Konfigurasi Persentase dari DB ---
    const configResult = await client.query('SELECT kunci_konfigurasi, nilai FROM konfigurasi_shu;');
    const configs = configResult.rows.reduce((acc, row) => {
      acc[row.kunci_konfigurasi] = parseFloat(row.nilai);
      return acc;
    }, {});

    // --- Tahap 2: Hitung Total Pendapatan Jasa Pinjaman ---
    const AKUN_PENDAPATAN_JASA_ID = 41;
    const jasaResult = await client.query(
      `SELECT COALESCE(SUM(kredit) - SUM(debit), 0) as total FROM jurnal_umum WHERE akun_id = $1 AND tgl_transaksi BETWEEN $2 AND $3;`,
      [AKUN_PENDAPATAN_JASA_ID, startDate, endDate]
    );
    const totalJasaPinjaman = parseFloat(jasaResult.rows[0].total);

    // --- Tahap 3: Hitung Total Laba Rugi (SHU Kotor) ---
    // (Mengambil logika dari Laporan Laba Rugi)
    const labaRugiQuery = `
      SELECT k.header_akun, SUM(j.kredit) - SUM(j.debit) as saldo
      FROM jurnal_umum j
      JOIN kode_akun k ON j.akun_id = k.id
      WHERE (k.header_akun = 'PENDAPATAN' OR k.header_akun = 'BEBAN') AND j.tgl_transaksi BETWEEN $1 AND $2
      GROUP BY k.header_akun;
    `;
    const labaRugiResult = await client.query(labaRugiQuery, [startDate, endDate]);

    let totalPendapatan = 0;
    let totalBeban = 0;
    labaRugiResult.rows.forEach(row => {
      if (row.header_akun === 'PENDAPATAN') totalPendapatan = parseFloat(row.saldo);
      if (row.header_akun === 'BEBAN') totalBeban = parseFloat(row.saldo) * -1; // Saldo beban secara alami negatif
    });
    const shuKotor = totalPendapatan - totalBeban;

    // --- Tahap 4: Lakukan Perhitungan SHU Bertahap ---
    // a. Pra-alokasi
    const alokasiUntukPeminjam = totalJasaPinjaman * (configs.alokasi_jasa_peminjam_persen / 100);

    // b. Hitung Saldo Laba (SHU Bersih untuk Distribusi)
    // Untuk sekarang, kita asumsikan tidak ada laba toko
    const saldoLaba = shuKotor - alokasiUntukPeminjam;

    // c. Distribusi Saldo Laba
    const distribusi = {
      anggota: saldoLaba * (configs.distribusi_anggota_persen / 100),
      cadangan: saldoLaba * (configs.distribusi_cadangan_persen / 100),
      danaSosial: saldoLaba * (configs.distribusi_sosial_persen / 100),
      pengurus: saldoLaba * (configs.distribusi_pengurus_persen / 100),
    };

    // --- Tahap 5: Kirim Hasil Perhitungan ---
    const hasilPerhitungan = {
      periode: { startDate, endDate },
      sumber: {
        shuKotor,
        totalJasaPinjaman,
      },
      praAlokasi: {
        alokasiUntukPeminjam,
      },
      saldoLaba,
      distribusi,
    };

    res.status(200).json(hasilPerhitungan);

  } catch (error) {
    console.error('Error saat menghitung SHU:', error);
    res.status(500).json({ message: 'Gagal menghitung SHU' });
  } finally {
    client.release();
  }
};