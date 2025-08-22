import express from 'express';
import { loginAnggota, createAnggotaAuth, resetAnggotaPassword  } from '../controllers/anggotaAuthController.js'; // <-- Tambahkan createAnggotaAuth

import { 
  createAnggota, 
  getAllAnggota, 
  getAnggotaById,
  updateAnggota,     // <-- Import fungsi baru
  deleteAnggota,      // <-- Import fungsi baru
  exportAnggotaToExcel
  
} from '../controllers/anggotaController.js';

const router = express.Router();

// Route yang sudah ada
router.get('/', getAllAnggota);
router.get('/:id', getAnggotaById);
router.get('/export/excel', exportAnggotaToExcel);
router.post('/', createAnggota);
router.post('/create', createAnggotaAuth); // <-- ROUTE BARU
router.put('/reset-password', resetAnggotaPassword);



// ROUTE BARU
// PUT /api/anggota/:id -> Menjalankan fungsi updateAnggota
router.put('/:id', updateAnggota);

// DELETE /api/anggota/:id -> Menjalankan fungsi deleteAnggota
router.delete('/:id', deleteAnggota);

export default router;