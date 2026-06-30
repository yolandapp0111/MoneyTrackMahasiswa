import React, { useState } from 'react';
import { Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const KATEGORI_PEMASUKAN = ['Uang Saku', 'Beasiswa', 'Gaji Freelance', 'Lainnya'];
const KATEGORI_PENGELUARAN = [
  'Makanan', 'Minuman', 'Bensin', 'Belanja', 'Fashion', 'Skincare', 'Makeup',
  'Ngeprint', 'ATK', 'Kuota/Pulsa', 'Kost', 
  'Servis', 'Laptop', 'Handphone', 'Organisasi/UKM', 'Lainnya'
];

const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

interface Props {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const TambahTransaksiView: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({ jenis: 'pengeluaran', jumlah: '', kategori: '', catatan: '', tanggal: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'jenis') setForm(f => ({ ...f, jenis: value, kategori: '' }));
    else setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit(form); } finally { setLoading(false); }
  };

  const kategoriList = form.jenis === 'pemasukan' ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;

  return (
    <div className="card" style={{ maxWidth: 680, margin: '0 auto' }}>
      <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Tambah Transaksi Baru</h3>
      <p style={{ fontSize: '0.85rem', color: '#6C757D', marginBottom: '1.5rem' }}>Catat pemasukan atau pengeluaran kamu dengan mudah</p>

      {/* Jenis toggle */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button type="button" onClick={() => setForm(f => ({ ...f, jenis: 'pemasukan', kategori: '' }))}
          style={{ flex: 1, padding: '0.9rem', borderRadius: 12, border: `2px solid ${form.jenis === 'pemasukan' ? '#1F8B4C' : '#E5E7EB'}`, background: form.jenis === 'pemasukan' ? '#E8F5E9' : '#fff', color: form.jenis === 'pemasukan' ? '#1F8B4C' : '#6C757D', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
          <ArrowDownCircle size={20} /> Pemasukan
        </button>
        <button type="button" onClick={() => setForm(f => ({ ...f, jenis: 'pengeluaran', kategori: '' }))}
          style={{ flex: 1, padding: '0.9rem', borderRadius: 12, border: `2px solid ${form.jenis === 'pengeluaran' ? '#FA5252' : '#E5E7EB'}`, background: form.jenis === 'pengeluaran' ? '#FEE2E2' : '#fff', color: form.jenis === 'pengeluaran' ? '#FA5252' : '#6C757D', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
          <ArrowUpCircle size={20} /> Pengeluaran
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Jumlah (Rp)</label>
            <input type="number" name="jumlah" value={form.jumlah} onChange={handleChange} className="form-input" placeholder="Contoh: 50000" min="1" required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tanggal</label>
            <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="form-input" required />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Kategori</label>
          <select name="kategori" value={form.kategori} onChange={handleChange} className="form-input" required>
            <option value="">-- Pilih Kategori --</option>
            {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Catatan (Opsional)</label>
          <textarea name="catatan" value={form.catatan} onChange={handleChange} className="form-input" placeholder="Tambahkan detail transaksi..." style={{ resize: 'none', height: '5rem' }} />
        </div>

        {form.jumlah && (
          <div style={{ background: form.jenis === 'pemasukan' ? '#E8F5E9' : '#FEE2E2', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#6C757D' }}>Preview</span>
            <span style={{ fontWeight: 700, color: form.jenis === 'pemasukan' ? '#1F8B4C' : '#FA5252' }}>
              {form.jenis === 'pemasukan' ? '+' : '-'} {formatRp(parseFloat(form.jumlah) || 0)}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.85rem', background: '#1F8B4C', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : '💾 Simpan Transaksi'}
          </button>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: '0.85rem', background: '#fff', color: '#6C757D', border: '1px solid #E5E7EB', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahTransaksiView;
