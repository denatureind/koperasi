import express from 'express';
import { 
  createAnggota, 
  getAllAnggota, 
  getAnggotaById,
  updateAnggota,     // <-- Import fungsi baru
  deleteAnggota      // <-- Import fungsi baru
} from '../controllers/anggotaController.js';

const router = express.Router();

// Route yang sudah ada
router.get('/', getAllAnggota);
router.get('/:id', getAnggotaById);
router.post('/', createAnggota);

// ROUTE BARU
// PUT /api/anggota/:id -> Menjalankan fungsi updateAnggota
router.put('/:id', updateAnggota);

// DELETE /api/anggota/:id -> Menjalankan fungsi deleteAnggota
router.delete('/:id', deleteAnggota);

export default router;