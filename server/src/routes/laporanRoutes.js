import express from 'express';
// Pastikan hitungSHU ada di daftar import
import { getJurnalUmum, getNeraca, getLabaRugi, hitungSHU } from '../controllers/laporanController.js';

const router = express.Router();

router.get('/jurnal-umum', getJurnalUmum);
router.get('/neraca', getNeraca);
router.get('/laba-rugi', getLabaRugi);
router.get('/hitung-shu', hitungSHU); // Route ini sekarang akan dikenali

export default router;