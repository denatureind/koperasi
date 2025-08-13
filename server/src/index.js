// Import dotenv dan jalankan konfigurasinya PALING PERTAMA
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // <-- Import 'fs' untuk file system

// --- BLOK DEBUGGING ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

console.log('Mencari file .env di path:', envPath);
console.log('Apakah file .env ada?:', fs.existsSync(envPath));
// -----------------------

// Konfigurasi dotenv dengan path yang lebih eksplisit
dotenv.config({ path: envPath });

// --- TES BACA VARIABEL ---
console.log('PORT dari .env setelah config:', process.env.PORT);
console.log('JWT_SECRET dari .env setelah config:', process.env.JWT_SECRET);
// -------------------------

// Baru import library dan file lainnya
import express from 'express';
import cors from 'cors';
import anggotaRoutes from './routes/anggotaRoutes.js';
import simpananRoutes from './routes/simpananRoutes.js';
import pinjamanRoutes from './routes/pinjamanRoutes.js';
import akunRoutes from './routes/akunRoutes.js';
import laporanRoutes from './routes/laporanRoutes.js';
import authRoutes from './routes/authRoutes.js';
import konfigurasiRoutes from './routes/konfigurasiRoutes.js'; // <-- IMPORT BARU
import jenisSimpananRoutes from './routes/jenisSimpananRoutes.js';
import importRoutes from './routes/importRoutes.js';
import jenisPinjamanRoutes from './routes/jenisPinjamanRoutes.js';
import periodeRoutes from './routes/periodeRoutes.js';
import jurnalRoutes from './routes/jurnalRoutes.js'; // <-- IMPORT BARU




// Inisialisasi aplikasi express
const app = express();

// Menggunakan middleware
app.use(cors());
app.use(express.json());

// Route percobaan
app.get('/', (req, res) => {
  res.send('API Koperasi Lite Berjalan!');
});

// Menggunakan Routes
app.use('/api/anggota', anggotaRoutes);
app.use('/api/simpanan', simpananRoutes);
app.use('/api/pinjaman', pinjamanRoutes);
app.use('/api/akun', akunRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/konfigurasi', konfigurasiRoutes); // <-- GUNAKAN ROUTE BARU
app.use('/api/jenis-simpanan', jenisSimpananRoutes);
app.use('/api/import', importRoutes);
app.use('/api/jenis-pinjaman', jenisPinjamanRoutes);
app.use('/api/periode', periodeRoutes);
app.use('/api/jurnal', jurnalRoutes); // <-- GUNAKAN ROUTE BARU


// Mendefinisikan PORT dari file .env
const PORT = process.env.PORT || 5000;

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
