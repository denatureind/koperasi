// server/src/controllers/jenisPinjamanController.js
import db from '../config/db.js';

// Mengambil semua jenis pinjaman
export const getAllJenisPinjaman = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM jenis_pinjaman ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
};

// Menambah jenis pinjaman baru
export const createJenisPinjaman = async (req, res) => {
  const { nama_jenis, tingkat_jasa_persen, deskripsi } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO jenis_pinjaman (nama_jenis, tingkat_jasa_persen, deskripsi) VALUES ($1, $2, $3) RETURNING *',
      [nama_jenis, tingkat_jasa_persen, deskripsi]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat jenis pinjaman' });
  }
};

// Update jenis pinjaman
export const updateJenisPinjaman = async (req, res) => {
  const { id } = req.params;
  const { nama_jenis, tingkat_jasa_persen, deskripsi } = req.body;
  try {
    const result = await db.query(
      'UPDATE jenis_pinjaman SET nama_jenis = $1, tingkat_jasa_persen = $2, deskripsi = $3 WHERE id = $4 RETURNING *',
      [nama_jenis, tingkat_jasa_persen, deskripsi, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate jenis pinjaman' });
  }
};

// Delete jenis pinjaman
export const deleteJenisPinjaman = async (req, res) => {
  const { id } = req.params;
  try {
    // Cek apakah jenis pinjaman sedang digunakan
    const checkUsage = await db.query(
      'SELECT COUNT(*) FROM rekening_pinjaman WHERE jenis_pinjaman_id = $1',
      [id]
    );

    if (parseInt(checkUsage.rows[0].count, 10) > 0) {
      return res.status(400).json({ message: 'Gagal hapus: Jenis pinjaman sedang digunakan.' });
    }

    // Hapus jika tidak digunakan
    const result = await db.query('DELETE FROM jenis_pinjaman WHERE id = $1 RETURNING *', [id]);
    return res.status(200).json({ message: 'Jenis pinjaman berhasil dihapus', data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus jenis pinjaman' });
  }
};

// Default export agar rute bisa mengimpor sebagai objek
export default {
  getAllJenisPinjaman,
  createJenisPinjaman,
  updateJenisPinjaman,
  deleteJenisPinjaman,
};
