import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Home, Layers, Info, Star, Phone, MessageSquare, ExternalLink, TrendingUp } from 'lucide-react';
import { getSubmissions } from '../api';
import { useAuth } from '../App';

const menuItems = [
  { to: '/admin/settings', icon: Settings, label: 'Pengaturan', desc: 'Nama perusahaan, WhatsApp, tagline', color: 'bg-slate-100 text-slate-700' },
  { to: '/admin/homepage', icon: Home, label: 'Homepage', desc: 'Hero section, statistik, CTA', color: 'bg-blue-50 text-blue-700' },
  { to: '/admin/services', icon: Layers, label: 'Layanan', desc: 'Kelola layanan pengiriman', color: 'bg-orange-50 text-orange-700' },
  { to: '/admin/about', icon: Info, label: 'Tentang Kami', desc: 'Profil dan visi perusahaan', color: 'bg-green-50 text-green-700' },
  { to: '/admin/advantages', icon: Star, label: 'Keunggulan', desc: 'Nilai dan keunggulan perusahaan', color: 'bg-yellow-50 text-yellow-700' },
  { to: '/admin/contact', icon: Phone, label: 'Kontak', desc: 'Info kontak dan peta lokasi', color: 'bg-purple-50 text-purple-700' },
  { to: '/admin/submissions', icon: MessageSquare, label: 'Pesan Masuk', desc: 'Pesan dari pengunjung', color: 'bg-red-50 text-red-700' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getSubmissions(1).then((data) => {
      const items = data.data ?? [];
      setUnread(items.filter((s: { is_read: boolean }) => !s.is_read).length);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang kembali, <span className="font-semibold text-slate-700">{user?.name}</span>!</p>
      </div>

      {unread > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-bold text-orange-900">Ada {unread} pesan belum dibaca</p>
              <p className="text-orange-700 text-sm">Pesan dari pengunjung website Anda</p>
            </div>
          </div>
          <Link to="/admin/submissions"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            Lihat <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-orange-400" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900">Website Anda Aktif</p>
          <p className="text-slate-500 text-sm">Semua perubahan akan langsung tampil di website.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors">
          Lihat Website <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Kelola Konten</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to}
            className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-orange-200 transition-all duration-200 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">{label}</h3>
            <p className="text-slate-500 text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
