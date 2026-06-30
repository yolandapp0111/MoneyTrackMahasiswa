const mysql = require('mysql2/promise');
const fs = require('fs');

async function setup() {
  try {
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_USER = process.env.DB_USER || 'root';
    const DB_PASSWORD = process.env.DB_PASSWORD || '';
    const DB_NAME = process.env.DB_NAME || 'money_track_db';

    console.log(`Connecting to MySQL (${DB_USER}@${DB_HOST})...`);
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD
    });

    console.log(`Creating database ${DB_NAME}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.query(`USE \`${DB_NAME}\``);

    console.log('Creating tables...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nama_lengkap VARCHAR(255) NOT NULL,
          nim VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'mahasiswa') DEFAULT 'mahasiswa',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS transaksi (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          jenis ENUM('pemasukan', 'pengeluaran') NOT NULL,
          jumlah DECIMAL(15, 2) NOT NULL,
          kategori VARCHAR(100) NOT NULL,
          catatan TEXT,
          tanggal DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Inserting default admin...');
    await connection.query(`
      INSERT INTO users (nama_lengkap, nim, email, password, role) 
      VALUES ('Admin Utama', 'ADMIN001', 'admin@moneytrack.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYua', 'admin')
      ON DUPLICATE KEY UPDATE id=id
    `);

    console.log('Setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during setup:', error);
    process.exit(1);
  }
}

setup();
