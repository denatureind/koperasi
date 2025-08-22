import express from 'express';
import { getAllKasBank, createKasBank } from '../controllers/kasBankController.js';

const router = express.Router();

router.get('/', getAllKasBank);
router.post('/', createKasBank);

export default router;
