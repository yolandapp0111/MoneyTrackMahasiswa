CREATE DATABASE IF NOT EXISTS money_track_db;
USE money_track_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    nim VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'mahasiswa') DEFAULT 'mahasiswa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

-- Insert Default Admin (Password: admin123)
-- Hash using bcrypt: $2a$10$XU1n7i7W9.Y8a.Z7x1f.O.PzZq1r.s/zO2vjG3R.lA9T8h3y1oF
INSERT INTO users (nama_lengkap, nim, email, password, role) 
VALUES ('Admin Utama', 'ADMIN001', 'admin@moneytrack.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYua', 'admin')
ON DUPLICATE KEY UPDATE id=id;
