import express from 'express';
import { 
  createPinjaman,
  getPinjamanByAnggotaId,
  getDetailPinjamanById,
  createPembayaranAngsuran,
  getAllPinjaman,
  getAllTransaksi // <-- PASTIKAN FUNGSI INI DIIMPOR
} from '../controllers/pinjamanController.js';

const router = express.Router();

// GET /api/pinjaman -> Mengambil SEMUA pinjaman
router.get('/', getAllPinjaman);

// GET /api/pinjaman/transaksi -> Mengambil SEMUA transaksi pembayaran
router.get('/transaksi', getAllTransaksi);

// --- ROUTE GET LAINNYA ---
router.get('/anggota/:anggotaId', getPinjamanByAnggotaId);
router.get('/:id', getDetailPinjamanById);

// --- ROUTE POST ---
router.post('/', createPinjaman);
router.post('/bayar/:jadwalId', createPembayaranAngsuran);

export default router;