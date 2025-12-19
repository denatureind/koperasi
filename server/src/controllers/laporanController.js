import db from '../config/db.js';
import ExcelJS from 'exceljs';

/**
 * FUNGSI PENTING: Mengambil daftar periode untuk dropdown
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
 */
export const getJurnalUmum = async (req, res) => {
    const { periode_id, page = 1, limit = 10, startDate, endDate, search } = req.query;
    
    if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });

    const offset = (page - 1) * limit;

    try {
        // --- 1. MEMBANGUN FILTER DINAMIS ---
        let filterClause = '';
        let queryParams = [periode_id, limit, offset]; // $1, $2, $3 sudah dipake
        let paramCounter = 4; // Mulai dari $4

        // Filter Tanggal
        if (startDate && endDate) {
            filterClause += ` AND j.tgl_transaksi BETWEEN $${paramCounter} AND $${paramCounter + 1}`;
            queryParams.push(startDate, endDate);
            paramCounter += 2;
        }

        // Filter Pencarian (Search)
        if (search) {
            // Mencari di Keterangan ATAU Nama Akun ATAU Kode Akun
            filterClause += ` AND (j.keterangan ILIKE $${paramCounter} OR k.nama_akun ILIKE $${paramCounter} OR k.kode ILIKE $${paramCounter})`;
            queryParams.push(`%${search}%`); // Tambahkan % untuk wildcard SQL
            paramCounter += 1;
        }

        // --- 2. QUERY AMBIL DATA ---
        const dataQuery = `
            SELECT j.id, j.tgl_transaksi, j.keterangan, j.debit, j.kredit, k.kode AS kode_akun, k.nama_akun 
            FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id
            WHERE j.periode_id = $1 ${filterClause}
            ORDER BY j.tgl_transaksi DESC, j.id DESC
            LIMIT $2 OFFSET $3;
        `;

        // --- 3. QUERY HITUNG TOTAL (Untuk Paginasi) ---
        // Kita butuh param yang sama TAPI tanpa limit & offset
        // Parameternya: [periode_id, startDate, endDate, search] (urutan harus sama logic-nya)
        let countParams = [periode_id];
        let countClause = '';
        let countCounter = 2;

        if (startDate && endDate) {
            countClause += ` AND j.tgl_transaksi BETWEEN $${countCounter} AND $${countCounter + 1}`;
            countParams.push(startDate, endDate);
            countCounter += 2;
        }

        if (search) {
            countClause += ` AND (j.keterangan ILIKE $${countCounter} OR k.nama_akun ILIKE $${countCounter} OR k.kode ILIKE $${countCounter})`;
            countParams.push(`%${search}%`);
            countCounter += 1;
        }

        const countQuery = `
            SELECT COUNT(*) as total 
            FROM jurnal_umum j 
            JOIN kode_akun k ON j.akun_id = k.id
            WHERE j.periode_id = $1 ${countClause};
        `;

        const dataResult = await db.query(dataQuery, queryParams);
        const countResult = await db.query(countQuery, countParams);

        res.status(200).json({
            data: dataResult.rows,
            total: parseInt(countResult.rows[0].total),
            page: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (error) {
        console.error('Error saat mengambil jurnal umum:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};
/**
 * Fungsi untuk membuat laporan Neraca
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

        // Menambahkan Laba/Rugi ke Modal
        const labaRugiPeriodeIni = totalPendapatan - totalBeban;
        laporan.modal.push({ kode: '', nama_akun: 'Laba/Rugi Periode Ini', saldo: labaRugiPeriodeIni });

        laporan.totalAset = totalAset;
        laporan.totalKewajiban = totalKewajiban;
        laporan.totalModal = totalModal + labaRugiPeriodeIni; 
        laporan.totalKewajibanDanModal = laporan.totalKewajiban + laporan.totalModal;

        res.status(200).json(laporan);

    } catch (error) {
        console.error('Error saat membuat laporan neraca:', error);
        res.status(500).json({ message: 'Gagal membuat laporan neraca' });
    }
};

/**
 * Fungsi untuk membuat laporan Laba Rugi
 */
export const getLabaRugi = async (req, res) => {
    const { periode_id } = req.query;
    if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });

    try {
        // QUERY: Mengambil semua akun Pendapatan/Beban/Biaya
        // Kita gunakan ILIKE agar fleksibel (tidak peduli huruf besar/kecil)
        const query = `
            SELECT 
                k.header_akun, k.nama_akun, k.posisi_saldo,
                COALESCE(SUM(j.debit), 0) AS total_debit,
                COALESCE(SUM(j.kredit), 0) AS total_kredit
            FROM kode_akun k
            LEFT JOIN jurnal_umum j ON k.id = j.akun_id AND j.periode_id = $1
            WHERE 
                k.header_akun ILIKE '%PENDAPATAN%' OR 
                k.header_akun ILIKE '%BEBAN%' OR 
                k.header_akun ILIKE '%BIAYA%'
            GROUP BY k.id, k.header_akun, k.nama_akun, k.posisi_saldo;
        `;
        const result = await db.query(query, [periode_id]);

        const laporan = { pendapatan: [], beban: [], totalPendapatan: 0, totalBeban: 0, labaRugi: 0 };
        
        result.rows.forEach(akun => {
            // 1. Hitung Saldo Akhir
            let saldo = (akun.posisi_saldo === 'debit')
                ? parseFloat(akun.total_debit) - parseFloat(akun.total_kredit)
                : parseFloat(akun.total_kredit) - parseFloat(akun.total_debit);

            // 2. FILTER PENTING: Jika saldo 0, lewati (jangan dimasukkan ke laporan)
            if (saldo === 0) return; 

            const header = akun.header_akun.toUpperCase();

            // 3. Masukkan ke kategori yang sesuai
            if (header.includes('PENDAPATAN')) {
                laporan.pendapatan.push({ nama_akun: akun.nama_akun, total: saldo });
                laporan.totalPendapatan += saldo;
            } 
            else if (header.includes('BEBAN') || header.includes('BIAYA')) {
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


// =================================================================
// FUNGSI hitungSHU (DIPERBAIKI: Key & Logika)
// =================================================================
export const hitungSHU = async (req, res) => {
    const { periode_id, jasa_belanja_dikembalikan } = req.query;

    if (!periode_id) {
        return res.status(400).json({ message: "ID Periode dibutuhkan" });
    }
    
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        // 1. Ambil Data Periode
        const periodeResult = await client.query(
            "SELECT tgl_mulai, tgl_selesai FROM periode_akuntansi WHERE id = $1",
            [periode_id]
        );
        if (periodeResult.rows.length === 0) {
            throw new Error(`Periode dengan ID ${periode_id} tidak ditemukan.`);
        }
        const { tgl_mulai, tgl_selesai } = periodeResult.rows[0];
        const tahun = new Date(tgl_mulai).getFullYear();

        // 2. Ambil Konfigurasi SHU (PERBAIKAN: Gunakan kolom 'key')
        const configs = (
            await client.query("SELECT key, nilai FROM konfigurasi_shu")
        ).rows.reduce(
            (acc, row) => ({ ...acc, [row.key]: parseFloat(row.nilai) }),
            {}
        );

        // -- MAPPING DATA KONFIGURASI (Agar sesuai dengan Database Baru) --
        // Database key: shu_anggota, shu_cadangan, shu_pengurus, dll
        const persenAnggota = configs.shu_anggota || 0;
        const persenCadangan = configs.shu_cadangan || 0;
        const persenPengurus = configs.shu_pengurus || 0;
        const persenSosial = configs.shu_sosial || 0; 
        const persenJasaPeminjam = configs.shu_jasa_pinjaman || 0; // Default 0 jika belum diset
        const hargaPoinBelanja = configs.harga_poin_belanja || 10000; // Default 10rb jika belum diset

        // 3. Hitung SHU Kotor (Pendapatan - Beban)
        const labaRugiResult = await client.query(
            `SELECT k.header_akun, SUM(j.kredit) - SUM(j.debit) as saldo 
             FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id 
             WHERE (k.header_akun = 'PENDAPATAN' OR k.header_akun = 'BEBAN') 
             AND j.periode_id = $1 GROUP BY k.header_akun;`,
            [periode_id]
        );
        let totalPendapatan = 0, totalBeban = 0;
        labaRugiResult.rows.forEach((row) => {
            if (row.header_akun === "PENDAPATAN") totalPendapatan = parseFloat(row.saldo) || 0;
            if (row.header_akun === "BEBAN") totalBeban = parseFloat(row.saldo) * -1 || 0;
        });
        const shuKotor = totalPendapatan - totalBeban;

        // 4. Hitung Alokasi Dasar
        // Hitung dulu jatah untuk peminjam (jika ada aturannya)
        const jasaResult = await client.query(
            `SELECT COALESCE(SUM(kredit) - SUM(debit), 0) as total FROM jurnal_umum WHERE akun_id = 41 AND periode_id = $1;`,
            [periode_id]
        );
        const totalJasaPinjaman = parseFloat(jasaResult.rows[0].total);
        const alokasiUntukPeminjam = totalJasaPinjaman * (persenJasaPeminjam / 100);
        
        // Sisa SHU untuk dibagikan
        const saldoLaba = shuKotor - alokasiUntukPeminjam;

        // Hitung nominal distribusi
        const danaUntukAnggotaViaSimpanan = saldoLaba * (persenAnggota / 100);

        const distribusi = {
            anggota: danaUntukAnggotaViaSimpanan,
            cadangan: saldoLaba * (persenCadangan / 100),
            danaSosial: saldoLaba * (persenSosial / 100),
            pengurus: saldoLaba * (persenPengurus / 100),
        };
        
        // 5. Ambil Data Pendukung
        const pemerataanRes = await client.query('SELECT anggota_id, jumlah FROM shu_pemerataan WHERE periode_id = $1', [periode_id]);
        const pemerataanMap = pemerataanRes.rows.reduce((map, row) => {
            map[row.anggota_id] = parseFloat(row.jumlah);
            return map;
        }, {});

        const anggotaResult = await client.query("SELECT id, nama, kode_anggota FROM anggota WHERE status = 'aktif';");
        let rincianAnggota = [];
        let totalPoinSimpananKeseluruhan = 0;

        const totalJasaDibayarSemuaAnggotaResult = await client.query(
            `SELECT COALESCE(SUM(jasa_dibayar), 0) as total FROM jadwal_angsuran WHERE tgl_pembayaran BETWEEN $1 AND $2`,
            [tgl_mulai, tgl_selesai]
        );
        const totalJasaDibayarSemuaAnggota = parseFloat(totalJasaDibayarSemuaAnggotaResult.rows[0].total) || 1;

        const totalBelanjaSemuaAnggotaResult = await client.query(
            `SELECT COALESCE(SUM(total_belanja), 0) as total FROM belanja_anggota WHERE periode_id = $1`,
            [periode_id]
        );
        const totalBelanjaSemuaAnggota = parseFloat(totalBelanjaSemuaAnggotaResult.rows[0].total) || 1;

        // 6. Loop Perhitungan Per Anggota
        for (const anggota of anggotaResult.rows) {
            // --- A. Hitung Poin Simpanan ---
            const pokokWajibResult = await client.query(`SELECT COALESCE(SUM(saldo), 0) as total FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan IN ('Pokok', 'Wajib')`, [anggota.id]);
            const poinPokokWajib = parseFloat(pokokWajibResult.rows[0].total) / 10000;
            
            let poinSukarela = 0;
            const sukarelaResult = await client.query(`SELECT id FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan = 'Sukarela'`, [anggota.id]);
            if (sukarelaResult.rows.length > 0) {
                const idRekeningSukarela = sukarelaResult.rows[0].id;
                for (let bulan = 1; bulan <= 12; bulan++) {
                    const saldoBulanResult = await client.query(`SELECT COALESCE(SUM(CASE WHEN jenis_transaksi = 'Setor' THEN jumlah ELSE -jumlah END), 0) as saldo FROM transaksi_simpanan WHERE rekening_id = $1 AND EXTRACT(MONTH FROM tgl_transaksi) <= $2 AND EXTRACT(YEAR FROM tgl_transaksi) = $3`, [idRekeningSukarela, bulan, tahun]);
                    const saldoAkhirBulan = parseFloat(saldoBulanResult.rows[0].saldo);
                    let hargaSaham = 15000;
                    if (saldoAkhirBulan > 20000000) hargaSaham = 35000;
                    else if (saldoAkhirBulan > 15000000) hargaSaham = 30000;
                    else if (saldoAkhirBulan > 10000000) hargaSaham = 25000;
                    else if (saldoAkhirBulan > 5000000) hargaSaham = 20000;
                    poinSukarela += saldoAkhirBulan / 12 / hargaSaham;
                }
            }

            const lebaranResult = await client.query(`SELECT COALESCE(SUM(saldo), 0) as total FROM rekening_simpanan WHERE anggota_id = $1 AND jenis_simpanan = 'Lebaran'`, [anggota.id]);
            const poinLebaran = parseFloat(lebaranResult.rows[0].total) / 15000;
            const totalPoinPribadi = poinPokokWajib + poinSukarela + poinLebaran;
            totalPoinSimpananKeseluruhan += totalPoinPribadi;

            // --- B. Hitung SHU Pinjaman ---
            const jasaPribadiResult = await client.query(`SELECT COALESCE(SUM(ja.jasa_dibayar), 0) as total FROM jadwal_angsuran ja JOIN rekening_pinjaman rp ON ja.rekening_pinjaman_id = rp.id WHERE rp.anggota_id = $1 AND ja.tgl_pembayaran BETWEEN $2 AND $3`, [anggota.id, tgl_mulai, tgl_selesai]);
            const jasaPribadiDibayar = parseFloat(jasaPribadiResult.rows[0].total || 0);
            const shuDariPinjaman = (jasaPribadiDibayar / totalJasaDibayarSemuaAnggota) * alokasiUntukPeminjam;

            // --- C. Hitung SHU Belanja ---
            const belanjaPribadiResult = await client.query(`SELECT COALESCE(SUM(total_belanja), 0) as total FROM belanja_anggota WHERE anggota_id = $1 AND periode_id = $2`, [anggota.id, periode_id]);
            const belanjaPribadi = parseFloat(belanjaPribadiResult.rows[0].total || 0);
            const poinBelanja = belanjaPribadi / hargaPoinBelanja; // Gunakan variabel mapping
            const shuDariBelanja = (belanjaPribadi / totalBelanjaSemuaAnggota) * parseFloat(jasa_belanja_dikembalikan || 0);            
            
            // --- D. Ambil SHU Pemerataan ---
            const shuPemerataan = pemerataanMap[anggota.id] || 0;

            rincianAnggota.push({
                anggota_id: anggota.id,
                nama: anggota.nama,
                kode_anggota: anggota.kode_anggota,
                poinPokokWajib,
                poinSukarela,
                poinLebaran,
                totalPoin: totalPoinPribadi,
                poinBelanja,
                shuDariPinjaman,
                shuDariBelanja,
                shuPemerataan,
            });
        }

        // 7. Hitung Final Rupiah per Anggota
        const indeksPoin = totalPoinSimpananKeseluruhan > 0 ? danaUntukAnggotaViaSimpanan / totalPoinSimpananKeseluruhan : 0;

        rincianAnggota = rincianAnggota.map((anggota) => {
            const shuPokokWajib = anggota.poinPokokWajib * indeksPoin;
            const shuSukarela = anggota.poinSukarela * indeksPoin;
            const shuLebaran = anggota.poinLebaran * indeksPoin;
            const shuTotalSimpanan = shuPokokWajib + shuSukarela + shuLebaran;
            const shuTotalDiterima = shuTotalSimpanan + anggota.shuDariPinjaman + anggota.shuDariBelanja + anggota.shuPemerataan;
            
            return {
                ...anggota,
                shuPokokWajib,
                shuSukarela,
                shuLebaran,
                shuTotalSimpanan,
                shuTotalDiterima,
            };
        });

        // 8. Simpan Hasil
        await client.query("DELETE FROM hasil_shu_anggota WHERE periode_id = $1", [periode_id]);

        for (const hasil of rincianAnggota) {
            await client.query(`
                INSERT INTO hasil_shu_anggota 
                (periode_id, anggota_id, shu_simpanan, shu_pinjaman, shu_belanja, shu_pemerataan, total_diterima)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                periode_id, 
                hasil.anggota_id, 
                hasil.shuTotalSimpanan, 
                hasil.shuDariPinjaman, 
                hasil.shuDariBelanja, 
                hasil.shuPemerataan, 
                hasil.shuTotalDiterima
            ]);
        }

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
        }).filter(akun => akun.total_debit > 0 || akun.total_kredit > 0 || akun.saldo_akhir !== 0);

        res.status(200).json(daftarAkun);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil ringkasan buku besar' });
    }
};

export const getBukuBesarDetail = async (req, res) => {
    const { akun_id, periode_id } = req.query;
    if (!akun_id || !periode_id) return res.status(400).json({ message: 'ID Akun dan ID Periode dibutuhkan' });

    try {
        const akunQuery = 'SELECT kode, nama_akun, posisi_saldo FROM kode_akun WHERE id = $1';
        const akunResult = await db.query(akunQuery, [akun_id]);
        if(akunResult.rows.length === 0) return res.status(404).json({ message: 'Akun tidak ditemukan' });

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

export const exportNeraca = async (req, res) => {
  const { periode_id } = req.query;
  if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });

  try {
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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Neraca');

    worksheet.addRow(['Laporan Neraca']);
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').font = { bold: true, size: 16, name: 'Calibri' };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.addRow([]);

    worksheet.addRow(['AKTIVA']);
    worksheet.getCell('A3').font = { bold: true, color: { argb: 'FF0000FF' } };
    const headerAktiva = worksheet.addRow(['Kode Akun', 'Nama Akun', 'Saldo']);
    headerAktiva.font = { bold: true };

    neracaData.aset.forEach(akun => {
      const row = worksheet.addRow([akun.kode, akun.nama_akun, akun.saldo]);
      row.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    });
    const totalAktivaRow = worksheet.addRow(['', 'Total Aktiva', neracaData.totalAset]);
    totalAktivaRow.font = { bold: true };
    totalAktivaRow.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    worksheet.addRow([]);

    worksheet.addRow(['PASIVA']);
    worksheet.lastRow.getCell(1).font = { bold: true, color: { argb: 'FF0000FF' } };
    const headerPasiva = worksheet.addRow(['Kode Akun', 'Nama Akun', 'Saldo']);
    headerPasiva.font = { bold: true };

    worksheet.addRow(['', 'Kewajiban', '']).font = { italic: true };
    neracaData.kewajiban.forEach(akun => {
      const row = worksheet.addRow([akun.kode, akun.nama_akun, akun.saldo]);
      row.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    });
    const totalKewajibanRow = worksheet.addRow(['', 'Total Kewajiban', neracaData.totalKewajiban]);
    totalKewajibanRow.font = { bold: true };
    totalKewajibanRow.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    
    worksheet.addRow(['', 'Modal', '']).font = { italic: true };
    neracaData.modal.forEach(akun => {
      const row = worksheet.addRow([akun.kode, akun.nama_akun, akun.saldo]);
      row.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    });
    const totalModalRow = worksheet.addRow(['', 'Total Modal', neracaData.totalModal]);
    totalModalRow.font = { bold: true };
    totalModalRow.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    
    const totalPasivaRow = worksheet.addRow(['', 'Total Kewajiban & Modal', neracaData.totalKewajibanDanModal]);
    totalPasivaRow.font = { bold: true };
    totalPasivaRow.getCell(3).numFmt = '"Rp "#,##0.00;[Red]"Rp "-#,##0.00';
    
    worksheet.columns.forEach(column => {
        column.width = column.header === 'Nama Akun' ? 40 : 15;
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Laporan_Neraca.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Error saat ekspor neraca:", error);
    res.status(500).json({ message: "Gagal mengekspor laporan." });
  }
};

export const exportLabaRugi = async (req, res) => {
  const { periode_id } = req.query;
  if (!periode_id) return res.status(400).json({ message: 'ID Periode dibutuhkan' });

  try {
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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laba_Rugi');

    worksheet.addRow(['Laporan Laba Rugi']);
    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').font = { bold: true, size: 16, name: 'Calibri' };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.addRow([]);

    worksheet.addRow(['Pendapatan']).font = { bold: true, size: 14 };
    labaRugiData.pendapatan.forEach(item => {
      const row = worksheet.addRow([item.nama_akun, item.total]);
      row.getCell(2).numFmt = '"Rp "#,##0.00';
    });
    const totalPendapatanRow = worksheet.addRow(['Total Pendapatan', labaRugiData.totalPendapatan]);
    totalPendapatanRow.font = { bold: true };
    totalPendapatanRow.getCell(2).numFmt = '"Rp "#,##0.00';
    worksheet.addRow([]);

    worksheet.addRow(['Beban']).font = { bold: true, size: 14 };
    labaRugiData.beban.forEach(item => {
      const row = worksheet.addRow([item.nama_akun, item.total]);
      row.getCell(2).numFmt = '"Rp "#,##0.00';
    });
    const totalBebanRow = worksheet.addRow(['Total Beban', labaRugiData.totalBeban]);
    totalBebanRow.font = { bold: true };
    totalBebanRow.getCell(2).numFmt = '"Rp "#,##0.00';
    worksheet.addRow([]);

    const labaRugiRow = worksheet.addRow(['Sisa Hasil Usaha (Laba/Rugi)', labaRugiData.labaRugi]);
    labaRugiRow.font = { bold: true, size: 12, color: { argb: labaRugiData.labaRugi >= 0 ? 'FF008000' : 'FFFF0000' } };
    labaRugiRow.getCell(2).numFmt = '"Rp "#,##0.00';
    
    worksheet.getColumn('A').width = 40;
    worksheet.getColumn('B').width = 20;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'Laporan_Laba_Rugi.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Error saat ekspor laba rugi:", error);
    res.status(500).json({ message: "Gagal mengekspor laporan." });
  }
};

export const exportSHU = async (req, res) => {
  const { periode_id, jasa_belanja_dikembalikan } = req.query;
  if (!periode_id) {
    return res.status(400).json({ message: 'ID Periode dibutuhkan' });
  }

  try {
    let shuData;
    const mockReq = { query: { periode_id, jasa_belanja_dikembalikan: jasa_belanja_dikembalikan || 0 } };
    const mockRes = {
      status: () => mockRes,
      json: (data) => { shuData = data; }
    };
    await hitungSHU(mockReq, mockRes);

    if (!shuData || !shuData.rincianAnggota) {
      throw new Error("Gagal mendapatkan data SHU untuk diekspor.");
    }

    shuData.rincianAnggota.sort((a, b) => a.nama.localeCompare(b.nama));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan SHU');

    worksheet.addRow(['Laporan Sisa Hasil Usaha (SHU)']).font = { bold: true, size: 16 };
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.addRow([]);

    const headerRow = worksheet.addRow([
      'Kode Anggota',
      'Nama Anggota',
      'SHU Simpanan',
      'SHU Pinjaman',
      'SHU Belanja',
      'SHU Pemerataan',
      'Total Diterima'
    ]);
    headerRow.font = { bold: true };
    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDDEBF7' }
      };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    shuData.rincianAnggota.forEach(anggota => {
      const row = worksheet.addRow([
        anggota.kode_anggota,
        anggota.nama,
        anggota.shuTotalSimpanan,
        anggota.shuDariPinjaman,
        anggota.shuDariBelanja,
        anggota.shuPemerataan,
        anggota.shuTotalDiterima
      ]);
      row.getCell(3).numFmt = '"Rp "#,##0';
      row.getCell(4).numFmt = '"Rp "#,##0';
      row.getCell(5).numFmt = '"Rp "#,##0';
      row.getCell(6).numFmt = '"Rp "#,##0';
      row.getCell(7).numFmt = '"Rp "#,##0';
    });

    worksheet.addRow([]);
    const totals = shuData.rincianAnggota.reduce((acc, item) => {
        acc.shuSimpanan += item.shuTotalSimpanan || 0;
        acc.shuPinjaman += item.shuDariPinjaman || 0;
        acc.shuBelanja += item.shuDariBelanja || 0;
        acc.shuPemerataan += item.shuPemerataan || 0;
        acc.shuTotal += item.shuTotalDiterima || 0;
        return acc;
    }, { shuSimpanan: 0, shuPinjaman: 0, shuBelanja: 0, shuPemerataan: 0, shuTotal: 0 });

    const totalRow = worksheet.addRow([
      '', 'TOTAL KESELURUHAN',
      totals.shuSimpanan,
      totals.shuPinjaman,
      totals.shuBelanja,
      totals.shuPemerataan,
      totals.shuTotal
    ]);
    totalRow.font = { bold: true };
    totalRow.getCell(2).alignment = { horizontal: 'right' };
    for (let i = 3; i <= 7; i++) {
        totalRow.getCell(i).numFmt = '"Rp "#,##0';
    }

    worksheet.getColumn('A').width = 15;
    worksheet.getColumn('B').width = 30;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 20;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Laporan_SHU.xlsx"');
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Error saat ekspor SHU:", error);
    res.status(500).json({ message: "Gagal mengekspor laporan SHU." });
  }
};

export const simpanJasaBelanja = async (req, res) => {
    const { periode_id, total_jasa_belanja } = req.body;

    if (!periode_id) {
        return res.status(400).json({ message: 'Periode ID dibutuhkan' });
    }

    try {
        const query = `
            UPDATE periode_akuntansi 
            SET total_jasa_belanja = $1 
            WHERE id = $2 
            RETURNING *;
        `;
        const result = await db.query(query, [total_jasa_belanja || 0, periode_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Periode tidak ditemukan' });
        }

        res.status(200).json({ message: 'Jasa belanja berhasil disimpan', data: result.rows[0] });
    } catch (error) {
        console.error('Error saat menyimpan jasa belanja:', error);
        res.status(500).json({ message: 'Gagal menyimpan data' });
    }
};

export const getHasilSHU = async (req, res) => {
    const { periode_id } = req.query;
    try {
        const queryMembers = `
            SELECT h.*, a.nama, a.kode_anggota 
            FROM hasil_shu_anggota h
            JOIN anggota a ON h.anggota_id = a.id
            WHERE h.periode_id = $1
            ORDER BY a.nama ASC;
        `;
        const resultMembers = await db.query(queryMembers, [periode_id]);

        if (resultMembers.rows.length === 0) {
            return res.status(200).json(null); 
        }
        
        // PERBAIKAN: Gunakan kolom 'key'
        const configsRes = await db.query("SELECT key, nilai FROM konfigurasi_shu");
        const configs = configsRes.rows.reduce((acc, row) => ({ ...acc, [row.key]: parseFloat(row.nilai) }), {});

        // -- MAPPING DATA AGAR TIDAK NAN --
        const persenAnggota = configs.shu_anggota || 0;
        const persenCadangan = configs.shu_cadangan || 0;
        const persenPengurus = configs.shu_pengurus || 0;
        const persenSosial = configs.shu_sosial || 0;
        const persenJasaPeminjam = configs.shu_jasa_pinjaman || 0;

        const labaRugiResult = await db.query(
            `SELECT k.header_akun, SUM(j.kredit) - SUM(j.debit) as saldo 
             FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id 
             WHERE (k.header_akun = 'PENDAPATAN' OR k.header_akun = 'BEBAN') 
             AND j.periode_id = $1 GROUP BY k.header_akun;`,
            [periode_id]
        );
        
        let totalPendapatan = 0, totalBeban = 0;
        labaRugiResult.rows.forEach((row) => {
            if (row.header_akun === "PENDAPATAN") totalPendapatan = parseFloat(row.saldo) || 0;
            if (row.header_akun === "BEBAN") totalBeban = parseFloat(row.saldo) * -1 || 0;
        });
        const shuKotor = totalPendapatan - totalBeban;

        const jasaResult = await db.query(
            `SELECT COALESCE(SUM(kredit) - SUM(debit), 0) as total FROM jurnal_umum WHERE akun_id = 41 AND periode_id = $1;`,
            [periode_id]
        );
        const totalJasaPinjaman = parseFloat(jasaResult.rows[0].total);
        const alokasiUntukPeminjam = totalJasaPinjaman * (persenJasaPeminjam / 100);
        
        const saldoLaba = shuKotor - alokasiUntukPeminjam;

        const distribusi = {
            anggota: saldoLaba * (persenAnggota / 100),
            cadangan: saldoLaba * (persenCadangan / 100),
            danaSosial: saldoLaba * (persenSosial / 100),
            pengurus: saldoLaba * (persenPengurus / 100),
        };

        res.status(200).json({
            isCached: true,
            configs: configs,
            saldoLaba: saldoLaba, 
            distribusi: distribusi, 
            rincianAnggota: resultMembers.rows.map(row => ({
                anggota_id: row.anggota_id,
                nama: row.nama,
                kode_anggota: row.kode_anggota,
                shuTotalSimpanan: parseFloat(row.shu_simpanan),
                shuDariPinjaman: parseFloat(row.shu_pinjaman),
                shuDariBelanja: parseFloat(row.shu_belanja),
                shuPemerataan: parseFloat(row.shu_pemerataan),
                shuTotalDiterima: parseFloat(row.total_diterima)
            }))
        });

    } catch (error) {
        console.error('Error ambil hasil SHU:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};