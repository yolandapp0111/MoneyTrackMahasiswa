import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, BookOpen, PieChart, Target, BarChart2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, width: '100%', background: '#E6F4EA', borderRadius: 24, overflow: 'hidden', display: 'flex', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', position: 'relative' }}>
        
        {/* Decorative background shape */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: '50%', height: '30%', background: '#166534', borderTopRightRadius: '100%' }}></div>

        {/* Left Side: Hero Section */}
        <div style={{ flex: 1.2, padding: '4rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem' }}>🎓</div>
            <div>
              <h1 style={{ color: '#166534', fontWeight: 800, fontSize: '2.2rem', lineHeight: 1.2, margin: 0 }}>Money Track Mahasiswa</h1>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', color: '#166534', fontWeight: 500, marginBottom: '3rem', maxWidth: 400 }}>
            Kelola keuanganmu dengan bijak, raih masa depan yang lebih baik.
          </p>

          <div style={{ position: 'relative', height: 350, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            {/* Student illustrations placeholders using emojis */}
            <div style={{ fontSize: '12rem', zIndex: 2, transform: 'translateY(40px)' }}>👨‍🎓👩‍🎓</div>
            
            {/* Floating features */}
            <div style={{ position: 'absolute', top: '10%', left: 0, background: '#fff', padding: '0.75rem', borderRadius: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 3, width: 90, textAlign: 'center' }}>
              <div style={{ color: '#166534', marginBottom: 4 }}><BookOpen size={24} /></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#166534' }}>Catat Pemasukan</span>
            </div>

            <div style={{ position: 'absolute', bottom: '20%', left: -20, background: '#fff', padding: '0.75rem', borderRadius: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 3, width: 90, textAlign: 'center' }}>
              <div style={{ color: '#166534', marginBottom: 4 }}><PieChart size={24} /></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#166534' }}>Atur Pengeluaran</span>
            </div>

            <div style={{ position: 'absolute', top: '5%', right: 20, background: '#fff', padding: '0.75rem', borderRadius: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 3, width: 90, textAlign: 'center' }}>
              <div style={{ color: '#166534', marginBottom: 4 }}><Target size={24} /></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#166534' }}>Capai Target Tabungan</span>
            </div>

            <div style={{ position: 'absolute', bottom: '30%', right: -10, background: '#fff', padding: '0.75rem', borderRadius: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 3, width: 90, textAlign: 'center' }}>
              <div style={{ color: '#166534', marginBottom: 4 }}><BarChart2 size={24} /></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#166534' }}>Laporan Keuangan</span>
            </div>
          </div>
          
          <div style={{ position: 'absolute', bottom: '-20px', left: '10%', right: '10%', textAlign: 'center', color: '#86EFAC', fontWeight: 500, fontSize: '1.1rem' }}>
            <span style={{ color: '#4ADE80', fontSize: '1.5rem', fontWeight: 'bold' }}>"</span> Disiplin hari ini, bebas finansial di masa depan. <span style={{ color: '#4ADE80', fontSize: '1.5rem', fontWeight: 'bold' }}>"</span>
          </div>
        </div>

        {/* Right Side: Welcome Card */}
        <div style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ background: '#fff', width: '100%', height: '100%', borderRadius: 20, padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
            
            <div style={{ background: '#F0FDF4', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '2rem' }}>
              🎓
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E293B', marginBottom: '1rem', textAlign: 'center' }}>
              Selamat Datang!
            </h2>
            
            <p style={{ color: '#475569', textAlign: 'center', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 500 }}>
              Masuk untuk melanjutkan ke
            </p>
            <p style={{ color: '#166534', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, marginBottom: '2rem' }}>
              Money Track Mahasiswa
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '80%', marginBottom: '2rem' }}>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }}></div>
              <div style={{ color: '#166534' }}>🌿</div>
              <div style={{ flex: 1, height: 1, background: '#E2E8F0' }}></div>
            </div>

            <p style={{ color: '#64748B', textAlign: 'center', fontSize: '0.95rem', marginBottom: '3rem', maxWidth: 300, lineHeight: 1.6 }}>
              Kelola keuanganmu dengan mudah dan capai tujuan finansialmu.
            </p>

            <button 
              onClick={() => navigate('/login')}
              style={{ width: '100%', background: '#166534', color: '#fff', border: 'none', padding: '1rem', borderRadius: 12, fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 6px -1px rgba(22, 101, 52, 0.2)' }}
              onMouseOver={e => e.currentTarget.style.background = '#15803D'}
              onMouseOut={e => e.currentTarget.style.background = '#166534'}
            >
              <LogIn size={20} /> Masuk
            </button>

            {/* Bottom silhouette */}
            <div style={{ position: 'absolute', bottom: -10, left: 0, right: 0, textAlign: 'center', opacity: 0.3, pointerEvents: 'none' }}>
               <div style={{ fontSize: '4rem', color: '#86EFAC' }}>🏛️🌳🌳</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
