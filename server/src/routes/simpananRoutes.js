import express from 'express';
import {
  createRekening,
  createSetoran,
  getRekeningByAnggotaId,
  getMutasiByRekeningId,
  createPenarikan,
  getRekeningById,
  getSimpananSummary,
  getAllTransaksi,
  exportSimpananToExcel
} from '../controllers/simpananController.js';

const router = express.Router();

// GET /api/simpanan/rekening -> Mengambil ringkasan & detail
router.get('/rekening', getSimpananSummary);

// GET /api/simpanan/transaksi -> Mengambil SEMUA transaksi
router.get('/transaksi', getAllTransaksi);

// GET /api/simpanan/export/excel -> Ekspor data ke Excel
router.get('/export/excel', exportSimpananToExcel);

// --- ROUTE GET LAINNYA ---
router.get('/rekening/anggota/:anggotaId', getRekeningByAnggotaId);
router.get('/rekening/:id', getRekeningById);
router.get('/rekening/:rekeningId/mutasi', getMutasiByRekeningId);

// --- ROUTE POST ---
router.post('/rekening', createRekening);
router.post('/rekening/:rekeningId/setor', createSetoran);
router.post('/rekening/:rekeningId/tarik', createPenarikan);

export default router;
