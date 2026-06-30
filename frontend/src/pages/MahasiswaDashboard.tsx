import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, PlusCircle, ArrowDownCircle, ArrowUpCircle, History, PieChart, Settings, Bell, ChevronDown, LogOut } from 'lucide-react';
import DashboardView from './views/DashboardView';
import TambahTransaksiView from './views/TambahTransaksiView';
import TransaksiListView from './views/TransaksiListView';
import RiwayatView from './views/RiwayatView';
import LaporanView from './views/LaporanView';
import PengaturanView from './views/PengaturanView';

type View = 'dashboard' | 'tambah' | 'pemasukan' | 'pengeluaran' | 'riwayat' | 'laporan' | 'pengaturan';

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { id: 'tambah', label: 'Tambah Transaksi', icon: <PlusCircle size={18} /> },
  { id: 'pemasukan', label: 'Pemasukan', icon: <ArrowDownCircle size={18} /> },
  { id: 'pengeluaran', label: 'Pengeluaran', icon: <ArrowUpCircle size={18} /> },
  { id: 'riwayat', label: 'Riwayat', icon: <History size={18} /> },
  { id: 'laporan', label: 'Laporan', icon: <PieChart size={18} /> },
  { id: 'pengaturan', label: 'Pengaturan', icon: <Settings size={18} /> },
];

const MahasiswaDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [transaksi, setTransaksi] = useState<any[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [pemasukan, setPemasukan] = useState(0);
  const [pengeluaran, setPengeluaran] = useState(0);
  const [activeView, setActiveView] = useState<View>('dashboard');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userStr || !token) { navigate('/login'); return; }
    const u = JSON.parse(userStr);
    if (u.role !== 'mahasiswa') { navigate('/login'); return; }
    setUser(u);
    fetchData(token);
  }, [navigate]);

  const fetchData = async (token: string) => {
    try {
      const res = await axios.get('http://localhost:5000/api/transaksi/me', { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data;
      setTransaksi(data);
      const masuk = data.filter((t: any) => t.jenis === 'pemasukan').reduce((s: number, t: any) => s + parseFloat(t.jumlah), 0);
      const keluar = data.filter((t: any) => t.jenis === 'pengeluaran').reduce((s: number, t: any) => s + parseFloat(t.jumlah), 0);
      setPemasukan(masuk); setPengeluaran(keluar); setSaldo(masuk - keluar);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const handleSubmitTransaksi = async (formData: any) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/transaksi', formData, { headers: { Authorization: `Bearer ${token}` } });
    await fetchData(token!);
    setActiveView('dashboard');
    alert('Transaksi berhasil ditambahkan!');
  };

  const handleUpdateUser = (updatedUser: any) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Build chart data for last 6 months
  const now = new Date();
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const m = d.getMonth(), y = d.getFullYear();
    const items = transaksi.filter(t => { const td = new Date(t.tanggal); return td.getMonth() === m && td.getFullYear() === y; });
    return {
      name: d.toLocaleDateString('id-ID', { month: 'short' }),
      Pemasukan: items.filter(t => t.jenis === 'pemasukan').reduce((s, t) => s + parseFloat(t.jumlah), 0),
      Pengeluaran: items.filter(t => t.jenis === 'pengeluaran').reduce((s, t) => s + parseFloat(t.jumlah), 0),
    };
  });

  const viewTitle = navItems.find(n => n.id === activeView)?.label || '';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: '#1F8B4C', color: '#fff', display: 'flex', flexDirection: 'column', padding: '2rem 1.25rem', boxShadow: '4px 0 20px rgba(0,0,0,0.08)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '6px 8px', color: '#1F8B4C', display: 'flex', alignItems: 'center' }}>
            <PieChart size={22} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3 }}>Money Track Mahasiswa</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setActiveView(id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.15s', background: activeView === id ? '#fff' : 'transparent', color: activeView === id ? '#1F8B4C' : 'rgba(255,255,255,0.85)', textAlign: 'left', width: '100%' }}>
              {icon}{label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'M'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nama_lengkap}</p>
              <p style={{ fontSize: '0.7rem', opacity: 0.75 }}>● Online</p>
            </div>
            <button onClick={() => setActiveView('pengaturan')} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}><ChevronDown size={16} /></button>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.25rem 0' }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8F9FA', overflowY: 'auto' }}>
        {/* Topbar */}
        <div style={{ background: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
            {navItems.find(n => n.id === activeView)?.icon}
            <span>{viewTitle}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="#6C757D" />
              <span style={{ position: 'absolute', top: -3, right: -3, background: '#FA5252', width: 8, height: 8, borderRadius: '50%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8F5E9', color: '#1F8B4C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'M'}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Halo, {user?.nama_lengkap?.split(' ')[0]}! 🌸</span>
              <ChevronDown size={14} color="#6C757D" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '1.75rem 2rem' }}>
          {activeView === 'dashboard' && <DashboardView saldo={saldo} pemasukan={pemasukan} pengeluaran={pengeluaran} transaksi={transaksi} chartData={chartData} onLihatSemua={() => setActiveView('riwayat')} onTambah={() => setActiveView('tambah')} />}
          {activeView === 'tambah' && <TambahTransaksiView onSubmit={handleSubmitTransaksi} onCancel={() => setActiveView('dashboard')} />}
          {activeView === 'pemasukan' && <TransaksiListView transaksi={transaksi} jenis="pemasukan" onRefresh={() => fetchData(localStorage.getItem('token')!)} />}
          {activeView === 'pengeluaran' && <TransaksiListView transaksi={transaksi} jenis="pengeluaran" onRefresh={() => fetchData(localStorage.getItem('token')!)} />}
          {activeView === 'riwayat' && <RiwayatView transaksi={transaksi} onRefresh={() => fetchData(localStorage.getItem('token')!)} />}
          {activeView === 'laporan' && <LaporanView transaksi={transaksi} />}
          {activeView === 'pengaturan' && <PengaturanView user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />}
        </div>
      </div>
    </div>
  );
};

export default MahasiswaDashboard;
