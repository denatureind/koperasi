import db from '../config/db.js';
import { getPeriodeAktifId } from '../utils/periode.js';

// Definisikan ID Akun yang akan sering kita pakai
const AKUN_KAS_ID = 11;
const AKUN_PIUTANG_PINJAMAN_ID = 13;
const AKUN_PENDAPATAN_JASA_ID = 41;

// --- FUNGSI GET (Tidak berubah, tapi pastikan ada) ---

/**
 * Mengambil semua data pinjaman dengan total pembayaran pokok dan jasa.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllPinjaman = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id, p.no_pinjaman, p.jumlah_pinjaman, p.tenor, p.status, p.sisa_pokok,
        a.id as anggota_id, a.nama as nama_anggota,
        (SELECT COALESCE(SUM(pokok_dibayar), 0) FROM jadwal_angsuran WHERE rekening_pinjaman_id = p.id) as total_bayar_pokok,
        (SELECT COALESCE(SUM(jasa_dibayar), 0) FROM jadwal_angsuran WHERE rekening_pinjaman_id = p.id) as total_bayar_jasa
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


/**
 * Mengambil daftar pinjaman berdasarkan ID anggota.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getPinjamanByAnggotaId = async (req, res) => {
    const { anggotaId } = req.params;
    try {
      const query = 'SELECT * FROM rekening_pinjaman WHERE anggota_id = $1 ORDER BY tgl_pencairan DESC;';
      const result = await db.query(query, [anggotaId]);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error mengambil data pinjaman:', error);
      res.status(500).json({ message: 'Error mengambil data pinjaman.' });
    }
  };
  
/**
 * Mengambil detail pinjaman berdasarkan ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getDetailPinjamanById = async (req, res) => {
  const { id } = req.params;
  try {
    // Query 1: Ambil data induk pinjaman dan gabungkan dengan data anggota
    const pinjamanQuery = `
      SELECT p.*, a.nama as nama_anggota, a.kode_anggota
      FROM rekening_pinjaman p
      JOIN anggota a ON p.anggota_id = a.id
      WHERE p.id = $1;
    `;
    const pinjamanResult = await db.query(pinjamanQuery, [id]);

    if (pinjamanResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pinjaman tidak ditemukan' });
    }

    const pinjaman = pinjamanResult.rows[0];

    // Query 2: Ambil data jadwal angsuran
    const jadwalQuery = 'SELECT * FROM jadwal_angsuran WHERE rekening_pinjaman_id = $1 ORDER BY angsuran_ke ASC;';
    const jadwalResult = await db.query(jadwalQuery, [id]);
    const jadwal_angsuran = jadwalResult.rows;

    // --- KALKULASI DATA BARU ---
    const jasa_per_bulan = parseFloat(pinjaman.jumlah_pinjaman) * (parseFloat(pinjaman.tingkat_jasa_persen) / 100);
    const jasa_terhitung = jasa_per_bulan * parseInt(pinjaman.tenor);
    const total_utang_berjalan = parseFloat(pinjaman.jumlah_pinjaman) + jasa_terhitung;

    // Gabungkan semua data menjadi satu objek respons
    const detailPinjamanLengkap = {
      ...pinjaman,
      jadwal_angsuran,
      jasa_terhitung,
      total_utang_berjalan
    };

    res.status(200).json(detailPinjamanLengkap);
  } catch (error) {
    console.error('Error mengambil detail pinjaman:', error);
    res.status(500).json({ message: 'Error mengambil detail pinjaman.' });
  }
};

/**
 * Mengambil semua transaksi pinjaman yang sudah dibayar.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
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
    } catch (error) {
      console.error('Error mengambil semua transaksi pinjaman:', error);
      res.status(500).json({ message: 'Gagal mengambil data transaksi' });
    }
};

// --- FUNGSI CREATE & UPDATE (YANG DI-UPGRADE) ---

/**
 * Membuat pinjaman baru dan jadwal angsurannya, serta mencatat jurnal.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createPinjaman = async (req, res) => {
  const { anggota_id, jumlah_pinjaman, tenor, tingkat_jasa_persen, tgl_pencairan } = req.body;
  const client = await db.connect();

  try {
    await client.query('BEGIN');
    const periodeId = await getPeriodeAktifId(client);

    // --- LOGIKA PEMBULATAN BARU ---
    const jumlah = parseFloat(jumlah_pinjaman);
    const n_tenor = parseInt(tenor);
    const jasa_persen = parseFloat(tingkat_jasa_persen);

    const jasa_per_bulan = Math.round(jumlah * (jasa_persen / 100));
    const angsuran_pokok_per_bulan = Math.round(jumlah / n_tenor);

    let total_pokok_terjadwal = 0;

    const angsuranQuery = `INSERT INTO jadwal_angsuran(rekening_pinjaman_id, angsuran_ke, tgl_jatuh_tempo, jumlah_angsuran_pokok, jumlah_angsuran_jasa) VALUES($1, $2, $3, $4, $5);`;
    let tanggalJatuhTempo = new Date(tgl_pencairan);

    // Simpan pinjaman dulu untuk mendapatkan ID
    const no_pinjaman = `PIN-${String(anggota_id).padStart(4,'0')}-${String(Date.now()).slice(-6)}`;
    const pinjamanQuery = `INSERT INTO rekening_pinjaman(anggota_id, no_pinjaman, jumlah_pinjaman, tenor, tingkat_jasa_persen, tgl_pencairan, sisa_pokok) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id;`;
    const pinjamanResult = await client.query(pinjamanQuery, [anggota_id, no_pinjaman, jumlah, n_tenor, jasa_persen, tgl_pencairan, jumlah]);
    const rekeningPinjamanId = pinjamanResult.rows[0].id;

    // Buat jadwal untuk n-1 angsuran
    for (let i = 1; i < n_tenor; i++) {
      tanggalJatuhTempo.setMonth(tanggalJatuhTempo.getMonth() + 1);
      await client.query(angsuranQuery, [rekeningPinjamanId, i, tanggalJatuhTempo, angsuran_pokok_per_bulan, jasa_per_bulan]);
      total_pokok_terjadwal += angsuran_pokok_per_bulan;
    }

    // Angsuran terakhir disesuaikan untuk menutupi sisa pembulatan
    const angsuran_pokok_terakhir = jumlah - total_pokok_terjadwal;
    tanggalJatuhTempo.setMonth(tanggalJatuhTempo.getMonth() + 1);
    await client.query(angsuranQuery, [rekeningPinjamanId, n_tenor, tanggalJatuhTempo, angsuran_pokok_terakhir, jasa_per_bulan]);

    // --- Sisa logika tidak berubah ---
    const keterangan = `Pencairan pinjaman ${no_pinjaman}`;
    const jurnalQuery = `INSERT INTO jurnal_umum(keterangan, akun_id, debit, kredit, periode_id, tgl_transaksi) VALUES ($1, $2, $3, $4, $5, $6);`;
    await client.query(jurnalQuery, [keterangan, AKUN_PIUTANG_PINJAMAN_ID, jumlah, 0, periodeId, tgl_pencairan]);
    await client.query(jurnalQuery, [keterangan, AKUN_KAS_ID, 0, jumlah, periodeId, tgl_pencairan]);

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

/**
 * Memproses pembayaran angsuran.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createPembayaranAngsuran = async (req, res) => {
  const { jadwalId } = req.params;
  const { bayar_pokok, bayar_jasa, tgl_bayar } = req.body;

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const periodeId = await getPeriodeAktifId(client);

    const jadwalQuery = 'SELECT j.*, p.no_pinjaman FROM jadwal_angsuran j JOIN rekening_pinjaman p ON j.rekening_pinjaman_id = p.id WHERE j.id = $1 FOR UPDATE;';
    const jadwalResult = await client.query(jadwalQuery, [jadwalId]);
    const jadwal = jadwalResult.rows[0];

    const totalPokokTerbayar = parseFloat(jadwal.pokok_dibayar) + (parseFloat(bayar_pokok) || 0);
    const totalJasaTerbayar = parseFloat(jadwal.jasa_dibayar) + (parseFloat(bayar_jasa) || 0);

    let status_pembayaran_baru = 'sebagian_bayar';
    if (totalPokokTerbayar >= parseFloat(jadwal.jumlah_angsuran_pokok) && totalJasaTerbayar >= parseFloat(jadwal.jumlah_angsuran_jasa)) {
      status_pembayaran_baru = 'lunas';
    }

    await client.query(
      'UPDATE jadwal_angsuran SET pokok_dibayar = $1, jasa_dibayar = $2, status_pembayaran = $3, tgl_pembayaran = $4 WHERE id = $5;',
      [totalPokokTerbayar, totalJasaTerbayar, status_pembayaran_baru, tgl_bayar, jadwalId]
    );

    if (bayar_pokok > 0) {
      await client.query('UPDATE rekening_pinjaman SET sisa_pokok = sisa_pokok - $1 WHERE id = $2;', [bayar_pokok, jadwal.rekening_pinjaman_id]);
    }

    const keterangan = `Pembayaran angsuran ke-${jadwal.angsuran_ke} pinjaman ${jadwal.no_pinjaman}`;
    const totalBayar = (parseFloat(bayar_pokok) || 0) + (parseFloat(bayar_jasa) || 0);
    const jurnalQuery = `INSERT INTO jurnal_umum(keterangan, akun_id, debit, kredit, periode_id, tgl_transaksi) VALUES ($1, $2, $3, $4, $5, $6);`;

    if(totalBayar > 0) await client.query(jurnalQuery, [keterangan, AKUN_KAS_ID, totalBayar, 0, periodeId, tgl_bayar]);
    if(bayar_pokok > 0) await client.query(jurnalQuery, [keterangan, AKUN_PIUTANG_PINJAMAN_ID, 0, bayar_pokok, periodeId, tgl_bayar]);
    if(bayar_jasa > 0) await client.query(jurnalQuery, [keterangan, AKUN_PENDAPATAN_JASA_ID, 0, bayar_jasa, periodeId, tgl_bayar]);

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
