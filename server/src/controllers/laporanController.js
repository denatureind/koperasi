import db from '../config/db.js';

// Fungsi untuk mengambil data Jurnal Umum
export const getJurnalUmum = async (req, res) => {
  try {
    const query = `
      SELECT 
        j.id, 
        j.tgl_transaksi, 
        j.keterangan, 
        j.debit, 
        j.kredit, 
        k.kode AS kode_akun, 
        k.nama_akun 
      FROM 
        jurnal_umum j
      JOIN 
        kode_akun k ON j.akun_id = k.id
      ORDER BY 
        j.tgl_transaksi DESC, j.id DESC;
    `;
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error saat mengambil jurnal umum:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Fungsi untuk membuat laporan Neraca
export const getNeraca = async (req, res) => {
  const tanggalLaporan = new Date();
  try {
    const query = `
      SELECT 
        k.id, k.kode, k.nama_akun, k.posisi_saldo, k.header_akun,
        COALESCE(SUM(j.debit), 0) as total_debit,
        COALESCE(SUM(j.kredit), 0) as total_kredit
      FROM 
        kode_akun k
      LEFT JOIN 
        jurnal_umum j ON k.id = j.akun_id AND j.tgl_transaksi <= $1
      GROUP BY k.id ORDER BY k.kode;
    `;
    const result = await db.query(query, [tanggalLaporan]);
    
    // --- PERBAIKAN DI SINI ---
    const laporan = {
      aset: [], kewajiban: [], modal: [], pendapatan: []
    };
    let totalAset = 0, totalKewajiban = 0, totalModal = 0, totalPendapatan = 0;

    result.rows.forEach(akun => {
      let saldoAkhir = 0;
      if (akun.posisi_saldo === 'debit') {
        saldoAkhir = parseFloat(akun.total_debit) - parseFloat(akun.total_kredit);
      } else {
        saldoAkhir = parseFloat(akun.total_kredit) - parseFloat(akun.total_debit);
      }
      
      if (saldoAkhir === 0) return;

      const akunData = { nama_akun: akun.nama_akun, saldo: saldoAkhir };

      if (akun.header_akun === 'ASET') {
        laporan.aset.push(akunData);
        totalAset += saldoAkhir;
      } else if (akun.header_akun === 'KEWAJIBAN') {
        laporan.kewajiban.push(akunData);
        totalKewajiban += saldoAkhir;
      } else if (akun.header_akun === 'MODAL') {
        laporan.modal.push(akunData);
        totalModal += saldoAkhir;
      } else if (akun.header_akun === 'PENDAPATAN') {
        laporan.pendapatan.push(akunData);
        totalPendapatan += saldoAkhir;
      }
    });

    laporan.totalAset = totalAset;
    laporan.totalKewajiban = totalKewajiban;
    laporan.totalModal = totalModal;
    laporan.totalPendapatan = totalPendapatan;
    laporan.totalKewajibanDanModal = totalKewajiban + totalModal + totalPendapatan;

    res.status(200).json(laporan);

  } catch (error) {
    console.error('Error saat membuat laporan neraca:', error);
    res.status(500).json({ message: 'Gagal membuat laporan neraca' });
  }
};

// PASTIKAN FUNGSI INI ADA DAN DIEKSPOR
export const getLabaRugi = async (req, res) => {
  const startDate = '1970-01-01';
  const endDate = new Date();

  try {
    const query = `
      SELECT 
        k.header_akun,
        k.nama_akun,
        SUM(j.kredit) - SUM(j.debit) as saldo_pendapatan,
        SUM(j.debit) - SUM(j.kredit) as saldo_beban
      FROM 
        jurnal_umum j
      JOIN 
        kode_akun k ON j.akun_id = k.id
      WHERE 
        (k.header_akun = 'PENDAPATAN' OR k.header_akun = 'BEBAN')
        AND j.tgl_transaksi BETWEEN $1 AND $2
      GROUP BY
        k.header_akun, k.nama_akun;
    `;
    const result = await db.query(query, [startDate, endDate]);

    const laporan = {
      pendapatan: [],
      beban: [],
      totalPendapatan: 0,
      totalBeban: 0,
      labaRugi: 0
    };

    result.rows.forEach(akun => {
      if (akun.header_akun === 'PENDAPATAN') {
        const total = parseFloat(akun.saldo_pendapatan);
        laporan.pendapatan.push({ nama_akun: akun.nama_akun, total });
        laporan.totalPendapatan += total;
      } else if (akun.header_akun === 'BEBAN') {
        const total = parseFloat(akun.saldo_beban);
        laporan.beban.push({ nama_akun: akun.nama_akun, total });
        laporan.totalBeban += total;
      }
    });

    laporan.labaRugi = laporan.totalPendapatan - laporan.totalBeban;

    res.status(200).json(laporan);
  } catch (error) {
    console.error('Error saat membuat laporan laba rugi:', error);
    res.status(500).json({ message: 'Gagal membuat laporan laba rugi' });
  }
};


// Tambahkan fungsi baru ini di controller Anda
export const hitungSHU = async (req, res) => {
  const tahun = new Date().getFullYear();
  const startDate = `${tahun}-01-01`;
  const endDate = `${tahun}-12-31`;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // TAHAP 1: Ambil semua Konfigurasi Persentase dari DB
    const configResult = await client.query('SELECT kunci_konfigurasi, nilai FROM konfigurasi_shu;');
    const configs = configResult.rows.reduce((acc, row) => {
      acc[row.kunci_konfigurasi] = parseFloat(row.nilai);
      return acc;
    }, {});

    // TAHAP 2: Hitung Total Pendapatan & Beban untuk SHU Kotor
    const labaRugiResult = await client.query(`SELECT k.header_akun, SUM(j.kredit) - SUM(debit) as saldo FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id WHERE (k.header_akun = 'PENDAPATAN' OR k.header_akun = 'BEBAN') AND j.tgl_transaksi BETWEEN $1 AND $2 GROUP BY k.header_akun;`, [startDate, endDate]);
    let totalPendapatan = 0, totalBeban = 0;
    labaRugiResult.rows.forEach(row => {
      if (row.header_akun === 'PENDAPATAN') totalPendapatan = parseFloat(row.saldo);
      if (row.header_akun === 'BEBAN') totalBeban = parseFloat(row.saldo) * -1;
    });
    const shuKotor = totalPendapatan - totalBeban;

    // TAHAP 3: Lakukan Perhitungan SHU Bertahap
    const jasaResult = await client.query(`SELECT COALESCE(SUM(kredit) - SUM(debit), 0) as total FROM jurnal_umum WHERE akun_id = 41 AND tgl_transaksi BETWEEN $1 AND $2;`, [startDate, endDate]);
    const totalJasaPinjaman = parseFloat(jasaResult.rows[0].total);
    const alokasiUntukPeminjam = totalJasaPinjaman * (configs.alokasi_jasa_peminjam_persen / 100);
    const saldoLaba = shuKotor - alokasiUntukPeminjam;

    // --- PASTIKAN BLOK INI ADA ---
    // Mendefinisikan konstanta 'distribusi'
    const distribusi = {
      anggota: saldoLaba * (configs.distribusi_anggota_persen / 100),
      cadangan: saldoLaba * (configs.distribusi_cadangan_persen / 100),
      danaSosial: saldoLaba * (configs.distribusi_sosial_persen / 100),
      pengurus: saldoLaba * (configs.distribusi_pengurus_persen / 100),
    };
    // -----------------------------

    // TAHAP 4: Hitung Poin (ini bagian yang sangat panjang, pastikan tidak terpotong)
    // ... (kode perhitungan poin yang sudah ada sebelumnya) ...
    const anggotaResult = await client.query('SELECT id, nama FROM anggota;');
    let rincianAnggota = [];
    let totalPoinSimpananKeseluruhan = 0;

    for (const anggota of anggotaResult.rows) {
      let totalPoinPribadi = 0;
      const pokokWajibResult = await client.query(`SELECT SUM(saldo) as total FROM rekening_simpanan WHERE anggota_id = $1 AND (jenis_simpanan = 'Pokok' OR jenis_simpanan = 'Wajib')`, [anggota.id]);
      const saldoPokokWajib = parseFloat(pokokWajibResult.rows[0].total || 0);
      totalPoinPribadi += saldoPokokWajib / 10000;

      const sukarelaResult = await client.query(`SELECT id FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan = 'Sukarela'`, [anggota.id]);
      if (sukarelaResult.rows.length > 0) {
        const idRekeningSukarela = sukarelaResult.rows[0].id;
        let poinSukarelaBulanan = 0;
        for (let bulan = 1; bulan <= 12; bulan++) {
          const saldoBulanResult = await client.query(`SELECT COALESCE(SUM(CASE WHEN jenis_transaksi = 'Setor' THEN jumlah ELSE -jumlah END), 0) as saldo FROM transaksi_simpanan WHERE rekening_id = $1 AND EXTRACT(MONTH FROM tgl_transaksi) <= $2 AND EXTRACT(YEAR FROM tgl_transaksi) = $3`, [idRekeningSukarela, bulan, tahun]);
          const saldoAkhirBulan = parseFloat(saldoBulanResult.rows[0].saldo);

          let hargaSaham = 15000;
          if (saldoAkhirBulan > 20000000) hargaSaham = 35000;
          else if (saldoAkhirBulan > 15000000) hargaSaham = 30000;
          else if (saldoAkhirBulan > 10000000) hargaSaham = 25000;
          else if (saldoAkhirBulan > 5000000) hargaSaham = 20000;

          poinSukarelaBulanan += (saldoAkhirBulan / 12) / hargaSaham;
        }
        totalPoinPribadi += poinSukarelaBulanan;
      }

      rincianAnggota.push({
        anggota_id: anggota.id,
        nama: anggota.nama,
        totalPoin: totalPoinPribadi
      });
      totalPoinSimpananKeseluruhan += totalPoinPribadi;
    }

    const indeksPoin = totalPoinSimpananKeseluruhan > 0 ? distribusi.anggota / totalPoinSimpananKeseluruhan : 0;

    rincianAnggota = rincianAnggota.map(anggota => ({
      ...anggota,
      shuDiterima: anggota.totalPoin * indeksPoin
    }));

    // TAHAP 5: Kirim Hasil Lengkap
    const hasilFinal = {
      shuKotor,
      totalJasaPinjaman,
      alokasiUntukPeminjam,
      saldoLaba,
      distribusi, // Variabel ini sekarang sudah didefinisikan
      danaUntukAnggota: distribusi.anggota,
      totalPoinSimpananKeseluruhan,
      indeksPoin,
      rincianAnggota,
    };

    await client.query('COMMIT');
    res.status(200).json(hasilFinal);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saat menghitung SHU:', error);
    res.status(500).json({ message: 'Gagal menghitung SHU' });
  } finally {
    client.release();
  }
};