import { Router, Request, Response } from 'express';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

const router = Router();

router.put('/profile', protect, async (req: Request | any, res: Response) => {
  try {
    const { nama_lengkap, email } = req.body;
    
    // Validasi email jika berubah
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail.id !== req.user.id) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }

    await User.updateProfile(req.user.id, nama_lengkap, email);
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.put('/password', protect, async (req: Request | any, res: Response) => {
  try {
    const { oldPass, newPass } = req.body;
    const user = await User.findByIdWithPassword(req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(oldPass, user.password!);
    if (!isMatch) return res.status(400).json({ message: 'Password lama salah' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    await User.updatePassword(req.user.id, hashedPassword);
    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.get('/', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const users = await User.findAllMahasiswa();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.post('/', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const { nama_lengkap, nim, email, password } = req.body;
    const existingUser = await User.findByNim(nim);
    if (existingUser) return res.status(400).json({ message: 'NIM sudah terdaftar' });
    
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await User.create({
      nama_lengkap, nim, email, password: hashedPassword, role: 'mahasiswa'
    });
    
    res.status(201).json({ id: userId, message: 'Mahasiswa berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

router.delete('/:id', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const pool = require('../config/database').default;
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

export default router;
