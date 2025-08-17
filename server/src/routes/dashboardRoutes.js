import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/summary', getDashboardSummary);

// Pastikan baris ini ada dan benar
export default router;