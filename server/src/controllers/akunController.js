import db from '../config/db.js';

// Fungsi yang sudah ada
export const getAllAkun = async (req, res) => {
  try {
    const query = 'SELECT * FROM kode_akun ORDER BY kode ASC;';
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error saat mengambil kode akun:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// --- FUNGSI BARU YANG HILANG ---
// Mengambil daftar akun kewajiban untuk dropdown
export const getAkunKewajiban = async (req, res) => {
  try {
    const result = await db.query("SELECT id, kode, nama_akun FROM kode_akun WHERE header_akun = 'KEWAJIBAN' AND kelompok_akun = 'Simpanan Anggota' ORDER BY kode ASC;");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
};

export const getAkunUntukKasBank = async (req, res) => {
  try {
    // Kueri diperbaiki untuk menggunakan 'kelompok_akun'
    const query = "SELECT id, nama_akun FROM kode_akun WHERE kelompok_akun = 'Kas dan Bank' ORDER BY kode";
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error mengambil akun untuk kas & bank:', error);
    res.status(500).json({ message: 'Gagal mengambil data akun' });
  }
};