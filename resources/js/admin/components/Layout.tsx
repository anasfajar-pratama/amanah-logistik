import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Truck, LayoutDashboard, Settings, Home, Layers, Info,
  Star, Phone, MessageSquare, LogOut, Menu, X, ChevronRight, Image
} from 'lucide-react';
import { logout } from '../api';
import { useAuth } from '../App';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/settings', icon: Settings, label: 'Pengaturan' },
  { to: '/admin/homepage', icon: Home, label: 'Homepage' },
  { to: '/admin/services', icon: Layers, label: 'Layanan' },
  { to: '/admin/about', icon: Info, label: 'Tentang Kami' },
  { to: '/admin/advantages', icon: Star, label: 'Keunggulan' },
  { to: '/admin/galleries', icon: Image, label: 'Galeri' },
  { to: '/admin/contact', icon: Phone, label: 'Kontak' },
  { to: '/admin/submissions', icon: MessageSquare, label: 'Pesan Masuk' },
];

export default function Layout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); } catch {}
    localStorage.removeItem('admin_token');
    setUser(null);
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-primary-700 text-white">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-primary-600">
        <img src="/logo-web.png" alt="Amanah Trans" className="h-9 w-auto" />
        <div>
          <p className="font-bold text-sm leading-tight">Amanah Trans</p>
          <p className="text-slate-400 text-xs">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent-500 text-white'
                  : 'text-slate-400 hover:bg-primary-600 hover:text-white'
              }`
            }>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-primary-600">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-accent-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 flex-col fixed inset-y-0 left-0 z-30 shadow-xl">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 z-50 shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo-web.png" alt="Amanah Trans" className="h-7 w-auto" />
            <span className="font-bold text-primary-800 text-sm">Admin Panel</span>
          </div>
        </header>

        {/* Breadcrumb bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 hidden lg:flex items-center gap-2 text-sm text-slate-500">
          <img src="/logo-web.png" alt="Amanah Trans" className="h-5 w-auto" />
          <ChevronRight className="w-3 h-3" />
          <span>Admin</span>
        </div>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
