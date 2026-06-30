import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Download } from 'lucide-react';

const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

interface Props {
  transaksi: any[];
  allUsers: any[];
}

const LaporanSistemView: React.FC<Props> = ({ transaksi, allUsers }) => {
  const [selectedJenis, setSelectedJenis] = React.useState<string>('Semua');
  const [selectedPeriode, setSelectedPeriode] = React.useState<string>('Semua');

  // Format periods from transaction dates
  const periods = React.useMemo(() => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const uniquePeriods = new Set<string>();

    transaksi.forEach(t => {
      const d = new Date(t.tanggal);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        uniquePeriods.add(key);
      }
    });

    return Array.from(uniquePeriods)
      .sort()
      .reverse()
      .map(key => {
        const [year, month] = key.split('-');
        const monthName = months[parseInt(month, 10) - 1];
        return {
          value: key,
          label: `${monthName} ${year}`
        };
      });
  }, [transaksi]);

  // Filter transaction data based on dropdown filters
  const filteredTransaksi = React.useMemo(() => {
    return transaksi.filter(t => {
      const matchJenis = selectedJenis === 'Semua' || t.jenis.toLowerCase() === selectedJenis.toLowerCase();

      let matchPeriode = true;
      if (selectedPeriode !== 'Semua') {
        const d = new Date(t.tanggal);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          matchPeriode = key === selectedPeriode;
        } else {
          matchPeriode = false;
        }
      }

      return matchJenis && matchPeriode;
    });
  }, [transaksi, selectedJenis, selectedPeriode]);

  // Stats calculation
  const totalMahasiswa = allUsers.length;
  const totalTransaksi = filteredTransaksi.length;

  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  filteredTransaksi.forEach(t => {
    const val = Number(t.jumlah) || 0;
    if (t.jenis === 'pemasukan') {
      totalPemasukan += val;
    } else if (t.jenis === 'pengeluaran') {
      totalPengeluaran += val;
    }
  });

  // Top 5 students by expense in filtered list
  const topUsers = React.useMemo(() => {
    const userExpenseMap: { [key: string]: number } = {};
    filteredTransaksi.forEach(t => {
      if (t.jenis === 'pengeluaran') {
        const key = t.user_nama || 'Tidak Diketahui';
        userExpenseMap[key] = (userExpenseMap[key] || 0) + (Number(t.jumlah) || 0);
      }
    });
    return Object.entries(userExpenseMap)
      .map(([nama, amount]) => ({ nama, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredTransaksi]);

  // Chart data: Monthly (for last 6 months if period is "Semua") or Daily (if period is specific month)
  const chartData = React.useMemo(() => {
    if (selectedPeriode === 'Semua') {
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

      filteredTransaksi.forEach(t => {
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
    } else {
      const [yearStr, monthStr] = selectedPeriode.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1;

      const numDays = new Date(year, month + 1, 0).getDate();
      const result: any[] = [];
      for (let day = 1; day <= numDays; day++) {
        result.push({
          name: String(day),
          Pemasukan: 0,
          Pengeluaran: 0
        });
      }

      filteredTransaksi.forEach(t => {
        const date = new Date(t.tanggal);
        if (!isNaN(date.getTime()) && date.getFullYear() === year && date.getMonth() === month) {
          const dayNum = date.getDate();
          if (dayNum >= 1 && dayNum <= numDays) {
            if (t.jenis === 'pemasukan') {
              result[dayNum - 1].Pemasukan += Number(t.jumlah) || 0;
            } else if (t.jenis === 'pengeluaran') {
              result[dayNum - 1].Pengeluaran += Number(t.jumlah) || 0;
            }
          }
        }
      });
      return result;
    }
  }, [filteredTransaksi, selectedPeriode]);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>Laporan Sistem</h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Lihat laporan keseluruhan sistem.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '0.5rem' }}>Jenis Laporan</label>
              <select 
                value={selectedJenis}
                onChange={(e) => setSelectedJenis(e.target.value)}
                style={{ padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', background: '#fff', width: 200, fontSize: '0.875rem' }}
              >
                <option value="Semua">Semua</option>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '0.5rem' }}>Periode</label>
              <select 
                value={selectedPeriode}
                onChange={(e) => setSelectedPeriode(e.target.value)}
                style={{ padding: '0.6rem 1rem', borderRadius: 8, border: '1px solid #E2E8F0', outline: 'none', background: '#fff', width: 200, fontSize: '0.875rem' }}
              >
                <option value="Semua">Semua Periode</option>
                {periods.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1E293B', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            <Download size={16} /> Export PDF
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Mahasiswa</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{totalMahasiswa}</h3>
          </div>
          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Transaksi</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{totalTransaksi.toLocaleString('id-ID')}</h3>
          </div>
          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Pemasukan</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#10B981' }}>{formatRp(totalPemasukan)}</h3>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Pengeluaran</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#EF4444' }}>{formatRp(totalPengeluaran)}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            {selectedPeriode === 'Semua' ? 'Grafik Transaksi Sistem' : `Grafik Transaksi Harian - ${periods.find(p => p.value === selectedPeriode)?.label}`}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => val >= 1000 ? (val / 1000) + 'k' : val.toString()} />
              <Tooltip formatter={(v: any) => formatRp(Number(v) || 0)} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', marginTop: 10 }} />
              {(selectedJenis === 'Semua' || selectedJenis === 'pemasukan') && (
                <Line type="monotone" dataKey="Pemasukan" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              )}
              {(selectedJenis === 'Semua' || selectedJenis === 'pengeluaran') && (
                <Line type="monotone" dataKey="Pengeluaran" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Top 5 Mahasiswa Pengeluaran Terbesar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {topUsers.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.875rem', textAlign: 'center', margin: '2rem 0' }}>Belum ada data pengeluaran</p>
            ) : (
              topUsers.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748B', width: 20 }}>{idx + 1}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.nama}</span>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#EF4444' }}>{formatRp(item.amount)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanSistemView;
