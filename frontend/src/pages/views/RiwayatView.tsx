import React, { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Search, Pencil, Trash2, Loader2, X } from 'lucide-react';
import axios from 'axios';

const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const KATEGORI_PEMASUKAN = ['Uang Saku', 'Beasiswa', 'Gaji Freelance', 'Lainnya'];
const KATEGORI_PENGELUARAN = [
  'Makanan', 'Minuman', 'Bensin', 'Belanja', 'Fashion', 'Skincare', 'Makeup',
  'Ngeprint', 'ATK', 'Kuota/Pulsa', 'Kost', 
  'Servis', 'Laptop', 'Handphone', 'Organisasi/UKM', 'Lainnya'
];

interface Props { transaksi: any[]; onRefresh?: () => void; }

const RiwayatView: React.FC<Props> = ({ transaksi, onRefresh }) => {
  const [filter, setFilter] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua');
  const [search, setSearch] = useState('');
  const [editingData, setEditingData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filtered = transaksi.filter(t => {
    const matchJenis = filter === 'semua' || t.jenis === filter;
    const matchSearch = t.kategori.toLowerCase().includes(search.toLowerCase()) || (t.catatan || '').toLowerCase().includes(search.toLowerCase());
    return matchJenis && matchSearch;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/transaksi/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Gagal menghapus transaksi');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const dataToSubmit = {
        ...editingData,
        tanggal: typeof editingData.tanggal === 'string' && editingData.tanggal.includes('T') 
          ? editingData.tanggal.split('T')[0] 
          : editingData.tanggal
      };
      await axios.put(`http://localhost:5000/api/transaksi/${editingData.id}`, dataToSubmit, { headers: { Authorization: `Bearer ${token}` } });
      setEditingData(null);
      if (onRefresh) onRefresh();
      alert('Transaksi berhasil diperbarui!');
    } catch (err: any) {
      alert('Gagal mengupdate transaksi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'jenis') setEditingData((f: any) => ({ ...f, jenis: value, kategori: '' }));
    else setEditingData((f: any) => ({ ...f, [name]: value }));
  };

  return (
    <div>
      {/* Edit Modal */}
      {editingData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#fff', padding: '1.5rem 2rem', borderRadius: 12, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.2rem' }}>Edit Transaksi</h3>
              <button onClick={() => setEditingData(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C757D' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button type="button" onClick={() => setEditingData((f: any) => ({ ...f, jenis: 'pemasukan', kategori: '' }))}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: `2px solid ${editingData.jenis === 'pemasukan' ? '#1F8B4C' : '#E5E7EB'}`, background: editingData.jenis === 'pemasukan' ? '#E8F5E9' : '#fff', color: editingData.jenis === 'pemasukan' ? '#1F8B4C' : '#6C757D', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <ArrowDownCircle size={16} /> Pemasukan
                </button>
                <button type="button" onClick={() => setEditingData((f: any) => ({ ...f, jenis: 'pengeluaran', kategori: '' }))}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: `2px solid ${editingData.jenis === 'pengeluaran' ? '#FA5252' : '#E5E7EB'}`, background: editingData.jenis === 'pengeluaran' ? '#FEE2E2' : '#fff', color: editingData.jenis === 'pengeluaran' ? '#FA5252' : '#6C757D', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <ArrowUpCircle size={16} /> Pengeluaran
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Jumlah (Rp)</label>
                  <input type="number" name="jumlah" value={editingData.jumlah} onChange={handleChangeEdit} style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Tanggal</label>
                  <input type="date" name="tanggal" value={typeof editingData.tanggal === 'string' && editingData.tanggal.includes('T') ? editingData.tanggal.split('T')[0] : editingData.tanggal} onChange={handleChangeEdit} style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} required />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Kategori</label>
                <select name="kategori" value={editingData.kategori} onChange={handleChangeEdit} style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box' }} required>
                  <option value="">-- Pilih Kategori --</option>
                  {(editingData.jenis === 'pemasukan' ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Catatan</label>
                <textarea name="catatan" value={editingData.catatan || ''} onChange={handleChangeEdit} style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', boxSizing: 'border-box', resize: 'none', height: '4rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setEditingData(null)} style={{ flex: 1, padding: '0.85rem', background: '#F1F5F9', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Batal</button>
                <button type="submit" disabled={isSaving} style={{ flex: 1, padding: '0.85rem', background: '#1F8B4C', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari transaksi..." style={{ paddingLeft: 36, width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: '0.875rem', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['semua', 'pemasukan', 'pengeluaran'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.5rem 1rem', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', background: filter === f ? (f === 'pemasukan' ? '#1F8B4C' : f === 'pengeluaran' ? '#FA5252' : '#1F8B4C') : '#F3F4F6', color: filter === f ? '#fff' : '#6C757D' }}>
                {f === 'semua' ? 'Semua' : f === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontWeight: 700 }}>Riwayat Transaksi</h3>
          <span style={{ fontSize: '0.8rem', color: '#6C757D' }}>{filtered.length} transaksi</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 550 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                {['Tanggal', 'Jenis', 'Kategori', 'Catatan', 'Jumlah', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '0.75rem', textAlign: h === 'Jumlah' ? 'right' : h === 'Aksi' ? 'center' : 'left', fontSize: '0.75rem', color: '#6C757D', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#6C757D', fontSize: '0.875rem' }}>Tidak ada transaksi ditemukan</td></tr>
              )}
              {filtered.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '0.85rem 0.75rem', fontSize: '0.85rem' }}>
                    {new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    <span style={{ padding: '0.25rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: t.jenis === 'pemasukan' ? '#D1FAE5' : '#FEE2E2', color: t.jenis === 'pemasukan' ? '#065F46' : '#991B1B', display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                      {t.jenis === 'pemasukan' ? <ArrowDownCircle size={12} /> : <ArrowUpCircle size={12} />}
                      {t.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>{t.kategori}</td>
                  <td style={{ padding: '0.85rem 0.75rem', fontSize: '0.8rem', color: '#6C757D' }}>{t.catatan || '-'}</td>
                  <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right', fontWeight: 700, fontSize: '0.875rem', color: t.jenis === 'pemasukan' ? '#1F8B4C' : '#FA5252' }}>
                    {t.jenis === 'pemasukan' ? '+' : '-'} {formatRp(parseFloat(t.jumlah))}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>
                    <button onClick={() => setEditingData(t)} style={{ background: '#E0F2FE', color: '#0284C7', border: 'none', borderRadius: 6, padding: '0.4rem', cursor: 'pointer', marginRight: '0.5rem' }} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(t.id)} style={{ background: '#FEE2E2', color: '#E11D48', border: 'none', borderRadius: 6, padding: '0.4rem', cursor: 'pointer' }} title="Hapus">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiwayatView;
