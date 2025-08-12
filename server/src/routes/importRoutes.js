import express from 'express';
import multer from 'multer';
import { importAnggota, importSaldoSimpanan, importPinjamanAktif } from '../controllers/importController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/anggota', upload.single('file'), importAnggota);
router.post('/saldo-simpanan', upload.single('file'), importSaldoSimpanan);
router.post('/pinjaman-aktif', upload.single('file'), importPinjamanAktif);


export default router;