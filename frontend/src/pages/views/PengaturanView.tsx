import React, { useState } from 'react';
import { User, Lock, LogOut } from 'lucide-react';
import axios from 'axios';

interface Props { user: any; onLogout: () => void; onUpdateUser?: (u: any) => void; }

const PengaturanView: React.FC<Props> = ({ user, onLogout, onUpdateUser }) => {
  const [nama, setNama] = useState(user?.nama_lengkap || '');
  const [email, setEmail] = useState(user?.email || '');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const showMsg = (text: string, error = false) => {
    setMsg(text); setIsError(error);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleSaveProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/profile', { nama_lengkap: nama, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onUpdateUser) onUpdateUser({ nama_lengkap: nama, email });
      showMsg('Profil berhasil diperbarui!');
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Gagal memperbarui profil', true);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) { showMsg('Konfirmasi password tidak cocok!', true); return; }
    if (newPass.length < 6) { showMsg('Password minimal 6 karakter!', true); return; }
    
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/password', { oldPass, newPass }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMsg('Password berhasil diubah!');
      setOldPass(''); setNewPass(''); setConfirmPass('');
    } catch (err: any) {
      showMsg(err.response?.data?.message || 'Gagal mengubah password', true);
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.7rem 1rem', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: '0.9rem', background: '#F9FAFB', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', display: 'block', color: '#374151' };
  const btnStyle: React.CSSProperties = { padding: '0.75rem 1.5rem', background: '#1F8B4C', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {msg && (
        <div style={{ background: !isError ? '#D1FAE5' : '#FEE2E2', color: !isError ? '#065F46' : '#991B1B', padding: '0.75rem 1rem', borderRadius: 10, marginBottom: '1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
          {msg}
        </div>
      )}

      {/* Profile info card */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E8F5E9', color: '#1F8B4C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, flexShrink: 0 }}>
          {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'M'}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.nama_lengkap}</p>
          <p style={{ color: '#6C757D', fontSize: '0.85rem' }}>{user?.email}</p>
          <span style={{ background: '#E8F5E9', color: '#1F8B4C', fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>Mahasiswa</span>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p style={{ fontSize: '0.75rem', color: '#6C757D' }}>NIM</p>
          <p style={{ fontWeight: 700 }}>{user?.nim}</p>
        </div>
      </div>

      {/* Edit Profil */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#E8F5E9', borderRadius: 8, padding: 6, color: '#1F8B4C' }}><User size={18} /></div>
          <h3 style={{ fontWeight: 700 }}>Edit Profil</h3>
        </div>
        <form onSubmit={handleSaveProfil}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Nama Lengkap</label>
            <input value={nama} onChange={e => setNama(e.target.value)} style={inputStyle} required />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          </div>
          <button type="submit" style={btnStyle}>Simpan Perubahan</button>
        </form>
      </div>

      {/* Ganti Password */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#FEE2E2', borderRadius: 8, padding: 6, color: '#FA5252' }}><Lock size={18} /></div>
          <h3 style={{ fontWeight: 700 }}>Ganti Password</h3>
        </div>
        <form onSubmit={handleSavePassword}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Password Lama</label>
            <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} style={inputStyle} placeholder="Masukkan password lama" required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Password Baru</label>
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} style={inputStyle} placeholder="Min. 6 karakter" minLength={6} required />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Konfirmasi Password Baru</label>
            <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} style={inputStyle} placeholder="Ulangi password baru" required />
          </div>
          <button type="submit" style={{ ...btnStyle, background: '#FA5252' }}>Ubah Password</button>
        </form>
      </div>

      {/* Logout */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem' }}>
        <div>
          <p style={{ fontWeight: 600 }}>Keluar dari Akun</p>
          <p style={{ fontSize: '0.8rem', color: '#6C757D' }}>Anda akan diarahkan ke halaman login</p>
        </div>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: '#FEE2E2', color: '#FA5252', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default PengaturanView;
