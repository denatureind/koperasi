import express from 'express';
import { getKonfigurasiSHU, updateKonfigurasiSHU } from '../controllers/konfigurasiController.js';

const router = express.Router();

router.get('/shu', getKonfigurasiSHU);
router.put('/shu', updateKonfigurasiSHU);

export default router;