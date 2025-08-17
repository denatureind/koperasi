import express from 'express';
import { loginAnggota } from '../controllers/anggotaAuthController.js';
// DIUBAH: Impor fungsi pinjaman yang baru
import { 
  getMemberDashboard, 
  getMemberSimpananDetail, 
  getMemberSimpananTransactions,
  getMemberPinjamanList,
  getMemberPinjamanDetail
} from '../controllers/memberController.js'; 
import { protectMember } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rute publik
router.post('/login', loginAnggota);

// Rute Dasbor
router.get('/dashboard', protectMember, getMemberDashboard);

// Rute Simpanan
router.get('/simpanan', protectMember, getMemberSimpananDetail);
router.get('/simpanan/:id', protectMember, getMemberSimpananTransactions);

// --- RUTE BARU UNTUK PINJAMAN ---
router.get('/pinjaman', protectMember, getMemberPinjamanList);
router.get('/pinjaman/:id', protectMember, getMemberPinjamanDetail);

export default router;
