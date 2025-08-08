import express from 'express';
import { register, login } from '../controllers/authController.js'; // <-- Tambahkan 'login'

const router = express.Router();

// URL untuk registrasi: POST /api/auth/register
router.post('/register', register);
router.post('/login', login);


export default router;