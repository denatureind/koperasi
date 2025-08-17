import db from '../config/db.js';
import ExcelJS from 'exceljs';

/**
 * FUNGSI PENTING: Mengambil daftar periode untuk dropdown
 * Mengambil semua periode akuntansi dari database dan mengurutkannya dari yang terbaru.
 */
export const getPeriodeList = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM periode_akuntansi ORDER BY tgl_mulai DESC;');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error saat mengambil daftar periode:', error);
        res.status(500).json({ message: 'Gagal mengambil daftar periode' });
    }
};

/**
 * Mengambil Jurnal Umum berdasarkan periode
 * Mengambil semua entri jurnal umum untuk periode yang ditentukan,
 * termasuk detail akun yang relevan.
 */
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

/**
 * Fungsi untuk membuat laporan Neraca
 * Menghitung saldo akhir untuk setiap akun dan mengelompokkannya ke dalam
 * Aset, Kewajiban, dan Modal. Laba/Rugi ditambahkan ke Modal agar neraca seimbang.
 */
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

        // --- LOGIKA PENTING: Menambahkan Laba/Rugi ke Modal agar Neraca Seimbang ---
        const labaRugiPeriodeIni = totalPendapatan - totalBeban;
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

/**
 * Fungsi untuk membuat laporan Laba Rugi
 * Menghitung total pendapatan dan beban untuk periode yang ditentukan.
 */
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

/**
 * Fungsi untuk menghitung SHU (VERSI PERBAIKAN FINAL)
 * Fungsi untuk menghitung SHU (VERSI DENGAN SHU BELANJA)
 * Menghitung Sisa Hasil Usaha (SHU) berdasarkan data periode, konfigurasi,
 * dan transaksi anggota. Menggunakan transaksi database untuk memastikan integritas data.
 */
export const hitungSHU = async (req, res) => {
  const { periode_id, jasa_belanja_dikembalikan } = req.query;

  if (!periode_id) {
    return res.status(400).json({ message: "ID Periode dibutuhkan" });
  }
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1. Ambil informasi periode
    const periodeResult = await client.query(
      "SELECT tgl_mulai, tgl_selesai FROM periode_akuntansi WHERE id = $1",
      [periode_id]
    );
    if (periodeResult.rows.length === 0) {
      throw new Error(`Periode dengan ID ${periode_id} tidak ditemukan.`);
    }
    const { tgl_mulai, tgl_selesai } = periodeResult.rows[0];
    const tahun = new Date(tgl_mulai).getFullYear();

    // 2. Ambil konfigurasi SHU dari tabel `konfigurasi_shu`
    const configs = (
      await client.query(
        "SELECT kunci_konfigurasi, nilai FROM konfigurasi_shu"
      )
    ).rows.reduce(
      (acc, row) => ({ ...acc, [row.kunci_konfigurasi]: parseFloat(row.nilai) }),
      {}
    );

    // 3. Hitung SHU Kotor dari pendapatan dan beban
    const labaRugiResult = await client.query(
      `SELECT k.header_akun, SUM(j.kredit) - SUM(j.debit) as saldo FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id WHERE (k.header_akun = 'PENDAPATAN' OR k.header_akun = 'BEBAN') AND j.periode_id = $1 GROUP BY k.header_akun;`,
      [periode_id]
    );
    let totalPendapatan = 0,
      totalBeban = 0;
    labaRugiResult.rows.forEach((row) => {
      if (row.header_akun === "PENDAPATAN")
        totalPendapatan = parseFloat(row.saldo) || 0;
      if (row.header_akun === "BEBAN")
        totalBeban = parseFloat(row.saldo) * -1 || 0;
    });
    const shuKotor = totalPendapatan - totalBeban;

    // 4. Hitung alokasi SHU untuk peminjam
    const jasaResult = await client.query(
      `SELECT COALESCE(SUM(kredit) - SUM(debit), 0) as total FROM jurnal_umum WHERE akun_id = 41 AND periode_id = $1;`,
      [periode_id]
    );
    const totalJasaPinjaman = parseFloat(jasaResult.rows[0].total);
    const alokasiUntukPeminjam =
      totalJasaPinjaman * (configs.alokasi_jasa_peminjam_persen / 100);
    const saldoLaba = shuKotor - alokasiUntukPeminjam;

    // 5. Hitung dana untuk anggota dari simpanan
    const danaUntukAnggotaViaSimpanan =
      saldoLaba * (configs.distribusi_anggota_persen / 100);

    // 6. Hitung distribusi lainnya
    const distribusi = {
      anggota: danaUntukAnggotaViaSimpanan,
      cadangan: saldoLaba * (configs.distribusi_cadangan_persen / 100),
      danaSosial: saldoLaba * (configs.distribusi_sosial_persen / 100),
      pengurus: saldoLaba * (configs.distribusi_pengurus_persen / 100),
    };

    // 7. Ambil daftar anggota aktif
    const anggotaResult = await client.query(
      "SELECT id, nama FROM anggota WHERE status = 'aktif';"
    );
    let rincianAnggota = [];
    let totalPoinSimpananKeseluruhan = 0;

    // 8. Hitung total jasa yang dibayar oleh semua anggota
    const totalJasaDibayarSemuaAnggotaResult = await client.query(
      `
            SELECT COALESCE(SUM(jasa_dibayar), 0) as total 
            FROM jadwal_angsuran 
            WHERE tgl_pembayaran BETWEEN $1 AND $2
        `,
      [tgl_mulai, tgl_selesai]
    );
    const totalJasaDibayarSemuaAnggota =
      parseFloat(totalJasaDibayarSemuaAnggotaResult.rows[0].total) || 1;

    // BARU: 8B. Hitung total belanja semua anggota pada periode ini
    const totalBelanjaSemuaAnggotaResult = await client.query(
      `SELECT COALESCE(SUM(total_belanja), 0) as total FROM belanja_anggota WHERE periode_id = $1`,
      [periode_id]
    );
    const totalBelanjaSemuaAnggota =
      parseFloat(totalBelanjaSemuaAnggotaResult.rows[0].total) || 1;

    // 9. Loop setiap anggota untuk menghitung poin dan SHU individu
    for (const anggota of anggotaResult.rows) {
      // Hitung poin dari simpanan Pokok & Wajib
      const pokokWajibResult = await client.query(
        `SELECT COALESCE(SUM(saldo), 0) as total FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan IN ('Pokok', 'Wajib')`,
        [anggota.id]
      );
      const poinPokokWajib = parseFloat(pokokWajibResult.rows[0].total) / 10000;

      // Hitung poin dari simpanan Sukarela (saldo rata-rata tahunan)
      let poinSukarela = 0;
      const sukarelaResult = await client.query(
        `SELECT id FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan = 'Sukarela'`,
        [anggota.id]
      );
      if (sukarelaResult.rows.length > 0) {
        const idRekeningSukarela = sukarelaResult.rows[0].id;
        for (let bulan = 1; bulan <= 12; bulan++) {
          const saldoBulanResult = await client.query(
            `SELECT COALESCE(SUM(CASE WHEN jenis_transaksi = 'Setor' THEN jumlah ELSE -jumlah END), 0) as saldo FROM transaksi_simpanan WHERE rekening_id = $1 AND EXTRACT(MONTH FROM tgl_transaksi) <= $2 AND EXTRACT(YEAR FROM tgl_transaksi) = $3`,
            [idRekeningSukarela, bulan, tahun]
          );
          const saldoAkhirBulan = parseFloat(saldoBulanResult.rows[0].saldo);
          let hargaSaham = 15000;
          if (saldoAkhirBulan > 20000000) hargaSaham = 35000;
          else if (saldoAkhirBulan > 15000000) hargaSaham = 30000;
          else if (saldoAkhirBulan > 10000000) hargaSaham = 25000;
          else if (saldoAkhirBulan > 5000000) hargaSaham = 20000;
          poinSukarela += saldoAkhirBulan / 12 / hargaSaham;
        }
      }

      // Hitung poin dari simpanan Lebaran
      const lebaranResult = await client.query(
        `SELECT COALESCE(SUM(saldo), 0) as total FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan = 'Lebaran'`,
        [anggota.id]
      );
      const poinLebaran = parseFloat(lebaranResult.rows[0].total) / 15000;

      const totalPoinPribadi = poinPokokWajib + poinSukarela + poinLebaran;
      totalPoinSimpananKeseluruhan += totalPoinPribadi;

      // Hitung SHU dari pinjaman
      const jasaPribadiResult = await client.query(
        `
                SELECT COALESCE(SUM(ja.jasa_dibayar), 0) as total 
                FROM jadwal_angsuran ja 
                JOIN rekening_pinjaman rp ON ja.rekening_pinjaman_id = rp.id 
                WHERE rp.anggota_id = $1 AND ja.tgl_pembayaran BETWEEN $2 AND $3
            `,
        [anggota.id, tgl_mulai, tgl_selesai]
      );
      const jasaPribadiDibayar = parseFloat(jasaPribadiResult.rows[0].total || 0);
      const shuDariPinjaman =
        (jasaPribadiDibayar / totalJasaDibayarSemuaAnggota) * alokasiUntukPeminjam;

      // BARU: Hitung SHU dari Belanja
      const belanjaPribadiResult = await client.query(
        `SELECT COALESCE(SUM(total_belanja), 0) as total FROM belanja_anggota WHERE anggota_id = $1 AND periode_id = $2`,
        [anggota.id, periode_id]
      );
      const belanjaPribadi = parseFloat(belanjaPribadiResult.rows[0].total || 0);
      const shuDariBelanja =
        (belanjaPribadi / totalBelanjaSemuaAnggota) *
        parseFloat(jasa_belanja_dikembalikan || 0);

      rincianAnggota.push({
        anggota_id: anggota.id,
        nama: anggota.nama,
        poinPokokWajib,
        poinSukarela,
        poinLebaran,
        totalPoin: totalPoinPribadi,
        shuDariPinjaman,
        shuDariBelanja, // BARU: Menambahkan data SHU dari belanja
      });
    }

    // 10. Hitung indeks poin dan alokasikan SHU simpanan ke setiap anggota
    const indeksPoin =
      totalPoinSimpananKeseluruhan > 0
        ? danaUntukAnggotaViaSimpanan / totalPoinSimpananKeseluruhan
        : 0;

    rincianAnggota = rincianAnggota.map((anggota) => {
      const shuPokokWajib = anggota.poinPokokWajib * indeksPoin;
      const shuSukarela = anggota.poinSukarela * indeksPoin;
      const shuLebaran = anggota.poinLebaran * indeksPoin;
      const shuTotalSimpanan = shuPokokWajib + shuSukarela + shuLebaran;
      // BARU: Menambahkan shuDariBelanja ke total yang diterima
      const shuTotalDiterima =
        shuTotalSimpanan + anggota.shuDariPinjaman + anggota.shuDariBelanja;
      return {
        ...anggota,
        shuPokokWajib,
        shuSukarela,
        shuLebaran,
        shuTotalSimpanan,
        shuTotalDiterima,
      };
    });

    // 11. Commit transaksi dan kirim respons
    await client.query("COMMIT");
    res.status(200).json({
      configs,
      saldoLaba,
      distribusi,
      danaUntukAnggotaViaSimpanan,
      alokasiUntukPeminjam,
      totalPoinSimpananKeseluruhan,
      indeksPoin,
      rincianAnggota,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saat menghitung SHU:", error);
    res.status(500).json({ message: "Gagal menghitung SHU" });
  } finally {
    client.release();
  }
};

// FUNGSI BARU: Mengambil ringkasan saldo akhir 
// Mengambil saldo akhir setiap akun pada periode tertentu.
export const getBukuBesarSummary = async (req, res) => {
    const { periode_id } = req.query;
    if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });

    try {
        const query = `
            SELECT 
                k.id, k.kode, k.nama_akun, k.posisi_saldo,
                COALESCE(SUM(j.debit), 0) as total_debit,
                COALESCE(SUM(j.kredit), 0) as total_kredit
            FROM kode_akun k
            LEFT JOIN jurnal_umum j ON k.id = j.akun_id AND j.periode_id = $1
            GROUP BY k.id
            ORDER BY k.kode;
        `;
        const result = await db.query(query, [periode_id]);

        const daftarAkun = result.rows.map(akun => {
            let saldoAkhir = (akun.posisi_saldo === 'debit')
                ? parseFloat(akun.total_debit) - parseFloat(akun.total_kredit)
                : parseFloat(akun.total_kredit) - parseFloat(akun.total_debit);
            return { ...akun, saldo_akhir: saldoAkhir };
        }).filter(akun => akun.total_debit > 0 || akun.total_kredit > 0 || akun.saldo_akhir !== 0); // Tampilkan akun yang memiliki saldo akhir juga.

        res.status(200).json(daftarAkun);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil ringkasan buku besar' });
    }
};

// FUNGSI BARU: Mengambil rincian transaksi satu akun
// Mengambil detail transaksi untuk satu akun pada periode tertentu.
export const getBukuBesarDetail = async (req, res) => {
    const { akun_id, periode_id } = req.query;
    if (!akun_id || !periode_id) return res.status(400).json({ message: 'ID Akun dan ID Periode dibutuhkan' });

    try {
        // Query untuk mengambil info akun
        const akunQuery = 'SELECT kode, nama_akun, posisi_saldo FROM kode_akun WHERE id = $1';
        const akunResult = await db.query(akunQuery, [akun_id]);
        if(akunResult.rows.length === 0) return res.status(404).json({ message: 'Akun tidak ditemukan' });

        // Query untuk mengambil transaksi
        const trxQuery = `
            SELECT tgl_transaksi, keterangan, debit, kredit
            FROM jurnal_umum
            WHERE akun_id = $1 AND periode_id = $2
            ORDER BY tgl_transaksi ASC, id ASC;
        `;
        const trxResult = await db.query(trxQuery, [akun_id, periode_id]);

        res.status(200).json({
            akun: akunResult.rows[0],
            transaksi: trxResult.rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil detail buku besar' });
    }
};


// --- FUNGSI BARU UNTUK EKSPOR NERACA ---
export const exportNeraca = async (req, res) => {
  const { periode_id } = req.query;
  if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });

  try {
    // 1. Ambil data neraca (memanggil fungsi getNeraca secara internal)
    const mockReq = { query: { periode_id } };
    let neracaData;
    const mockRes = {
      status: () => mockRes,
      json: (data) => { neracaData = data; }
    };
    await getNeraca(mockReq, mockRes);

    if (!neracaData) {
        throw new Error("Gagal mendapatkan data neraca untuk ekspor.");
    }

    // 2. Buat file Excel menggunakan ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Neraca');

    // Judul
    worksheet.addRow(['Laporan Neraca']);
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').font = { bold: true, size: 16, name: 'Calibri' };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.addRow([]);

    // Header Aktiva
    worksheet.addRow(['AKTIVA']);
    worksheet.getCell('A3').font = { bold: true, color: { argb: 'FF0000FF' } };
    const headerAktiva = worksheet.addRow(['Kode Akun', 'Nama Akun', 'Saldo']);
    headerAktiva.font = { bold: true };

    // Data Aktiva
    neracaData.aset.forEach(akun => {
      const row = worksheet.addRow([akun.kode, akun.nama_akun, akun.saldo]);
      row.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    });
    const totalAktivaRow = worksheet.addRow(['', 'Total Aktiva', neracaData.totalAset]);
    totalAktivaRow.font = { bold: true };
    totalAktivaRow.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    worksheet.addRow([]);

    // Header Pasiva
    worksheet.addRow(['PASIVA']);
    worksheet.lastRow.getCell(1).font = { bold: true, color: { argb: 'FF0000FF' } };
    const headerPasiva = worksheet.addRow(['Kode Akun', 'Nama Akun', 'Saldo']);
    headerPasiva.font = { bold: true };

    // Data Kewajiban
    worksheet.addRow(['', 'Kewajiban', '']).font = { italic: true };
    neracaData.kewajiban.forEach(akun => {
      const row = worksheet.addRow([akun.kode, akun.nama_akun, akun.saldo]);
      row.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    });
    const totalKewajibanRow = worksheet.addRow(['', 'Total Kewajiban', neracaData.totalKewajiban]);
    totalKewajibanRow.font = { bold: true };
    totalKewajibanRow.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    
    // Data Modal
    worksheet.addRow(['', 'Modal', '']).font = { italic: true };
    neracaData.modal.forEach(akun => {
      const row = worksheet.addRow([akun.kode, akun.nama_akun, akun.saldo]);
      row.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    });
    const totalModalRow = worksheet.addRow(['', 'Total Modal', neracaData.totalModal]);
    totalModalRow.font = { bold: true };
    totalModalRow.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    
    // Total Pasiva
    const totalPasivaRow = worksheet.addRow(['', 'Total Kewajiban & Modal', neracaData.totalKewajibanDanModal]);
    totalPasivaRow.font = { bold: true };
    totalPasivaRow.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    
    // Atur lebar kolom
    worksheet.columns.forEach(column => {
        column.width = column.header === 'Nama Akun' ? 40 : 15;
    });

    // 3. Kirim file ke browser
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Laporan_Neraca.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Error saat ekspor neraca:", error);
    res.status(500).json({ message: "Gagal mengekspor laporan." });
  }
};


// --- FUNGSI BARU UNTUK EKSPOR LABA RUGI ---
export const exportLabaRugi = async (req, res) => {
  const { periode_id } = req.query;
  if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });

  try {
    // 1. Ambil data laba rugi (memanggil fungsi getLabaRugi secara internal)
    const mockReq = { query: { periode_id } };
    let labaRugiData;
    const mockRes = {
      status: () => mockRes,
      json: (data) => { labaRugiData = data; }
    };
    await getLabaRugi(mockReq, mockRes);

    if (!labaRugiData) {
      throw new Error("Gagal mendapatkan data laba rugi untuk ekspor.");
    }

    // 2. Buat file Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laba_Rugi');

    // Judul
    worksheet.addRow(['Laporan Laba Rugi']);
    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').font = { bold: true, size: 16, name: 'Calibri' };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.addRow([]);

    // Pendapatan
    worksheet.addRow(['Pendapatan']).font = { bold: true, size: 14 };
    labaRugiData.pendapatan.forEach(item => {
      const row = worksheet.addRow([item.nama_akun, item.total]);
      row.getCell(2).numFmt = '"Rp "#,##0.00';
    });
    const totalPendapatanRow = worksheet.addRow(['Total Pendapatan', labaRugiData.totalPendapatan]);
    totalPendapatanRow.font = { bold: true };
    totalPendapatanRow.getCell(2).numFmt = '"Rp "#,##0.00';
    worksheet.addRow([]);

    // Beban
    worksheet.addRow(['Beban']).font = { bold: true, size: 14 };
    labaRugiData.beban.forEach(item => {
      const row = worksheet.addRow([item.nama_akun, item.total]);
      row.getCell(2).numFmt = '"Rp "#,##0.00';
    });
    const totalBebanRow = worksheet.addRow(['Total Beban', labaRugiData.totalBeban]);
    totalBebanRow.font = { bold: true };
    totalBebanRow.getCell(2).numFmt = '"Rp "#,##0.00';
    worksheet.addRow([]);

    // Laba/Rugi
    const labaRugiRow = worksheet.addRow(['Sisa Hasil Usaha (Laba/Rugi)', labaRugiData.labaRugi]);
    labaRugiRow.font = { bold: true, size: 12, color: { argb: labaRugiData.labaRugi >= 0 ? 'FF008000' : 'FFFF0000' } };
    labaRugiRow.getCell(2).numFmt = '"Rp "#,##0.00';
    
    // Atur lebar kolom
    worksheet.getColumn('A').width = 40;
    worksheet.getColumn('B').width = 20;

    // 3. Kirim file ke browser
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Laporan_Laba_Rugi.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Error saat ekspor laba rugi:", error);
    res.status(500).json({ message: "Gagal mengekspor laporan." });
  }
};