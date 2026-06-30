import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap } from 'lucide-react';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
    }
  }, [navigate]);

  const handleRoleSelect = (role: string) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin' && role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'mahasiswa' && role === 'mahasiswa') {
        navigate('/dashboard/mahasiswa');
      } else {
        alert('Anda tidak memiliki akses ke role ini.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="flex-col items-center">
        <h1 className="text-admin font-bold text-3xl mb-2 text-center" style={{ color: '#8B5CF6' }}>Money Track Mahasiswa</h1>
        <p className="text-muted text-sm mb-10 text-center">Silakan pilih role Anda untuk melanjutkan</p>

        <div className="card p-8" style={{ width: '600px', maxWidth: '90vw' }}>
          <h2 className="font-bold text-xl text-center mb-2" style={{ color: '#8B5CF6' }}>Pilih Role</h2>
          <p className="text-muted text-center text-sm mb-8">Pilih peran yang sesuai dengan akun Anda</p>

          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Admin Role */}
            <div className="card text-center p-6 flex-col items-center justify-between" style={{ border: '1px solid #8B5CF6', boxShadow: 'none' }}>
              <div className="bg-admin-light rounded-full p-4 mb-4" style={{ backgroundColor: '#F0EDFD', color: '#8B5CF6' }}>
                <User size={48} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-admin" style={{ color: '#8B5CF6' }}>Admin</h3>
              <p className="text-xs text-muted mb-6">Kelola data pengguna, laporan, dan sistem aplikasi.</p>
              <button 
                className="btn w-full text-white" 
                style={{ backgroundColor: '#8B5CF6' }}
                onClick={() => handleRoleSelect('admin')}
              >
                Masuk sebagai Admin
              </button>
            </div>

            {/* Mahasiswa Role */}
            <div className="card text-center p-6 flex-col items-center justify-between" style={{ border: '1px solid #2E7D32', boxShadow: 'none' }}>
              <div className="rounded-full p-4 mb-4" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                <GraduationCap size={48} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#2E7D32' }}>Mahasiswa</h3>
              <p className="text-xs text-muted mb-6">Kelola keuangan pribadi dan catat transaksi.</p>
              <button 
                className="btn w-full text-white" 
                style={{ backgroundColor: '#2E7D32' }}
                onClick={() => handleRoleSelect('mahasiswa')}
              >
                Masuk sebagai Mahasiswa
              </button>
            </div>
          </div>

          <p className="text-sm mt-8 text-center text-muted">
            Kembali ke login? <span className="font-medium cursor-pointer" style={{ color: '#2E7D32' }} onClick={() => { localStorage.clear(); navigate('/login'); }}>Masuk di sini</span>
          </p>
        </div>

        <p className="text-xs text-muted mt-10">© 2026 Money Track Mahasiswa. All rights reserved.</p>
      </div>
    </div>
  );
};

export default RoleSelection;
