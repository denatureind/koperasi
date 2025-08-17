import jwt from 'jsonwebtoken';

export const protectMember = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Pastikan role-nya adalah 'anggota'
      if (decoded.role !== 'anggota') {
        return res.status(403).json({ message: 'Akses ditolak.' });
      }

      req.user = decoded; // Simpan data dari token ke request
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token tidak valid.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak ada token, akses ditolak.' });
  }
};