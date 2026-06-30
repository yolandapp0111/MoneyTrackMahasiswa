import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';

const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const register = async (req: Request, res: Response) => {
  const { nama_lengkap, nim, email, password } = req.body;

  try {
    const userExists = await User.findByNim(nim) || await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User dengan NIM atau Email ini sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await User.create({
      nama_lengkap,
      nim,
      email,
      password: hashedPassword,
      role: 'mahasiswa'
    });

    res.status(201).json({
      message: 'Registrasi berhasil',
      token: generateToken(result.insertId, 'mahasiswa')
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { nim, password } = req.body; // 'nim' variable here acts as an identifier (can be email or nim)

  try {
    let user = await User.findByNim(nim);
    
    // Jika tidak ditemukan dengan NIM, coba cari berdasarkan email
    if (!user) {
      user = await User.findByEmail(nim);
    }

    if (!user) {
      return res.status(401).json({ message: 'NIM/Email atau Password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return res.status(401).json({ message: 'NIM/Email atau Password salah' });
    }

    res.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        nim: user.nim,
        email: user.email,
        role: user.role
      },
      token: generateToken(user.id!, user.role!)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getMe = async (req: Request | any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { nim, email, newPassword } = req.body;

  try {
    const user = await User.findByNim(nim);
    
    if (!user || user.email !== email) {
      return res.status(404).json({ message: 'Data NIM dan Email tidak cocok atau tidak ditemukan' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updatePassword(user.id!, hashedPassword);

    res.json({ message: 'Password berhasil direset. Silakan login dengan password baru.' });
  } catch (error) {
    console.error('ResetPassword error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
