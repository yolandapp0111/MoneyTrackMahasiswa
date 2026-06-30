import pool from '../config/database';

export interface IUser {
  id?: number;
  nama_lengkap: string;
  nim: string;
  email: string;
  password?: string;
  role?: 'admin' | 'mahasiswa';
  created_at?: Date;
}

export class User {
  static async create(user: IUser): Promise<any> {
    const [result] = await pool.query(
      'INSERT INTO users (nama_lengkap, nim, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [user.nama_lengkap, user.nim, user.email, user.password, user.role || 'mahasiswa']
    );
    return result;
  }

  static async findByNim(nim: string): Promise<IUser | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE nim = ?', [nim]);
    const users = rows as IUser[];
    return users.length > 0 ? users[0] : null;
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as IUser[];
    return users.length > 0 ? users[0] : null;
  }

  static async findById(id: number): Promise<IUser | null> {
    const [rows] = await pool.query('SELECT id, nama_lengkap, nim, email, role, created_at FROM users WHERE id = ?', [id]);
    const users = rows as IUser[];
    return users.length > 0 ? users[0] : null;
  }

  static async findAllMahasiswa(): Promise<IUser[]> {
    const [rows] = await pool.query('SELECT id, nama_lengkap, nim, email, role, created_at FROM users WHERE role = "mahasiswa"');
    return rows as IUser[];
  }

  static async findByIdWithPassword(id: number): Promise<IUser | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const users = rows as IUser[];
    return users.length > 0 ? users[0] : null;
  }

  static async updateProfile(id: number, nama_lengkap: string, email: string): Promise<void> {
    await pool.query('UPDATE users SET nama_lengkap = ?, email = ? WHERE id = ?', [nama_lengkap, email, id]);
  }

  static async updatePassword(id: number, password: string): Promise<void> {
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
  }
}
