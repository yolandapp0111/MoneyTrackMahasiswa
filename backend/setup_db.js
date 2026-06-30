const mysql = require('mysql2/promise');
const fs = require('fs');

async function setup() {
  try {
    console.log('Connecting to MySQL (root, no password)...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // default XAMPP
    });

    console.log('Creating database money_track_db...');
    await connection.query('CREATE DATABASE IF NOT EXISTS money_track_db');
    await connection.query('USE money_track_db');

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
