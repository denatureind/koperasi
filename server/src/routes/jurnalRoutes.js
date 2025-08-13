import express from 'express';
import { createJurnalManual } from '../controllers/jurnalController.js';

const router = express.Router();

// URL: POST /api/jurnal/manual
router.post('/manual', createJurnalManual);

export default router;