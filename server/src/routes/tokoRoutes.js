import express from 'express';
import { simpanBelanjaBulanan, getBelanjaBulanan } from '../controllers/tokoController.js';

const router = express.Router();

// URL: GET /api/toko/belanja?bulan=8&tahun=2025
router.get('/belanja', getBelanjaBulanan);
// URL: POST /api/toko/belanja
router.post('/belanja', simpanBelanjaBulanan);

export default router;