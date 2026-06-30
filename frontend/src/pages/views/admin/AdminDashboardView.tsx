import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Users, CreditCard, UserCheck, ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

interface Props {
  transaksi: any[];
  allUsers: any[];
}

const AdminDashboardView: React.FC<Props> = ({ transaksi, allUsers }) => {
  // Calculations
  const totalMahasiswa = allUsers.length;
  const totalTransaksi = transaksi.length;

  const activeUserIds = new Set(transaksi.map(t => t.user_id));
  const penggunaAktif = activeUserIds.size;

  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  transaksi.forEach(t => {
    const val = Number(t.jumlah) || 0;
    if (t.jenis === 'pemasukan') {
      totalPemasukan += val;
    } else if (t.jenis === 'pengeluaran') {
      totalPengeluaran += val;
    }
  });
  const totalSaldo = totalPemasukan - totalPengeluaran;

  // Monthly trend chart for the last 6 months
  const chartData = React.useMemo(() => {
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const result: any[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      result.push({
        name: monthsShort[d.getMonth()],
        monthNum: d.getMonth(),
        year: d.getFullYear(),
        Pemasukan: 0,
        Pengeluaran: 0
      });
    }

    transaksi.forEach(t => {
      const date = new Date(t.tanggal);
      if (!isNaN(date.getTime())) {
        const m = date.getMonth();
        const y = date.getFullYear();
        const entry = result.find(r => r.monthNum === m && r.year === y);
        if (entry) {
          if (t.jenis === 'pemasukan') {
            entry.Pemasukan += Number(t.jumlah) || 0;
          } else if (t.jenis === 'pengeluaran') {
            entry.Pengeluaran += Number(t.jumlah) || 0;
          }
        }
      }
    });

    return result.map(({ name, Pemasukan, Pengeluaran }) => ({ name, Pemasukan, Pengeluaran }));
  }, [transaksi]);

  // Top expense categories
  const categoryStats = React.useMemo(() => {
    const categoryExpenseMap: { [key: string]: number } = {};
    let totalExpenseForCategories = 0;

    transaksi.forEach(t => {
      if (t.jenis === 'pengeluaran') {
        const cat = t.kategori || 'Lainnya';
        const val = Number(t.jumlah) || 0;
        categoryExpenseMap[cat] = (categoryExpenseMap[cat] || 0) + val;
        totalExpenseForCategories += val;
      }
    });

    const colors = ['#6366F1', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
    return Object.entries(categoryExpenseMap)
      .map(([label, amount], idx) => {
        const pct = totalExpenseForCategories > 0 ? Math.round((amount / totalExpenseForCategories) * 100) : 0;
        return {
          label,
          pct,
          color: colors[idx % colors.length]
        };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5);
  }, [transaksi]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>Dashboard Admin</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Admin</span>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6366F1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            A
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#D1FAE5', color: '#10B981', padding: '0.75rem', borderRadius: 12 }}><Users size={24} /></div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Mahasiswa</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalMahasiswa}</h3>
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#FEF3C7', color: '#F59E0B', padding: '0.75rem', borderRadius: 12 }}><CreditCard size={24} /></div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Transaksi</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalTransaksi.toLocaleString('id-ID')}</h3>
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#E0E7FF', color: '#6366F1', padding: '0.75rem', borderRadius: 12 }}><UserCheck size={24} /></div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Pengguna Aktif</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{penggunaAktif}</h3>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#D1FAE5', color: '#10B981', padding: '0.75rem', borderRadius: 12 }}><ArrowDownCircle size={24} /></div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Pemasukan</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>{formatRp(totalPemasukan)}</h3>
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '0.75rem', borderRadius: 12 }}><ArrowUpCircle size={24} /></div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Pengeluaran</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#EF4444' }}>{formatRp(totalPengeluaran)}</h3>
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#E0E7FF', color: '#6366F1', padding: '0.75rem', borderRadius: 12 }}><Wallet size={24} /></div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Saldo</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#6366F1' }}>{formatRp(totalSaldo)}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Grafik Transaksi Bulanan</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => val >= 1000 ? (val / 1000) + 'k' : val.toString()} />
              <Tooltip formatter={(v: any) => formatRp(Number(v) || 0)} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="Pemasukan" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Pengeluaran" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Pengeluaran Terbanyak (Kategori)</h3>
          {categoryStats.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: '0.875rem', textAlign: 'center', margin: '2rem 0' }}>Belum ada data pengeluaran</p>
          ) : (
            categoryStats.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>{item.label}</span>
                  <span>{item.pct}%</span>
                </div>
                <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 4 }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
