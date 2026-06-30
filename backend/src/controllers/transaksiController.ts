import { Request, Response } from 'express';
import { Transaksi } from '../models/Transaksi';

export const addTransaksi = async (req: Request | any, res: Response) => {
  const { jenis, jumlah, kategori, catatan, tanggal } = req.body;

  try {
    await Transaksi.create({
      user_id: req.user.id,
      jenis,
      jumlah,
      kategori,
      catatan,
      tanggal
    });

    res.status(201).json({ message: 'Transaksi berhasil ditambahkan' });
  } catch (error) {
    console.error('AddTransaksi error:', error);
    res.status(500).json({ message: 'Gagal menambahkan transaksi' });
  }
};

export const getMyTransaksi = async (req: Request | any, res: Response) => {
  try {
    const transaksi = await Transaksi.findByUserId(req.user.id);
    res.json(transaksi);
  } catch (error) {
    console.error('GetMyTransaksi error:', error);
    res.status(500).json({ message: 'Gagal mengambil data transaksi' });
  }
};

export const getAllTransaksi = async (req: Request, res: Response) => {
  try {
    const transaksi = await Transaksi.findAll();
    res.json(transaksi);
  } catch (error) {
    console.error('GetAllTransaksi error:', error);
    res.status(500).json({ message: 'Gagal mengambil data transaksi' });
  }
};

export const updateTransaksi = async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    await Transaksi.update(Number(id), req.user.id, req.body);
    res.json({ message: 'Transaksi berhasil diupdate' });
  } catch (error) {
    console.error('UpdateTransaksi error:', error);
    res.status(500).json({ message: 'Gagal update transaksi' });
  }
};

export const deleteTransaksi = async (req: Request | any, res: Response) => {
  try {
    const { id } = req.params;
    await Transaksi.delete(Number(id), req.user.id);
    res.json({ message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    console.error('DeleteTransaksi error:', error);
    res.status(500).json({ message: 'Gagal menghapus transaksi' });
  }
};
