import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Fungsi untuk membuat akun otentikasi baru untuk anggota
export const createAnggotaAuth = async (req, res) => {
  // --- BARIS UNTUK MELACAK ---
  console.log("Fungsi createAnggotaAuth dipanggil dengan body:", req.body);
  // -------------------------

  const { anggota_id, username, password } = req.body;

  if (!anggota_id || !username || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  try {
    // Cek apakah username sudah ada
    const userExists = await db.query('SELECT * FROM anggota_auth WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Username sudah digunakan.' });
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan ke database
    const query = `
      INSERT INTO anggota_auth (anggota_id, username, password)
      VALUES ($1, $2, $3)
      RETURNING id, username;
    `;
    const result = await db.query(query, [anggota_id, username, hashedPassword]);

    res.status(201).json({ message: 'Akun login untuk anggota berhasil dibuat.', data: result.rows[0] });

  } catch (error) {
    console.error('Error saat membuat akun login anggota:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// Fungsi untuk login anggota
export const loginAnggota = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM anggota_auth WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const anggotaAuth = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, anggotaAuth.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }
    
    const anggotaDetail = await db.query('SELECT id, nama, kode_anggota FROM anggota WHERE id = $1', [anggotaAuth.anggota_id]);

    const token = jwt.sign(
      { 
        id: anggotaAuth.id, 
        anggotaId: anggotaDetail.rows[0].id,
        role: 'anggota'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login anggota berhasil!',
      token,
      user: anggotaDetail.rows[0]
    });
  } catch (error) {
    console.error('Error saat login anggota:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// --- FUNGSI BARU ---
// Admin melakukan reset password untuk seorang anggota
export const resetAnggotaPassword = async (req, res) => {
  const { anggota_id, password } = req.body;

  if (!anggota_id || !password) {
    return res.status(400).json({ message: 'ID Anggota dan password baru wajib diisi.' });
  }

  try {
    // Enkripsi password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password di database
    const query = `
      UPDATE anggota_auth 
      SET password = $1 
      WHERE anggota_id = $2
      RETURNING id, username;
    `;
    const result = await db.query(query, [hashedPassword, anggota_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Akun login untuk anggota ini tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Password anggota berhasil direset.', data: result.rows[0] });

  } catch (error) {
    console.error('Error saat reset password anggota:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};
