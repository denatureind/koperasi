import db from '../config/db.js';
import { getPeriodeAktifId } from '../utils/periode.js';

// Pastikan ada 'export' di sini
export const getDashboardSummary = async (req, res) => {
  try {
    const periodeId = await getPeriodeAktifId();

    // 1. Total Anggota Aktif
    const anggotaResult = await db.query("SELECT COUNT(id) as total FROM anggota WHERE status = 'aktif';");
    const totalAnggota = parseInt(anggotaResult.rows[0].total);

    // 2. Total Saldo Semua Simpanan
    const simpananResult = await db.query("SELECT SUM(saldo) as total FROM rekening_simpanan;");
    const totalSimpanan = parseFloat(simpananResult.rows[0].total);

    // 3. Total Pinjaman Aktif (Sisa Pokok)
    const pinjamanResult = await db.query("SELECT SUM(sisa_pokok) as total FROM rekening_pinjaman WHERE status = 'aktif';");
    const totalPinjaman = parseFloat(pinjamanResult.rows[0].total);

    // 4. SHU Periode Berjalan (Laba/Rugi)
    const labaRugiResult = await db.query(`
        SELECT 
            (SELECT COALESCE(SUM(j.kredit - j.debit), 0) FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id WHERE k.header_akun = 'PENDAPATAN' AND j.periode_id = $1) as total_pendapatan,
            (SELECT COALESCE(SUM(j.debit - j.kredit), 0) FROM jurnal_umum j JOIN kode_akun k ON j.akun_id = k.id WHERE k.header_akun = 'BEBAN' AND j.periode_id = $1) as total_beban
    `, [periodeId]);
    const { total_pendapatan, total_beban } = labaRugiResult.rows[0];
    const shuSaatIni = parseFloat(total_pendapatan) - parseFloat(total_beban);

    res.status(200).json({
      totalAnggota,
      totalSimpanan,
      totalPinjaman,
      shuSaatIni
    });

  } catch (error) {
    console.error("Error saat mengambil data dasbor:", error);
    res.status(500).json({ message: "Gagal mengambil data dasbor." });
  }
};