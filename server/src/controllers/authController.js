import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // <-- IMPORT BARU

// FUNGSI BARU: Login Pengurus
export const login = async (req, res) => {

      console.log('Membaca JWT_SECRET:', process.env.JWT_SECRET);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  try {
    // 1. Cari pengguna berdasarkan username
    const result = await db.query('SELECT * FROM pengurus WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    const user = result.rows[0];

    // 2. Bandingkan password yang diberikan dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah.' });
    }

    // 3. Jika password valid, buat JSON Web Token (JWT)
    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d' // Token akan berlaku selama 1 hari
    });

    // Hapus password dari objek user sebelum dikirim kembali
    delete user.password;

    res.status(200).json({
      message: 'Login berhasil',
      token: token,
      user: user
    });

  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const register = async (req, res) => {
  const { nama_lengkap, username, password } = req.body;

  // Validasi input dasar
  if (!nama_lengkap || !username || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  try {
    // Cek apakah username sudah ada
    const userExists = await db.query('SELECT * FROM pengurus WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan.' });
    }

    // Enkripsi password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru ke database
    const query = `
      INSERT INTO pengurus (nama_lengkap, username, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, nama_lengkap, role;
    `;
    const newUser = await db.query(query, [nama_lengkap, username, hashedPassword]);

    res.status(201).json({
      message: 'Pengurus baru berhasil didaftarkan.',
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

