@echo off
echo =======================================================
echo          Menjalankan Money Track Mahasiswa
echo =======================================================
echo.
echo PENTING: Pastikan MySQL di XAMPP sudah di-Start (berwarna hijau)!
echo.
echo Membuka server backend...
start cmd /k "cd backend && npm run dev"

echo Membuka server frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo Menunggu beberapa detik agar server siap...
timeout /t 5 /nobreak >nul

echo.
echo Membuka aplikasi di browser...
start http://localhost:5173

echo.
echo Selesai! Aplikasi sudah berjalan.
echo (Biarkan dua jendela terminal hitam tetap terbuka selama menggunakan aplikasi)
echo =======================================================
pause
