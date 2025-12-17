import express from 'express';
// --- PERUBAHAN 1: Tambahkan simpanJasaBelanja di dalam kurung kurawal ---
import { 
  getJurnalUmum, 
  getNeraca, 
  getLabaRugi, 
  hitungSHU, 
  getPeriodeList,
  getBukuBesarSummary,
  getBukuBesarDetail,
  exportNeraca,
  exportLabaRugi,
  exportSHU,
  simpanJasaBelanja,
  getHasilSHU // <-- Tambahkan import ini
} from '../controllers/laporanController.js';

const router = express.Router();

router.get('/periode', getPeriodeList); 
router.get('/jurnal-umum', getJurnalUmum);
router.get('/neraca', getNeraca);
router.get('/laba-rugi', getLabaRugi);
router.get('/hitung-shu', hitungSHU);

router.get('/buku-besar', getBukuBesarSummary);
router.get('/buku-besar/detail', getBukuBesarDetail);

router.get('/neraca/export', exportNeraca);
router.get('/laba-rugi/export', exportLabaRugi);
router.get('/shu/export', exportSHU);
router.get('/shu/hasil-tersimpan', getHasilSHU); // <-- Tambahkan route ini

// --- PERUBAHAN 2: Tambahkan Baris Ini di Paling Bawah (Sebelum export default) ---
router.post('/shu/simpan-jasa', simpanJasaBelanja); 
// -------------------------------------------------------------------------------

export default router;