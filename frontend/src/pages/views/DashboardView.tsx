import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, PieChart } from 'lucide-react';

interface Props {
  saldo: number;
  pemasukan: number;
  pengeluaran: number;
  transaksi: any[];
  chartData: any[];
  onLihatSemua: () => void;
  onTambah: () => void;
}

const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const DashboardView: React.FC<Props> = ({ saldo, pemasukan, pengeluaran, transaksi, chartData, onLihatSemua, onTambah }) => {
  const now = new Date();
  const bulanIni = transaksi.filter(t => {
    const d = new Date(t.tanggal);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const pemasukanBulan = bulanIni.filter(t => t.jenis === 'pemasukan').reduce((s, t) => s + parseFloat(t.jumlah), 0);
  const pengeluaranBulan = bulanIni.filter(t => t.jenis === 'pengeluaran').reduce((s, t) => s + parseFloat(t.jumlah), 0);

  return (
    <div>
      {/* Banner */}
      <div className="gradient-banner mb-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.4rem' }}>Saldo Akhir Bulan</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{formatRp(saldo)}</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Dompet sehat, tetap hemat! 💚</p>
        </div>
        <div style={{ fontSize: '5rem', lineHeight: 1 }}>💼</div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#E8F5E9', color: '#1F8B4C' }}><ArrowDownCircle /></div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#6C757D', fontWeight: 500 }}>Total Pemasukan</p>
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatRp(pemasukan)}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FEE2E2', color: '#FA5252' }}><ArrowUpCircle /></div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#6C757D', fontWeight: 500 }}>Total Pengeluaran</p>
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatRp(pengeluaran)}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}><PieChart /></div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#6C757D', fontWeight: 500 }}>Sisa Anggaran</p>
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatRp(saldo)}</p>
          </div>
        </div>
      </div>

      {/* Chart + Ringkasan */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>Grafik Arus Kas (6 Bulan Terakhir)</h3>
            <span style={{ fontSize: '0.75rem', background: '#F3F4F6', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>6 Bulan ▼</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={14}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v >= 1000000 ? `${v/1000000}jt` : `${v/1000}rb`} />
              <Tooltip formatter={(v: any) => formatRp(v)} />
              <Legend />
              <Bar dataKey="Pemasukan" fill="#1F8B4C" radius={[4,4,0,0]} />
              <Bar dataKey="Pengeluaran" fill="#FA5252" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Ringkasan Bulan Ini</h3>
          <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#E8F5E9', borderRadius: 8, padding: 6, color: '#1F8B4C' }}><ArrowDownCircle size={18} /></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#6C757D' }}>Pemasukan</p>
                <p style={{ fontWeight: 700, color: '#1F8B4C' }}>{formatRp(pemasukanBulan)}</p>
              </div>
            </div>
          </div>
          <div style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#FEE2E2', borderRadius: 8, padding: 6, color: '#FA5252' }}><ArrowUpCircle size={18} /></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#6C757D' }}>Pengeluaran</p>
                <p style={{ fontWeight: 700, color: '#FA5252' }}>{formatRp(pengeluaranBulan)}</p>
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#6C757D', marginBottom: 4 }}>Saldo Akhir Bulan</p>
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatRp(pemasukanBulan - pengeluaranBulan)}</p>
          </div>
        </div>
      </div>

      {/* Transaksi Terakhir + Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>Transaksi Terakhir</h3>
            <button onClick={onLihatSemua} style={{ fontSize: '0.75rem', fontWeight: 600, background: 'none', border: 'none', color: '#1F8B4C', cursor: 'pointer' }}>Lihat semua</button>
          </div>
          {transaksi.length === 0 && <p style={{ textAlign: 'center', color: '#6C757D', fontSize: '0.875rem', padding: '1rem 0' }}>Belum ada transaksi</p>}
          {transaksi.slice(0, 5).map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < 4 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ background: t.jenis === 'pemasukan' ? '#E8F5E9' : '#FEE2E2', borderRadius: 10, padding: 8, color: t.jenis === 'pemasukan' ? '#1F8B4C' : '#FA5252' }}>
                  {t.jenis === 'pemasukan' ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.kategori}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6C757D' }}>{new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: t.jenis === 'pemasukan' ? '#1F8B4C' : '#FA5252' }}>
                {t.jenis === 'pemasukan' ? '+' : '-'} {formatRp(parseFloat(t.jumlah))}
              </span>
            </div>
          ))}
        </div>

        <div className="card" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>💡 Tips Hemat</h3>
          <p style={{ fontSize: '0.85rem', color: '#6C757D', marginBottom: '1rem', lineHeight: 1.6 }}>
            Catat setiap pengeluaran kecilmu, karena sedikit demi sedikit jadi besar!
          </p>
          <button onClick={onTambah} style={{ background: '#1F8B4C', color: '#fff', border: 'none', borderRadius: 10, padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Gunakan fitur anggaran untuk kontrol lebih baik.</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
