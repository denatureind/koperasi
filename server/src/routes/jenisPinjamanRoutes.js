import express from 'express';
import {
  getAllJenisPinjaman,
  createJenisPinjaman,
  updateJenisPinjaman,
  deleteJenisPinjaman
} from '../controllers/jenisPinjamanController.js';

const router = express.Router();

router.get('/', getAllJenisPinjaman);
router.post('/', createJenisPinjaman);
router.put('/:id', updateJenisPinjaman);
router.delete('/:id', deleteJenisPinjaman);

export default router;
