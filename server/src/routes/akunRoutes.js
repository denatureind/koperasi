import express from 'express';
import { getAllAkun, getAkunKewajiban } from '../controllers/akunController.js'; // <-- Pastikan keduanya diimpor

const router = express.Router();

router.get('/', getAllAkun);
router.get('/kewajiban', getAkunKewajiban); // <-- Baris ini sekarang akan berfungsi

export default router;