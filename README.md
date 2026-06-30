# Money Track Mahasiswa

Aplikasi pencatatan keuangan untuk mahasiswa. Dibangun dengan **React + TypeScript** (frontend) dan **Express + TypeScript** (backend) dengan database **MySQL**.

## Fitur

- Registrasi dan login akun mahasiswa
- Dashboard admin dan mahasiswa
- Pencatatan pemasukan dan pengeluaran
- Riwayat transaksi
- Laporan keuangan
- Manajemen kategori transaksi
- Reset password

## Persyaratan

- Node.js 18+
- MySQL (XAMPP atau standalone)
- npm

## Cara Instalasi & Menjalankan

### 1. Clone repositori

```bash
git clone https://github.com/yolandapp0111/MoneyTrackMahasiswa.git
cd MoneyTrackMahasiswa
```

### 2. Setup database

Jalankan script setup database:

```bash
cd backend
node setup_db.js
```

Atau import `database.sql` ke phpMyAdmin / MySQL CLI.

### 3. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Konfigurasi environment

Salin `.env.example` menjadi `.env` di folder `backend/`:

```bash
cd backend
cp .env.example .env
```

Sesuaikan konfigurasi database dan JWT secret sesuai kebutuhan.

### 5. Jalankan aplikasi

Jalankan backend dan frontend secara bersamaan:

**Cara 1 — Batch script (Windows):**
```bash
START_APLIKASI.bat
```

**Cara 2 — Manual (dua terminal):**

Terminal 1 (backend):
```bash
cd backend
npm run dev
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```

Akses aplikasi di: http://localhost:5173

### Akun Default

| Role | NIM | Password |
|------|-----|----------|
| Admin | ADMIN001 | admin123 |

## Teknologi

- **Frontend:** React 19, TypeScript, Vite, Axios, React Router, Recharts, Lucide
- **Backend:** Node.js, Express, TypeScript, MySQL2, JWT, bcryptjs
- **Database:** MySQL
