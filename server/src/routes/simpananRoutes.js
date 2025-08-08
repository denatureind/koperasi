import express from 'express';
import { 
  createRekening, 
  createSetoran,
  getRekeningByAnggotaId,
  getMutasiByRekeningId,
  createPenarikan,
  getRekeningById,
  getAllRekening,
  getAllTransaksi // <-- PASTIKAN FUNGSI INI DIIMPOR
} from '../controllers/simpananController.js';

const router = express.Router();

// GET /api/simpanan/rekening -> Mengambil SEMUA rekening
router.get('/rekening', getAllRekening);

// GET /api/simpanan/transaksi -> Mengambil SEMUA transaksi
router.get('/transaksi', getAllTransaksi); 

// --- ROUTE GET LAINNYA ---
router.get('/rekening/anggota/:anggotaId', getRekeningByAnggotaId);
router.get('/rekening/:id', getRekeningById);
router.get('/rekening/:rekeningId/mutasi', getMutasiByRekeningId);

// --- ROUTE POST ---
router.post('/rekening', createRekening);
router.post('/rekening/:rekeningId/setor', createSetoran);
router.post('/rekening/:rekeningId/tarik', createPenarikan);

export default router;