import express from 'express';
// Tambahkan dua fungsi baru di sini
import { 
  getJurnalUmum, 
  getNeraca, 
  getLabaRugi, 
  hitungSHU, 
  getPeriodeList,
  getBukuBesarSummary,
  getBukuBesarDetail,
  exportNeraca,  // Tambahkan import untuk exportNeraca
  exportLabaRugi
} from '../controllers/laporanController.js';

const router = express.Router();

router.get('/periode', getPeriodeList); 
router.get('/jurnal-umum', getJurnalUmum);
router.get('/neraca', getNeraca);
router.get('/laba-rugi', getLabaRugi);
router.get('/hitung-shu', hitungSHU);

// Dua route baru ini sekarang akan berfungsi
router.get('/buku-besar', getBukuBesarSummary);
router.get('/buku-besar/detail', getBukuBesarDetail);

// Route baru untuk ekspor laporan Neraca dalam format Excel
router.get('/neraca/export', exportNeraca); // <-- ROUTE BARU untuk ekspor Neraca
router.get('/laba-rugi/export', exportLabaRugi);


export default router;
