import express from 'express';
import { getAllJenisPinjaman, createJenisPinjaman } from '../controllers/jenisPinjamanController.js';

const router = express.Router();

router.get('/', getAllJenisPinjaman);
router.post('/', createJenisPinjaman);

export default router;