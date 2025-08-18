import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const authMiddleware = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await db.query('SELECT id, nama, role FROM users WHERE id = $1', [decoded.id]);
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'User tidak ditemukan.' });
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token tidak valid atau kadaluarsa.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak ada token, akses ditolak.' });
  }
};

export const protectMember = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== 'anggota') {
        return res.status(403).json({ message: 'Akses ditolak.' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token tidak valid.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak ada token, akses ditolak.' });
  }
};