import db from '../config/db.js';

// ============================================================
// BAGIAN 1: FUNGSI YANG HILANG (TAPI WAJIB ADA)
// ============================================================

// Agar error "export named 'getAllPeriode'" hilang
export const getAllPeriode = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM periode_akuntansi ORDER BY tgl_mulai DESC;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getAllPeriode:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar periode' });
  }
};

// Agar error "export named 'getPeriodeById'" hilang
export const getPeriodeById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM periode_akuntansi WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Periode tidak ditemukan' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error getPeriodeById:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// ============================================================
// BAGIAN 2: KODE ASLI ANDA (LOGIKA TUTUP BUKU YANG SUDAH BENAR)
// ============================================================

export const tutupBuku = async (req, res) => {
  const { id } = req.params; // <-- TERIMA ID DARI URL
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Temukan periode SPESIFIK berdasarkan ID
    const periodeAktifResult = await client.query(
        "SELECT * FROM periode_akuntansi WHERE id = $1 AND status = 'open';", 
        [id]
    );

    if (periodeAktifResult.rows.length === 0) {
      throw new Error("Periode tidak ditemukan atau sudah ditutup.");
    }
    const periodeAktif = periodeAktifResult.rows[0];

    // 2. Hitung SHU (Laba/Rugi)
    const labaRugiResult = await client.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN k.header_akun = 'PENDAPATAN' THEN j.kredit - j.debit ELSE 0 END), 0) as total_pendapatan,
        COALESCE(SUM(CASE WHEN k.header_akun = 'BEBAN' THEN j.debit - j.kredit ELSE 0 END), 0) as total_beban
      FROM jurnal_umum j
      JOIN kode_akun k ON j.akun_id = k.id
      WHERE j.periode_id = $1;
    `, [periodeAktif.id]);
    
    const { total_pendapatan, total_beban } = labaRugiResult.rows[0];
    const shuFinal = parseFloat(total_pendapatan) - parseFloat(total_beban);

    // 3. Buat Jurnal Penutup
    const keteranganJurnalPenutup = `Jurnal Penutup Periode: ${periodeAktif.nama_periode}`;
    const AKUN_SHU_ID = 32; 

    // Tutup Pendapatan
    await client.query(`
      INSERT INTO jurnal_umum (tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id)
      SELECT $1, $2, j.akun_id, (SUM(j.kredit) - SUM(j.debit)), 0, $3
      FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id
      WHERE j.periode_id = $3 AND k.header_akun = 'PENDAPATAN'
      GROUP BY j.akun_id
    `, [periodeAktif.tgl_selesai, keteranganJurnalPenutup, periodeAktif.id]);

    // Tutup Beban
    await client.query(`
      INSERT INTO jurnal_umum (tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id)
      SELECT $1, $2, j.akun_id, 0, (SUM(j.debit) - SUM(j.kredit)), $3
      FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id
      WHERE j.periode_id = $3 AND k.header_akun = 'BEBAN'
      GROUP BY j.akun_id
    `, [periodeAktif.tgl_selesai, keteranganJurnalPenutup, periodeAktif.id]);

    // Pindahkan SHU ke Modal
    await client.query(
        `INSERT INTO jurnal_umum(tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [periodeAktif.tgl_selesai, keteranganJurnalPenutup, AKUN_SHU_ID, shuFinal > 0 ? 0 : -shuFinal, shuFinal > 0 ? shuFinal : 0, periodeAktif.id]
    );

    // 4. Update Status Periode INI menjadi Closed
    await client.query("UPDATE periode_akuntansi SET status = 'closed' WHERE id = $1;", [periodeAktif.id]);

    // 5. CEK APAKAH PERIODE TAHUN DEPAN SUDAH ADA?
    const tahunBerikutnya = new Date(periodeAktif.tgl_selesai).getFullYear() + 1;
    const cekPeriodeNext = await client.query(
        "SELECT * FROM periode_akuntansi WHERE date_part('year', tgl_mulai) = $1", 
        [tahunBerikutnya]
    );

    let periodeBaruId;

    if (cekPeriodeNext.rows.length > 0) {
        // Jika tahun depan sudah ada, pakai ID yang sudah ada
        periodeBaruId = cekPeriodeNext.rows[0].id;
    } else {
        // Jika belum ada, baru buat
        const periodeBaru = {
            nama: `Tahun Buku ${tahunBerikutnya}`,
            mulai: `${tahunBerikutnya}-01-01`,
            selesai: `${tahunBerikutnya}-12-31`
        };
        const newPeriodeResult = await client.query(
            'INSERT INTO periode_akuntansi (nama_periode, tgl_mulai, tgl_selesai, status) VALUES ($1, $2, $3, \'open\') RETURNING id',
            [periodeBaru.nama, periodeBaru.mulai, periodeBaru.selesai]
        );
        periodeBaruId = newPeriodeResult.rows[0].id;
    }

    // 6. Buat Jurnal Saldo Awal di Periode Berikutnya
    const saldoAkhirResult = await client.query(`
        SELECT akun_id, SUM(debit) as total_debit, SUM(kredit) as total_kredit
        FROM jurnal_umum
        WHERE periode_id = $1
        GROUP BY akun_id
    `, [periodeAktif.id]);

    for(const saldo of saldoAkhirResult.rows) {
        const saldoAkhir = parseFloat(saldo.total_debit) - parseFloat(saldo.total_kredit);
        if (saldoAkhir !== 0) {
            const cekSaldoAwal = await client.query(
                "SELECT id FROM jurnal_umum WHERE periode_id = $1 AND akun_id = $2 AND keterangan = 'Saldo Awal'",
                [periodeBaruId, saldo.akun_id]
            );

            if (cekSaldoAwal.rows.length === 0) {
                 await client.query(
                    'INSERT INTO jurnal_umum(tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5, $6)',
                    [`${tahunBerikutnya}-01-01`, 'Saldo Awal', saldo.akun_id, saldoAkhir > 0 ? saldoAkhir : 0, saldoAkhir < 0 ? -saldoAkhir : 0, periodeBaruId]
                );
            }
        }
    }

    await client.query('COMMIT');
    res.status(200).json({ message: `Periode ${periodeAktif.nama_periode} berhasil ditutup.` });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saat proses tutup buku:', error);
    res.status(500).json({ message: error.message || 'Proses tutup buku gagal.' });
  } finally {
    client.release();
  }
};

// ============================================================
// BAGIAN 3: FUNGSI MEMBUAT PERIODE (SUDAH BENAR)
// ============================================================

export const createPeriode = async (req, res) => {
    const { nama_periode, tgl_mulai, tgl_selesai } = req.body;

    if (!nama_periode || !tgl_mulai || !tgl_selesai) {
        return res.status(400).json({ message: 'Mohon lengkapi semua data' });
    }

    try {
        const result = await db.query(
            "INSERT INTO periode_akuntansi (nama_periode, tgl_mulai, tgl_selesai, status) VALUES ($1, $2, $3, 'open') RETURNING *",
            [nama_periode, tgl_mulai, tgl_selesai]
        );

        res.status(201).json({ message: 'Periode berhasil dibuat', data: result.rows[0] });
    } catch (error) {
        console.error('Error saat membuat periode:', error);
        res.status(500).json({ message: 'Gagal membuat periode baru' });
    }
};

// ... (kode sebelumnya)

// --- VERSI FINAL: POSTING SHU (AMAN & TANGGAL SESUAI) ---
export const postingDistribusiSHU = async (req, res) => {
    const { periode_id } = req.body; 
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // 1. Cek Periode & Statusnya
        // Kita ambil tgl_selesai agar transaksi masuk ke laporan tahun tersebut!
        const periodeRes = await client.query("SELECT * FROM periode_akuntansi WHERE id = $1", [periode_id]);
        if (periodeRes.rows.length === 0) throw new Error("Periode tidak ditemukan.");
        
        const periode = periodeRes.rows[0];

        // CEK 1: Apakah sudah pernah dibagi?
        if (periode.is_distributed) {
            throw new Error("SHU untuk periode ini SUDAH DIBAGIKAN sebelumnya. Tidak bisa membagikan ulang.");
        }

        // 2. Cek Hasil Perhitungan
        const cekHasil = await client.query("SELECT * FROM hasil_shu_anggota WHERE periode_id = $1", [periode_id]);
        if (cekHasil.rows.length === 0) throw new Error("Harap lakukan Perhitungan SHU terlebih dahulu.");

        // 3. Persiapan Data
        const configsRes = await client.query("SELECT key, nilai FROM konfigurasi_shu");
        const configs = configsRes.rows.reduce((acc, row) => ({ ...acc, [row.key]: parseFloat(row.nilai) }), {});

        const totalSHUAnggotaRes = await client.query("SELECT SUM(total_diterima) as total FROM hasil_shu_anggota WHERE periode_id = $1", [periode_id]);
        const totalSHUAnggota = parseFloat(totalSHUAnggotaRes.rows[0].total) || 0;

        const akunSHUTahunBerjalanID = 32; 
        const saldoSHURes = await client.query(`
            SELECT (SUM(kredit) - SUM(debit)) as saldo 
            FROM jurnal_umum 
            WHERE akun_id = $1 AND periode_id = $2`, 
            [akunSHUTahunBerjalanID, periode_id]
        );
        const totalSHUKotor = parseFloat(saldoSHURes.rows[0].saldo) || 0;

        const nominalCadangan = totalSHUKotor * (configs.shu_cadangan / 100);
        const nominalSosial = totalSHUKotor * (configs.shu_sosial / 100);
        
        // 4. BUAT JURNAL UMUM
        // PENTING: Gunakan tgl_selesai periode (misal 31 Des 2024), JANGAN hari ini.
        // Supaya masuk ke Neraca Akhir Tahun tersebut.
        const tglTransaksi = new Date(periode.tgl_selesai).toISOString().split('T')[0];
        const ket = `Pembagian SHU Tunai: ${periode.nama_periode}`;

        // A. Debit SHU Tahun Berjalan (Hapus Laba Sementara)
        await client.query(
            "INSERT INTO jurnal_umum (tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5, $6)",
            [tglTransaksi, ket, akunSHUTahunBerjalanID, totalSHUKotor, 0, periode_id]
        );

        // B. Kredit Cadangan
        await client.query(
            "INSERT INTO jurnal_umum (tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5, $6)",
            [tglTransaksi, ket, 31, 0, nominalCadangan, periode_id]
        );

        // C. Kredit Dana Sosial
        if(nominalSosial > 0) {
             await client.query(
                "INSERT INTO jurnal_umum (tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5, $6)",
                [tglTransaksi, ket, 33, 0, nominalSosial, periode_id]
            );
        }

        // D. Kredit KAS (Uang Keluar Tunai ke Anggota)
        // Pastikan ID 1 adalah KAS (atau sesuaikan dengan DB Anda)
        const AKUN_KAS_ID = 11; 
        if (totalSHUAnggota > 0) {
            await client.query(
                "INSERT INTO jurnal_umum (tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5, $6)",
                [tglTransaksi, ket, AKUN_KAS_ID, 0, totalSHUAnggota, periode_id]
            );
        }

        // 5. UPDATE STATUS PERIODE (KUNCI TOMBOL)
        await client.query("UPDATE periode_akuntansi SET is_distributed = TRUE WHERE id = $1", [periode_id]);

        await client.query('COMMIT');
        res.status(200).json({ message: 'SHU berhasil dibagikan (Tunai). Jurnal tercatat & Periode ditandai selesai.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error posting distribusi SHU:', error);
        res.status(500).json({ message: error.message || 'Gagal memposting distribusi SHU.' });
    } finally {
        client.release();
    }
};