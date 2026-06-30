import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Akses ditolak. Hanya untuk Admin.' });
  }
};

export const mahasiswaOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'mahasiswa') {
    next();
  } else {
    res.status(403).json({ message: 'Akses ditolak. Hanya untuk Mahasiswa.' });
  }
};
