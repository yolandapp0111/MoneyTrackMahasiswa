import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, Users, DollarSign, PieChart, Settings, LogOut } from 'lucide-react';
import AdminDashboardView from './views/admin/AdminDashboardView';
import DataMahasiswaView from './views/admin/DataMahasiswaView';
import DataTransaksiView from './views/admin/DataTransaksiView';

import LaporanSistemView from './views/admin/LaporanSistemView';
import AdminPengaturanView from './views/admin/AdminPengaturanView';

type View = 'dashboard' | 'mahasiswa' | 'transaksi' | 'laporan' | 'pengaturan';

const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { id: 'mahasiswa', label: 'Data Mahasiswa', icon: <Users size={18} /> },
  { id: 'transaksi', label: 'Data Transaksi', icon: <DollarSign size={18} /> },
  { id: 'laporan', label: 'Laporan Sistem', icon: <PieChart size={18} /> },
  { id: 'pengaturan', label: 'Pengaturan', icon: <Settings size={18} /> },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [transaksi, setTransaksi] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<View>('dashboard');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userStr || !token) { navigate('/login'); return; }
    const u = JSON.parse(userStr);
    if (u.role !== 'admin') { navigate('/login'); return; }
    setUser(u);
    fetchData(token);
  }, [navigate]);

  const fetchData = async (token: string) => {
    try {
      const resT = await axios.get('http://localhost:5000/api/transaksi/all', { headers: { Authorization: `Bearer ${token}` } });
      setTransaksi(resT.data);
      const resU = await axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } });
      setAllUsers(resU.data);
    } catch (err) { console.error(err); }
  };

  const refreshUsers = () => {
    const token = localStorage.getItem('token');
    if (token) fetchData(token);
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Sidebar - Dark Navy Blue */}
      <div style={{ width: 260, background: '#1E293B', color: '#fff', display: 'flex', flexDirection: 'column', padding: '2rem 1.25rem', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
          <div style={{ background: '#6366F1', borderRadius: 8, padding: '6px', color: '#fff', display: 'flex', alignItems: 'center' }}>
            <Home size={22} />
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.5px' }}>Money Track Mahasiswa</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setActiveView(id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s', background: activeView === id ? '#6366F1' : 'transparent', color: activeView === id ? '#fff' : '#94A3B8', textAlign: 'left', width: '100%' }}>
              {icon}{label}
            </button>
          ))}
          
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s', background: 'transparent', color: '#94A3B8', textAlign: 'left', width: '100%', marginTop: 'auto' }}>
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '2rem' }}>
          {activeView === 'dashboard'  && <AdminDashboardView transaksi={transaksi} allUsers={allUsers} />}
          {activeView === 'mahasiswa'  && <DataMahasiswaView users={allUsers} onRefresh={refreshUsers} />}
          {activeView === 'transaksi'  && <DataTransaksiView transaksi={transaksi} />}
          {activeView === 'laporan'    && <LaporanSistemView transaksi={transaksi} allUsers={allUsers} />}
          {activeView === 'pengaturan' && <AdminPengaturanView user={user} onLogout={handleLogout} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
