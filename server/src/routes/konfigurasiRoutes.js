import express from 'express';
import { getKonfigurasiSHU, updateKonfigurasiSHU, getPoinSukarela, updatePoinSukarela } from '../controllers/konfigurasiController.js';

const router = express.Router();

router.get('/shu', getKonfigurasiSHU);
router.put('/shu', updateKonfigurasiSHU);
router.get('/poin-sukarela', getPoinSukarela);
router.put('/poin-sukarela', updatePoinSukarela);

export default router;
