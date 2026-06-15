import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from './api';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import HomepagePage from './pages/Homepage';
import ServicesPage from './pages/Services';
import AboutUsPage from './pages/AboutUs';
import AdvantagesPage from './pages/Advantages';
import ContactPage from './pages/Contact';
import SubmissionsPage from './pages/Submissions';

interface AuthContextType {
  user: { id: number; name: string; email: string } | null;
  setUser: (u: AuthContextType['user']) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null, setUser: () => {}, loading: true,
});

export const useAuth = () => useContext(AuthContext);

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500 text-lg font-medium">Memuat...</div>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

export default function App() {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { setLoading(false); return; }
    getUser()
      .then(data => setUser(data.user))
      .catch(() => localStorage.removeItem('admin_token'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="homepage" element={<HomepagePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="advantages" element={<AdvantagesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="submissions" element={<SubmissionsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
