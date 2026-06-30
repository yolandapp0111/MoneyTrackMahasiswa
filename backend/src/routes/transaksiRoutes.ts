import { Router } from 'express';
import { addTransaksi, getMyTransaksi, getAllTransaksi, updateTransaksi, deleteTransaksi } from '../controllers/transaksiController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly, mahasiswaOnly } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', protect, mahasiswaOnly, addTransaksi);
router.get('/me', protect, mahasiswaOnly, getMyTransaksi);
router.get('/all', protect, adminOnly, getAllTransaksi);
router.put('/:id', protect, mahasiswaOnly, updateTransaksi);
router.delete('/:id', protect, mahasiswaOnly, deleteTransaksi);

export default router;
