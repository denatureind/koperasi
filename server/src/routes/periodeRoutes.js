import express from 'express';
import { tutupBuku, getAllPeriode } from '../controllers/periodeController.js'; // <-- Tambahkan getAllPeriode


const router = express.Router();

// URL: POST /api/periode/tutup-buku
router.get('/', getAllPeriode); // <-- ROUTE BARU
router.post('/tutup-buku', tutupBuku);


export default router;