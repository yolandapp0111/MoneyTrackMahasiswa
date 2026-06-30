import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const KelolaKategoriView: React.FC = () => {
  const getInitialCategories = () => {
    const saved = localStorage.getItem('kategori_admin');
    if (saved) return JSON.parse(saved);
    const defaults = [
      { id: '1', nama: 'Makan', icon: '🍽️' },
      { id: '2', nama: 'Transport', icon: '🚗' },
      { id: '3', nama: 'Kos', icon: '🏠' },
      { id: '4', nama: 'Kuliah', icon: '🎓' },
      { id: '5', nama: 'Hiburan', icon: '🎮' },
    ];
    localStorage.setItem('kategori_admin', JSON.stringify(defaults));
    return defaults;
  };

  const [categories, setCategories] = useState<{id: string, nama: string, icon: string}[]>(getInitialCategories);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama: '', icon: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat = { id: Date.now().toString(), nama: formData.nama, icon: formData.icon };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('kategori_admin', JSON.stringify(updated));
    setShowModal(false);
    setFormData({ nama: '', icon: '' });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus kategori ini?')) return;
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    localStorage.setItem('kategori_admin', JSON.stringify(updated));
  };

  return (
    <div className="card" style={{ padding: '2rem', position: 'relative' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>Kelola Kategori</h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Atur kategori pengeluaran di aplikasi.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#6366F1', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>No</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Nama Kategori</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Icon</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{i + 1}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>{c.nama}</td>
                <td style={{ padding: '1rem', fontSize: '1.25rem', textAlign: 'center' }}>{c.icon}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Belum ada kategori.</td></tr>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tambah Kategori</h3>
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nama Kategori</label>
                <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Icon (Emoji)</label>
                <input required type="text" placeholder="Contoh: 🛒" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#6366F1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Simpan Kategori
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaKategoriView;
