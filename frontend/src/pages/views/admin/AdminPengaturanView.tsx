import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';

interface Props { user: any; onLogout: () => void; }

const AdminPengaturanView: React.FC<Props> = ({ user, onLogout }) => {
  const [nama, setNama] = useState(user?.nama_lengkap || '');
  const [email, setEmail] = useState(user?.email || '');
  const [msg, setMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Profil berhasil diperbarui!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {msg && <div style={{ background: '#D1FAE5', color: '#065F46', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontWeight: 600 }}>{msg}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#E0E7FF', borderRadius: 8, padding: 6, color: '#6366F1' }}><User size={18} /></div>
          <h3 style={{ fontWeight: 700 }}>Pengaturan Profil Admin</h3>
        </div>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Nama Lengkap</label>
            <input value={nama} onChange={e => setNama(e.target.value)} style={{ width: '100%', padding: '0.7rem 1rem', border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none' }} required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.7rem 1rem', border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none' }} required />
          </div>
          <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#6366F1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Simpan Perubahan</button>
        </form>
      </div>

      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem' }}>
        <div>
          <p style={{ fontWeight: 600 }}>Keluar dari Akun</p>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Sesi kerja admin akan diakhiri.</p>
        </div>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminPengaturanView;
