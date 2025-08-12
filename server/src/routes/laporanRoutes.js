import express from 'express';
import { getJurnalUmum, getNeraca, getLabaRugi, hitungSHU, getPeriodeList } from '../controllers/laporanController.js';

const router = express.Router();

router.get('/periode', getPeriodeList); // <- Pastikan route ini ada
router.get('/jurnal-umum', getJurnalUmum);
router.get('/neraca', getNeraca);
router.get('/laba-rugi', getLabaRugi);
router.get('/hitung-shu', hitungSHU);

export default router;