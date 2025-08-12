import express from 'express';
import { getAllJenisSimpanan, createJenisSimpanan } from '../controllers/jenisSimpananController.js';
const router = express.Router();
router.get('/', getAllJenisSimpanan);
router.post('/', createJenisSimpanan);
export default router;