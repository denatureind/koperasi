import db from '../config/db.js';

// Mengambil semua jenis pinjaman
export const getAllJenisPinjaman = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM jenis_pinjaman ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) { res.status(500).json({ message: 'Gagal mengambil data' }); }
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
  } catch (error) { res.status(500).json({ message: 'Gagal membuat jenis pinjaman' }); }
};