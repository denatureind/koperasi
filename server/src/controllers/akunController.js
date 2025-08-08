import db from '../config/db.js';

// Fungsi untuk mengambil semua data kode akun
export const getAllAkun = async (req, res) => {
  try {
    // Urutkan berdasarkan 'kode' agar tampilannya hierarkis
    const query = 'SELECT * FROM kode_akun ORDER BY kode ASC;';
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error saat mengambil kode akun:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};