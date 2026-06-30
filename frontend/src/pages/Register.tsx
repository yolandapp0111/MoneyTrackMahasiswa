import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { 
        nama_lengkap: namaLengkap, 
        nim, 
        email, 
        password 
      });
      localStorage.setItem('token', response.data.token);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK') {
        setError('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.');
      } else {
        setError(err.response?.data?.message || 'Registrasi gagal');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card flex-col items-center" style={{ maxWidth: '500px' }}>
        <h1 className="text-admin font-bold text-2xl mb-2 text-center" style={{ color: '#8B5CF6' }}>Money Track Mahasiswa</h1>
        <p className="text-muted text-sm mb-6 text-center">Buat akun baru untuk mengelola keuanganmu</p>
        
        {error && <div className="text-danger mb-4 text-sm font-medium bg-red-50 p-2 rounded w-full text-center">{error}</div>}
        
        <form onSubmit={handleRegister} className="w-full">
          <div className="form-group mb-3">
            <label className="form-label">Nama Lengkap</label>
            <input type="text" className="form-input" placeholder="Masukkan nama lengkap" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">NIM (Nomor Induk Mahasiswa)</label>
            <input type="text" className="form-input" placeholder="Masukkan NIM" value={nim} onChange={(e) => setNim(e.target.value)} required />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="Masukkan email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Kata Sandi</label>
            <input type="password" className="form-input" placeholder="Min. 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="form-group mb-4">
            <label className="form-label">Konfirmasi Kata Sandi</label>
            <input type="password" className="form-input" placeholder="Ulangi kata sandi" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          
          <button type="submit" className="btn btn-primary w-full" style={{ backgroundColor: '#2E7D32' }}>
            Daftar Sekarang
          </button>
        </form>
        
        <p className="text-sm mt-5 text-center">
          Sudah punya akun? <Link to="/login" className="text-primary font-medium" style={{ color: '#2E7D32', textDecoration: 'none' }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
