import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';

const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
const COLORS = ['#1F8B4C','#FA5252','#3B82F6','#F59E0B','#8B5CF6','#06B6D4','#10B981','#EF4444'];

interface Props { transaksi: any[]; }

const LaporanView: React.FC<Props> = ({ transaksi }) => {
  const now = new Date();

  // Monthly chart data (last 6 months)
  const months: any[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const name = d.toLocaleDateString('id-ID', { month: 'short' });
    const m = d.getMonth(); const y = d.getFullYear();
    const items = transaksi.filter(t => { const td = new Date(t.tanggal); return td.getMonth() === m && td.getFullYear() === y; });
    months.push({
      name,
      Pemasukan: items.filter(t => t.jenis === 'pemasukan').reduce((s, t) => s + parseFloat(t.jumlah), 0),
      Pengeluaran: items.filter(t => t.jenis === 'pengeluaran').reduce((s, t) => s + parseFloat(t.jumlah), 0),
    });
  }

  // Category breakdown for pengeluaran
  const catMap: Record<string, number> = {};
  transaksi.filter(t => t.jenis === 'pengeluaran').forEach(t => {
    catMap[t.kategori] = (catMap[t.kategori] || 0) + parseFloat(t.jumlah);
  });
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  const totalPemasukan = transaksi.filter(t => t.jenis === 'pemasukan').reduce((s, t) => s + parseFloat(t.jumlah), 0);
  const totalPengeluaran = transaksi.filter(t => t.jenis === 'pengeluaran').reduce((s, t) => s + parseFloat(t.jumlah), 0);

  return (
    <div>
      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Pemasukan', val: totalPemasukan, icon: <ArrowDownCircle size={22} />, bg: '#E8F5E9', color: '#1F8B4C' },
          { label: 'Total Pengeluaran', val: totalPengeluaran, icon: <ArrowUpCircle size={22} />, bg: '#FEE2E2', color: '#FA5252' },
          { label: 'Saldo Bersih', val: totalPemasukan - totalPengeluaran, icon: <TrendingUp size={22} />, bg: '#EFF6FF', color: '#3B82F6' },
        ].map(({ label, val, icon, bg, color }) => (
          <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ background: bg, color, borderRadius: 12, padding: 10 }}>{icon}</div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6C757D', marginBottom: 2 }}>{label}</p>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color }}>{formatRp(val)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Arus Kas 6 Bulan Terakhir</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={months} barSize={12}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => v >= 1000000 ? `${v/1000000}jt` : `${v/1000}rb`} />
              <Tooltip formatter={(v: any) => formatRp(v)} />
              <Legend />
              <Bar dataKey="Pemasukan" fill="#1F8B4C" radius={[4,4,0,0]} />
              <Bar dataKey="Pengeluaran" fill="#FA5252" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Distribusi Pengeluaran</h3>
          {pieData.length === 0
            ? <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6C757D' }}>Belum ada data pengeluaran</div>
            : <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatRp(v)} />
                </PieChart>
              </ResponsiveContainer>
          }
        </div>
      </div>
    </div>
  );
};

export default LaporanView;
