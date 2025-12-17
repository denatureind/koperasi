import express from 'express';
// Pastikan getPeriodeById di-import!
import { 
    getAllPeriode, // (sesuaikan nama fungsi lama Anda)
    tutupBuku,     // (sesuaikan nama fungsi lama Anda)
    getPeriodeById // <--- TAMBAHKAN INI
} from '../controllers/periodeController.js';

const router = express.Router();

router.get('/', getAllPeriode); 
router.post('/tutup-buku', tutupBuku);

// --- TAMBAHKAN ROUTE INI ---
router.get('/:id', getPeriodeById); 
// ---------------------------

export default router;