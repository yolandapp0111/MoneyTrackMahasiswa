import pool from '../config/database';

export interface ITransaksi {
  id?: number;
  user_id: number;
  jenis: 'pemasukan' | 'pengeluaran';
  jumlah: number;
  kategori: string;
  catatan?: string;
  tanggal: string | Date;
  created_at?: Date;
}

export class Transaksi {
  static async create(transaksi: ITransaksi): Promise<any> {
    const [result] = await pool.query(
      'INSERT INTO transaksi (user_id, jenis, jumlah, kategori, catatan, tanggal) VALUES (?, ?, ?, ?, ?, ?)',
      [transaksi.user_id, transaksi.jenis, transaksi.jumlah, transaksi.kategori, transaksi.catatan || '', transaksi.tanggal]
    );
    return result;
  }

  static async findByUserId(user_id: number): Promise<ITransaksi[]> {
    const [rows] = await pool.query('SELECT * FROM transaksi WHERE user_id = ? ORDER BY tanggal DESC', [user_id]);
    return rows as ITransaksi[];
  }

  static async findAll(): Promise<any[]> {
    const [rows] = await pool.query(`
      SELECT t.*, u.nama_lengkap as user_nama 
      FROM transaksi t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.tanggal DESC
    `);
    return rows as any[];
  }

  static async update(id: number, user_id: number, transaksi: any): Promise<void> {
    await pool.query(
      'UPDATE transaksi SET jenis = ?, jumlah = ?, kategori = ?, catatan = ?, tanggal = ? WHERE id = ? AND user_id = ?',
      [transaksi.jenis, transaksi.jumlah, transaksi.kategori, transaksi.catatan || '', transaksi.tanggal, id, user_id]
    );
  }

  static async delete(id: number, user_id: number): Promise<void> {
    await pool.query('DELETE FROM transaksi WHERE id = ? AND user_id = ?', [id, user_id]);
  }
}
