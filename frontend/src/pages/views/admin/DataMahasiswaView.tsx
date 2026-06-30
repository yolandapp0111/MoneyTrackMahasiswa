import React, { useState } from 'react';
import { Search, Plus, Trash2, X } from 'lucide-react';
import axios from 'axios';

interface Props {
  users: any[];
  onRefresh: () => void;
}

const DataMahasiswaView: React.FC<Props> = ({ users, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama_lengkap: '', nim: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const filteredUsers = users.filter(u => 
    u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) || 
    u.nim.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus mahasiswa ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      onRefresh();
    } catch {
      alert('Gagal menghapus');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/users', formData, { headers: { Authorization: `Bearer ${token}` } });
      setShowModal(false);
      setFormData({ nama_lengkap: '', nim: '', email: '', password: '' });
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', position: 'relative' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>Data Mahasiswa</h2>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Kelola semua data mahasiswa.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Cari nama atau NIM..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.875rem', outline: 'none' }} 
          />
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#6366F1', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
          <Plus size={16} /> Tambah Mahasiswa
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>NIM</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Nama</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Tanggal Daftar</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>{u.nim}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>{u.nama_lengkap}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{u.email}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{new Date(u.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Tidak ada data mahasiswa.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, width: 400, position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tambah Mahasiswa</h3>
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>NIM</label>
                <input required type="text" value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nama Lengkap</label>
                <input required type="text" value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password Default</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none' }} />
              </div>
              <button disabled={loading} type="submit" style={{ width: '100%', padding: '0.75rem', background: '#6366F1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Menyimpan...' : 'Simpan Mahasiswa'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataMahasiswaView;
