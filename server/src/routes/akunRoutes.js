import express from 'express';
import { 
  getAllAkun, 
  getAkunKewajiban, 
  getAkunUntukKasBank 
} from '../controllers/akunController.js';

const router = express.Router();

router.get('/', getAllAkun);
router.get('/kewajiban', getAkunKewajiban);
router.get('/untuk-kas-bank', getAkunUntukKasBank); // <-- Diperbaiki

export default router;