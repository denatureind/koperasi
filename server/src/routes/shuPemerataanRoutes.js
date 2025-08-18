import express from 'express';
// Impor fungsi controller yang benar
import { getPemerataanByPeriode, savePemerataan } from '../controllers/shuPemerataanController.js';

const router = express.Router();

// Rute untuk mendapatkan data pemerataan berdasarkan periode
// Contoh: GET /api/shu-pemerataan?periode_id=1
router.get('/', getPemerataanByPeriode);

// Rute untuk menyimpan data pemerataan
// Contoh: POST /api/shu-pemerataan
router.post('/', savePemerataan);

export default router;
