import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'admin' | 'mahasiswa'>('mahasiswa');
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showForgotPass, setShowForgotPass] = useState(false);
  const [forgotNim, setForgotNim] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        nim: forgotNim,
        email: forgotEmail,
        newPassword: forgotNewPass
      });
      setForgotError(false);
      setForgotMsg(response.data.message);
      setTimeout(() => {
        setShowForgotPass(false);
        setForgotMsg('');
        setForgotNim('');
        setForgotEmail('');
        setForgotNewPass('');
      }, 3000);
    } catch (err: any) {
      setForgotError(true);
      if (err.code === 'ERR_NETWORK') {
        setForgotMsg('Tidak dapat terhubung ke server.');
      } else {
        setForgotMsg(err.response?.data?.message || 'Gagal reset password');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { nim, password });
      const user = response.data.user;
      
      // Validasi role dengan tab yang dipilih
      if (activeTab === 'admin' && user.role !== 'admin') {
        setError('Akses ditolak: Akun ini bukan Admin.');
        setLoading(false);
        return;
      }
      
      if (activeTab === 'mahasiswa' && user.role !== 'mahasiswa') {
        setError('Akses ditolak: Akun ini bukan Mahasiswa.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/mahasiswa');
      }
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK') {
        setError('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.');
      } else {
        setError(err.response?.data?.message || 'Login gagal, periksa kembali Email/NIM dan Kata Sandi');
      }
    } finally {
      setLoading(false);
    }
  };

  const isMahasiswa = activeTab === 'mahasiswa';
  const themeColor = isMahasiswa ? '#1F8B4C' : '#6366F1';
  const bgLight = isMahasiswa ? '#F0FDF4' : '#EEF2FF';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      
      {showForgotPass && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, width: '100%', maxWidth: 400 }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Reset Password</h3>
            {forgotMsg && (
              <div style={{ background: forgotError ? '#FEE2E2' : '#D1FAE5', color: forgotError ? '#991B1B' : '#065F46', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.85rem' }}>
                {forgotMsg}
              </div>
            )}
            <form onSubmit={handleForgotSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>NIM</label>
                <input value={forgotNim} onChange={e => setForgotNim(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} placeholder="Masukkan NIM" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email Terdaftar</label>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} placeholder="Masukkan Email" />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Password Baru</label>
                <input type="password" value={forgotNewPass} onChange={e => setForgotNewPass(e.target.value)} required minLength={6} style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} placeholder="Min. 6 karakter" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowForgotPass(false)} style={{ flex: 1, padding: '0.75rem', background: '#F1F5F9', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Batal</button>
                <button type="submit" disabled={forgotLoading} style={{ flex: 1, padding: '0.75rem', background: themeColor, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', opacity: forgotLoading ? 0.7 : 1 }}>{forgotLoading ? 'Proses...' : 'Reset'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Selectors */}
      <div style={{ display: 'flex', width: '100%', maxWidth: 850, marginBottom: '-10px', zIndex: 10, paddingLeft: 20 }}>
        <button 
          onClick={() => { setActiveTab('mahasiswa'); setError(''); }}
          style={{ padding: '12px 30px', background: isMahasiswa ? '#1E293B' : '#CBD5E1', color: '#fff', border: 'none', borderTopLeftRadius: 8, borderTopRightRadius: 8, fontWeight: 700, cursor: 'pointer', opacity: isMahasiswa ? 1 : 0.7, marginRight: 10, transition: '0.3s' }}
        >
          MAHASISWA (USER)
        </button>
        <button 
          onClick={() => { setActiveTab('admin'); setError(''); }}
          style={{ padding: '12px 30px', background: !isMahasiswa ? '#1E293B' : '#CBD5E1', color: '#fff', border: 'none', borderTopLeftRadius: 8, borderTopRightRadius: 8, fontWeight: 700, cursor: 'pointer', opacity: !isMahasiswa ? 1 : 0.7, transition: '0.3s' }}
        >
          ADMIN
        </button>
      </div>

      {/* Main Card */}
      <div style={{ display: 'flex', width: '100%', maxWidth: 850, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
        
        {/* Left Side: Illustration Area */}
        <div style={{ flex: 1, background: bgLight, padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {isMahasiswa ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>📱</div>
              <h2 style={{ color: themeColor, fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Money Track Mahasiswa</h2>
              <p style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>Kelola Keuanganmu, Raih Masa Depanmu</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>💻</div>
              <h2 style={{ color: themeColor, fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Money Track Mahasiswa</h2>
              <p style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>Panel Administrator</p>
            </div>
          )}
        </div>

        {/* Right Side: Form Area */}
        <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>
              {isMahasiswa ? 'Login ke akunmu' : 'Login Admin'}
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              {isMahasiswa ? 'Selamat datang kembali!' : 'Masuk ke akun admin'}
            </p>
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.75rem', borderRadius: 8, marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                Email / NIM
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Masukkan email / NIM"
                  required
                  style={{ width: '100%', padding: '0.8rem 1rem', paddingLeft: '2.5rem', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }}
                />
                <User size={18} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  style={{ width: '100%', padding: '0.8rem 1rem', paddingLeft: '2.5rem', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                />
                <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#475569' }}>
                <input type="checkbox" style={{ accentColor: themeColor, width: 16, height: 16 }} /> Ingat saya
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPass(true); }} style={{ fontSize: '0.85rem', color: themeColor, textDecoration: 'none', fontWeight: 600 }}>
                Lupa password?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', background: themeColor, color: '#fff', border: 'none', padding: '0.9rem', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          {isMahasiswa && (
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#475569' }}>
              Belum punya akun? <Link to="/register" style={{ color: themeColor, fontWeight: 700, textDecoration: 'none' }}>Daftar di sini</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
