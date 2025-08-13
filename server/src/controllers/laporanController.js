import db from '../config/db.js';

// FUNGSI PENTING: Mengambil daftar periode untuk dropdown
export const getPeriodeList = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM periode_akuntansi ORDER BY tgl_mulai DESC;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error saat mengambil daftar periode:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar periode' });
  }
};

// Mengambil Jurnal Umum berdasarkan periode
export const getJurnalUmum = async (req, res) => {
  const { periode_id } = req.query;
  if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });
  try {
    const query = `
      SELECT j.id, j.tgl_transaksi, j.keterangan, j.debit, j.kredit, k.kode AS kode_akun, k.nama_akun 
      FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id
      WHERE j.periode_id = $1 ORDER BY j.tgl_transaksi DESC, j.id DESC;
    `;
    const result = await db.query(query, [periode_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error saat mengambil jurnal umum:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Fungsi untuk membuat laporan Neraca (VERSI PERBAIKAN)
export const getNeraca = async (req, res) => {
  const { periode_id } = req.query;
  if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });

  try {
    const query = `
      SELECT 
        k.id, k.kode, k.nama_akun, k.posisi_saldo, k.header_akun,
        COALESCE(SUM(j.debit), 0) as total_debit,
        COALESCE(SUM(j.kredit), 0) as total_kredit
      FROM kode_akun k
      LEFT JOIN jurnal_umum j ON k.id = j.akun_id AND j.periode_id = $1
      GROUP BY k.id ORDER BY k.kode;
    `;
    const result = await db.query(query, [periode_id]);

    const laporan = {
      aset: [], kewajiban: [], modal: [], pendapatan: [], beban: []
    };
    let totalAset = 0, totalKewajiban = 0, totalModal = 0, totalPendapatan = 0, totalBeban = 0;

    result.rows.forEach(akun => {
      let saldoAkhir = (akun.posisi_saldo === 'debit')
        ? parseFloat(akun.total_debit) - parseFloat(akun.total_kredit)
        : parseFloat(akun.total_kredit) - parseFloat(akun.total_debit);

      if (saldoAkhir === 0 && !akun.nama_akun.includes('Laba/Rugi')) return;

      const akunData = { kode: akun.kode, nama_akun: akun.nama_akun, saldo: saldoAkhir };

      if (akun.header_akun === 'ASET') { laporan.aset.push(akunData); totalAset += saldoAkhir; }
      else if (akun.header_akun === 'KEWAJIBAN') { laporan.kewajiban.push(akunData); totalKewajiban += saldoAkhir; }
      else if (akun.header_akun === 'MODAL') { laporan.modal.push(akunData); totalModal += saldoAkhir; }
      else if (akun.header_akun === 'PENDAPATAN') { totalPendapatan += saldoAkhir; }
      else if (akun.header_akun === 'BEBAN') { totalBeban += saldoAkhir; }
    });

    // --- LOGIKA BARU YANG PENTING ---
    const labaRugiPeriodeIni = totalPendapatan - totalBeban;
    // Masukkan Laba/Rugi sebagai bagian dari Modal agar neraca seimbang
    laporan.modal.push({ kode: '', nama_akun: 'Laba/Rugi Periode Ini', saldo: labaRugiPeriodeIni });

    laporan.totalAset = totalAset;
    laporan.totalKewajiban = totalKewajiban;
    laporan.totalModal = totalModal + labaRugiPeriodeIni; // Tambahkan laba/rugi ke total modal
    laporan.totalKewajibanDanModal = laporan.totalKewajiban + laporan.totalModal;

    res.status(200).json(laporan);

  } catch (error) {
    console.error('Error saat membuat laporan neraca:', error);
    res.status(500).json({ message: 'Gagal membuat laporan neraca' });
  }
};

// Fungsi untuk membuat laporan Laba Rugi
export const getLabaRugi = async (req, res) => {
  const { periode_id } = req.query;
  if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });

  try {
    const query = `
      SELECT 
        k.header_akun, k.nama_akun, k.posisi_saldo,
        COALESCE(SUM(j.debit), 0) AS total_debit,
        COALESCE(SUM(j.kredit), 0) AS total_kredit
      FROM kode_akun k
      LEFT JOIN jurnal_umum j ON k.id = j.akun_id AND j.periode_id = $1
      WHERE k.header_akun IN ('PENDAPATAN', 'BEBAN')
      GROUP BY k.id, k.header_akun, k.nama_akun, k.posisi_saldo;
    `;
    const result = await db.query(query, [periode_id]);

    const laporan = { pendapatan: [], beban: [], totalPendapatan: 0, totalBeban: 0, labaRugi: 0 };
    result.rows.forEach(akun => {
      let saldo = (akun.posisi_saldo === 'debit')
        ? parseFloat(akun.total_debit) - parseFloat(akun.total_kredit)
        : parseFloat(akun.total_kredit) - parseFloat(akun.total_debit);

      if (akun.header_akun === 'PENDAPATAN') {
        laporan.pendapatan.push({ nama_akun: akun.nama_akun, total: saldo });
        laporan.totalPendapatan += saldo;
      } else if (akun.header_akun === 'BEBAN') {
        laporan.beban.push({ nama_akun: akun.nama_akun, total: saldo });
        laporan.totalBeban += saldo;
      }
    });
    laporan.labaRugi = laporan.totalPendapatan - laporan.totalBeban;
    res.status(200).json(laporan);
  } catch (error) {
    console.error('Error saat membuat laporan laba rugi:', error);
    res.status(500).json({ message: 'Gagal membuat laporan laba rugi' });
  }
};

// Fungsi untuk menghitung SHU
export const hitungSHU = async (req, res) => {
  const { periode_id } = req.query;
  if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const periodeResult = await client.query('SELECT tgl_mulai, tgl_selesai FROM periode_akuntansi WHERE id = $1', [periode_id]);
    if (periodeResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Periode tidak ditemukan' });
    }
    const { tgl_mulai, tgl_selesai } = periodeResult.rows[0];

    // --- TAHAP 1: Hitung Saldo Laba & Alokasi Dana ---
    const configs = (await client.query('SELECT kunci_konfigurasi, nilai FROM konfigurasi_shu')).rows.reduce((acc, row) => ({...acc, [row.kunci_konfigurasi]: parseFloat(row.nilai)}), {});

    const labaRugiResult = await client.query(`SELECT k.header_akun, SUM(j.kredit) - SUM(j.debit) as saldo FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id WHERE (k.header_akun = 'PENDAPATAN' OR k.header_akun = 'BEBAN') AND j.periode_id = $1 GROUP BY k.header_akun;`, [periode_id]);
    let totalPendapatan = 0, totalBeban = 0;
    labaRugiResult.rows.forEach(row => {
      if (row.header_akun === 'PENDAPATAN') totalPendapatan = parseFloat(row.saldo);
      if (row.header_akun === 'BEBAN') totalBeban = parseFloat(row.saldo) * -1;
    });
    const shuKotor = totalPendapatan - totalBeban;

    const jasaResult = await client.query(`SELECT COALESCE(SUM(kredit) - SUM(debit), 0) as total FROM jurnal_umum WHERE akun_id = 41 AND periode_id = $1;`, [periode_id]);
    const totalJasaPinjaman = parseFloat(jasaResult.rows[0].total);
    const alokasiUntukPeminjam = totalJasaPinjaman * (configs.alokasi_jasa_peminjam_persen / 100);
    const saldoLaba = shuKotor - alokasiUntukPeminjam;
    const danaUntukAnggotaViaSimpanan = saldoLaba * (configs.distribusi_anggota_persen / 100);
    const danaUntukAnggotaViaPinjaman = alokasiUntukPeminjam;

    // --- TAHAP 2: Hitung Poin & SHU per Anggota ---
    const anggotaResult = await client.query('SELECT id, nama FROM anggota WHERE status = \'aktif\';');
    let rincianAnggota = [];
    let totalPoinSimpananKeseluruhan = 0;

    const totalJasaDibayarSemuaAnggotaResult = await client.query(`SELECT COALESCE(SUM(ja.jasa_dibayar), 0) as total FROM jadwal_angsuran ja JOIN rekening_pinjaman rp ON ja.rekening_pinjaman_id = rp.id WHERE rp.anggota_id IN (SELECT id FROM anggota WHERE status = 'aktif') AND ja.tgl_jatuh_tempo BETWEEN $1 AND $2`, [tgl_mulai, tgl_selesai]);
    const totalJasaDibayarSemuaAnggota = parseFloat(totalJasaDibayarSemuaAnggotaResult.rows[0].total) || 1; 

    for (const anggota of anggotaResult.rows) {
      const pokokWajibResult = await client.query(`SELECT COALESCE(SUM(saldo), 0) as total FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan IN ('Simpanan Pokok', 'Simpanan Wajib')`, [anggota.id]);
      const poinPokokWajib = parseFloat(pokokWajibResult.rows[0].total) / 10000;

      let poinSukarela = 0;
      const sukarelaResult = await client.query(`SELECT id FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan = 'Simpanan Sukarela'`, [anggota.id]);
      if (sukarelaResult.rows.length > 0) {
        const idRekeningSukarela = sukarelaResult.rows[0].id;
        for (let bulan = 1; bulan <= 12; bulan++) {
          const saldoBulanResult = await client.query(`SELECT COALESCE(SUM(CASE WHEN jenis_transaksi = 'Setor' THEN jumlah ELSE -jumlah END), 0) as saldo FROM transaksi_simpanan WHERE rekening_id = $1 AND EXTRACT(MONTH FROM tgl_transaksi) <= $2 AND EXTRACT(YEAR FROM tgl_transaksi) = $3`, [idRekeningSukarela, bulan, tgl_mulai.getFullYear()]);
          const saldoAkhirBulan = parseFloat(saldoBulanResult.rows[0].saldo);

          let hargaSaham = 15000;
          if (saldoAkhirBulan > 20000000) hargaSaham = 35000;
          else if (saldoAkhirBulan > 15000000) hargaSaham = 30000;
          else if (saldoAkhirBulan > 10000000) hargaSaham = 25000;
          else if (saldoAkhirBulan > 5000000) hargaSaham = 20000;

          poinSukarela += (saldoAkhirBulan / 12) / hargaSaham;
        }
      }

      const lebaranResult = await client.query(`SELECT COALESCE(SUM(saldo), 0) as total FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan = 'Simpanan Lebaran'`, [anggota.id]);
      const poinLebaran = parseFloat(lebaranResult.rows[0].total) / 15000;

      const totalPoinPribadi = poinPokokWajib + poinSukarela + poinLebaran;
      totalPoinSimpananKeseluruhan += totalPoinPribadi;

      const jasaPribadiResult = await client.query(`SELECT COALESCE(SUM(ja.jasa_dibayar), 0) as total FROM jadwal_angsuran ja JOIN rekening_pinjaman rp ON ja.rekening_pinjaman_id = rp.id WHERE rp.anggota_id = $1 AND ja.tgl_jatuh_tempo BETWEEN $2 AND $3`, [tgl_mulai, tgl_selesai]);
      const jasaPribadiDibayar = parseFloat(jasaPribadiResult.rows[0].total || 0);
      const shuDariPinjaman = (jasaPribadiDibayar / totalJasaDibayarSemuaAnggota) * danaUntukAnggotaViaPinjaman;

      rincianAnggota.push({
        anggota_id: anggota.id,
        nama: anggota.nama,
        poinPokokWajib,
        poinSukarela,
        poinLebaran,
        totalPoin: totalPoinPribadi,
        shuDariPinjaman,
      });
    }

    // --- TAHAP 3: Hitung Indeks & SHU Final per Anggota ---
    const indeksPoin = totalPoinSimpananKeseluruhan > 0 ? danaUntukAnggotaViaSimpanan / totalPoinSimpananKeseluruhan : 0;

    rincianAnggota = rincianAnggota.map(anggota => {
      const shuDariSimpanan = anggota.totalPoin * indeksPoin;
      return {
        ...anggota,
        shuDariSimpanan,
        shuTotalDiterima: shuDariSimpanan + anggota.shuDariPinjaman,
      }
    });

    // --- TAHAP 4: Kirim Hasil Lengkap ---
    res.status(200).json({
      danaUntukAnggotaViaSimpanan,
      alokasiUntukPeminjam,
      totalPoinSimpananKeseluruhan,
      indeksPoin,
      rincianAnggota,
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saat menghitung SHU:', error);
    res.status(500).json({ message: 'Gagal menghitung SHU' });
  } finally {
    client.release();
  }
};