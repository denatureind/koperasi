import db from '../config/db.js';

/**
 * Mengambil semua data akun kas dan bank.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllKasBank = async (req, res) => {
  try {
    const query = 'SELECT * FROM kas_bank ORDER BY nama_akun ASC;';
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error mengambil data kas & bank:', error);
    res.status(500).json({ message: 'Gagal mengambil data kas & bank.' });
  }
};

/**
 * Membuat akun kas/bank baru.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createKasBank = async (req, res) => {
  const { nama_akun, nomor_rekening, nama_bank, saldo_awal, kode_akun_id } = req.body;
  
  try {
    const query = `
      INSERT INTO kas_bank (nama_akun, nomor_rekening, nama_bank, saldo_awal, saldo_sekarang, kode_akun_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [nama_akun, nomor_rekening, nama_bank, saldo_awal, saldo_awal, kode_akun_id];
    
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error membuat akun kas/bank baru:', error);
    res.status(500).json({ message: 'Gagal membuat akun kas/bank baru.' });
  }
};
