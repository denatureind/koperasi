import express from 'express';
// Pastikan deleteJurnal diimport
import { createJurnalManual, deleteJurnal } from '../controllers/jurnalController.js'; 

const router = express.Router();

router.post('/manual', createJurnalManual);

// --- TAMBAHAN ROUTE DELETE ---
router.delete('/:id', deleteJurnal);
// -----------------------------

export default router;