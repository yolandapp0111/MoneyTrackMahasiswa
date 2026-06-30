import React, { useState } from 'react';
import { Search } from 'lucide-react';

const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

interface Props {
  transaksi: any[];
}

const DataTransaksiView: React.FC<Props> = ({ transaksi }) => {
  const [search, setSearch] = useState('');
  const filteredData = transaksi.filter(t => 
    (t.user_nama || '').toLowerCase().includes(search.toLowerCase()) || 
    (t.kategori || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>Data Transaksi</h2>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Pantau semua transaksi di sistem.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Cari transaksi (nama/kategori)..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '0.875rem', outline: 'none' }} />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Nama Mahasiswa</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Jenis</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Kategori</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Jumlah</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#1E293B', fontWeight: 700 }}>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? filteredData.map((t, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {t.user_nama?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  {t.user_nama}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ padding: '0.25rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: t.jenis === 'pemasukan' ? '#D1FAE5' : '#FEE2E2', color: t.jenis === 'pemasukan' ? '#065F46' : '#991B1B' }}>
                    {t.jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{t.kategori}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, color: t.jenis === 'pemasukan' ? '#10B981' : '#EF4444', textAlign: 'right' }}>
                  {t.jenis === 'pemasukan' ? '+' : '-'} {formatRp(parseFloat(t.jumlah))}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>
                  {new Date(t.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Tidak ada data transaksi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTransaksiView;
