import express from 'express';

// Import semua fungsi dari Controller (termasuk yang baru: postingDistribusiSHU)
import { 
    getAllPeriode, 
    tutupBuku,     
    getPeriodeById,
    createPeriode,
    postingDistribusiSHU // <--- WAJIB DITAMBAHKAN
} from '../controllers/periodeController.js';

const router = express.Router();

// 1. Ambil semua periode
router.get('/', getAllPeriode); 

// 2. Ambil detail periode per ID
router.get('/:id', getPeriodeById); 

// 3. Buat periode baru (Manual)
router.post('/', createPeriode); 

// 4. Tutup Buku Tahunan
router.post('/:id/tutup-buku', tutupBuku);

// 5. POSTING DISTRIBUSI SHU (Fitur Baru)
// Ini jalur khusus untuk membagikan SHU ke jurnal & rekening anggota
router.post('/distribusi-shu', postingDistribusiSHU);

export default router;