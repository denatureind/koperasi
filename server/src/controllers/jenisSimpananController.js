import db from '../config/db.js';

// GET all
export const getAllJenisSimpanan = async (req, res) => {
  try {
    const result = await db.query('SELECT js.*, ka.kode, ka.nama_akun FROM jenis_simpanan js JOIN kode_akun ka ON js.akun_id = ka.id ORDER BY js.id ASC');
    res.status(200).json(result.rows);
  } catch (error) { res.status(500).json({ message: 'Gagal mengambil data' }); }
};

// CREATE
export const createJenisSimpanan = async (req, res) => {
  const { nama_jenis, akun_id, deskripsi } = req.body;
  try {
    const result = await db.query('INSERT INTO jenis_simpanan (nama_jenis, akun_id, deskripsi) VALUES ($1, $2, $3) RETURNING *', [nama_jenis, akun_id, deskripsi]);
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ message: 'Gagal membuat jenis simpanan' }); }
};