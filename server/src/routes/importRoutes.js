import express from 'express';
import multer from 'multer';
import { importAnggota, importSaldoSimpanan, importPinjamanAktif, analyzeSaldoSimpanan } from '../controllers/importController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/anggota', upload.single('file'), importAnggota);
router.post('/saldo-simpanan', upload.single('file'), importSaldoSimpanan);
router.post('/saldo-simpanan/analyze', upload.single('file'), analyzeSaldoSimpanan);
router.post('/pinjaman-aktif', upload.single('file'), importPinjamanAktif);

export default router;
