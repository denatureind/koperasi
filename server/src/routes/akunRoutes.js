import express from 'express';
import { getAllAkun } from '../controllers/akunController.js';

const router = express.Router();

router.get('/', getAllAkun);

export default router;