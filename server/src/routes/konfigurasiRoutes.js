import express from 'express';
import {
  getKonfigurasiSHU,
  updateKonfigurasiSHU,
  getPoinSukarela,
  updatePoinSukarela,
  getAllKonfigurasi,
  updateKonfigurasiByKode
} from '../controllers/konfigurasiController.js';

const router = express.Router();

// SHU Configuration
router.get('/shu', getKonfigurasiSHU);
router.put('/shu', updateKonfigurasiSHU);

// Poin Sukarela Configuration
router.get('/poin-sukarela', getPoinSukarela);
router.put('/poin-sukarela', updatePoinSukarela);

// All Configurations (for admin)
router.get('/all', getAllKonfigurasi);
router.put('/:kode', updateKonfigurasiByKode);

export default router;
