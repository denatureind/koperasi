import db from '../config/db.js';

// Tambahkan fungsi baru ini
export const getAllPeriode = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM periode_akuntansi ORDER BY tgl_mulai DESC;');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar periode' });
  }
};

export const tutupBuku = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Temukan periode yang aktif
    const periodeAktifResult = await client.query("SELECT * FROM periode_akuntansi WHERE status = 'open' LIMIT 1;");
    if (periodeAktifResult.rows.length === 0) {
      throw new Error("Tidak ada periode akuntansi yang aktif untuk ditutup.");
    }
    const periodeAktif = periodeAktifResult.rows[0];

    // 2. Hitung SHU (Laba/Rugi) final untuk periode tersebut
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

    // 3. Buat Jurnal Penutup (Closing Entries)
    const keteranganJurnalPenutup = `Jurnal Penutup Periode: ${periodeAktif.nama_periode}`;
    const AKUN_SHU_ID = 32; // ID Akun "Sisa Hasil Usaha (SHU)" di tabel kode_akun

    // Menutup semua akun Pendapatan ke SHU
    await client.query(`
      INSERT INTO jurnal_umum (tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id)
      SELECT $1, $2, j.akun_id, (SUM(j.kredit) - SUM(j.debit)), 0, $3
      FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id
      WHERE j.periode_id = $3 AND k.header_akun = 'PENDAPATAN'
      GROUP BY j.akun_id
    `, [periodeAktif.tgl_selesai, keteranganJurnalPenutup, periodeAktif.id]);

    // Menutup semua akun Beban ke SHU
    await client.query(`
      INSERT INTO jurnal_umum (tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id)
      SELECT $1, $2, j.akun_id, 0, (SUM(j.debit) - SUM(j.kredit)), $3
      FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id
      WHERE j.periode_id = $3 AND k.header_akun = 'BEBAN'
      GROUP BY j.akun_id
    `, [periodeAktif.tgl_selesai, keteranganJurnalPenutup, periodeAktif.id]);

    // Memindahkan total SHU ke akun Modal SHU
    await client.query(
        `INSERT INTO jurnal_umum(tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [periodeAktif.tgl_selesai, keteranganJurnalPenutup, AKUN_SHU_ID, shuFinal > 0 ? 0 : -shuFinal, shuFinal > 0 ? shuFinal : 0, periodeAktif.id]
    );

    // 4. "Kunci" periode lama
    await client.query("UPDATE periode_akuntansi SET status = 'closed' WHERE id = $1;", [periodeAktif.id]);

    // 5. Buat periode baru untuk tahun berikutnya
    const tahunBerikutnya = new Date(periodeAktif.tgl_selesai).getFullYear() + 1;
    const periodeBaru = {
      nama: `Tahun Buku ${tahunBerikutnya}`,
      mulai: `${tahunBerikutnya}-01-01`,
      selesai: `${tahunBerikutnya}-12-31`
    };
    const newPeriodeResult = await client.query(
        'INSERT INTO periode_akuntansi (nama_periode, tgl_mulai, tgl_selesai, status) VALUES ($1, $2, $3, \'open\') RETURNING id',
        [periodeBaru.nama, periodeBaru.mulai, periodeBaru.selesai]
    );
    const periodeBaruId = newPeriodeResult.rows[0].id;

    // 6. Buat Jurnal Saldo Awal (Opening Balance) untuk periode baru
    const saldoAkhirResult = await client.query(`
        SELECT akun_id, SUM(debit) as total_debit, SUM(kredit) as total_kredit
        FROM jurnal_umum
        WHERE periode_id = $1
        GROUP BY akun_id
    `, [periodeAktif.id]);

    for(const saldo of saldoAkhirResult.rows) {
        const saldoAkhir = parseFloat(saldo.total_debit) - parseFloat(saldo.total_kredit);
        if (saldoAkhir !== 0) {
            await client.query(
                'INSERT INTO jurnal_umum(tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5, $6)',
                [periodeBaru.mulai, 'Saldo Awal', saldo.akun_id, saldoAkhir > 0 ? saldoAkhir : 0, saldoAkhir < 0 ? -saldoAkhir : 0, periodeBaruId]
            );
        }
    }

    await client.query('COMMIT');
    res.status(200).json({ message: `Periode ${periodeAktif.nama_periode} berhasil ditutup. Periode ${periodeBaru.nama} telah dibuat.` });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saat proses tutup buku:', error);
    res.status(500).json({ message: 'Proses tutup buku gagal.' });
  } finally {
    client.release();
  }
};