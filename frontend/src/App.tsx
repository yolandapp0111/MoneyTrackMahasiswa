import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import MahasiswaDashboard from './pages/MahasiswaDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/role" element={<RoleSelection />} />
        <Route path="/dashboard/mahasiswa" element={<MahasiswaDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
