import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Video, X, ChevronRight, Truck } from 'lucide-react';
import { fetchSiteData, SiteData } from '../api';

const getYtThumb = (url: string) => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
};

export default function Galeri() {
  const [data, setData] = useState<SiteData | null>(null);
  const [preview, setPreview] = useState<{ item: SiteData['galleries'][0] } | null>(null);

  useEffect(() => {
    fetchSiteData().then(setData);
  }, []);

  const items = data?.galleries ?? [];
  const companyName = data?.settings?.company_name ?? 'Amanah Trans Logistik';

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* HEADER */}
      <nav className="bg-primary-700 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img src="/logo-web.png" alt={companyName} className="h-10 w-auto" />
              <span className="font-bold text-[1.216rem] md:text-[1.43rem] tracking-tight text-white">{companyName}</span>
            </div>
            <Link to="/"
              className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
          </div>
        </div>
      </nav>

      {/* TITLE */}
      <section className="py-16 bg-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-black text-primary-800 mb-4">Galeri</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Dokumentasi kegiatan dan layanan PT Amanah Trans Logistik
          </p>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Belum ada galeri.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((g) => (
                <div key={g.id}
                  onClick={() => setPreview({ item: g })}
                  className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="h-52 overflow-hidden bg-accent-50 relative group">
                    {g.type === 'photo' && g.file_url
                      ? <img src={g.file_url} alt={g.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : g.type === 'video' && g.video_url
                        ? <><img src={getYtThumb(g.video_url) ?? ''} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => (e.currentTarget.style.display = 'none')} />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Video className="w-8 h-8 text-primary-700 ml-1" />
                              </div>
                            </div></>
                        : <div className="w-full h-full flex items-center justify-center text-slate-300">Tidak ada</div>
                    }
                    <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium bg-white/90 text-slate-700 backdrop-blur-sm">
                      {g.type === 'photo' ? 'Foto' : 'Video'}
                    </span>
                    <div className="absolute inset-0 bg-primary-700/0 group-hover:bg-primary-700/30 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-accent-500 px-5 py-2 rounded-full text-sm">
                        Lihat Detail
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-primary-800 mb-1 group-hover:text-accent-500 transition-colors">{g.title}</h3>
                    {g.description && <p className="text-slate-500 text-sm line-clamp-2">{g.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PREVIEW POPUP */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg text-primary-800">{preview.item.title}</h2>
              <button onClick={() => setPreview(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              {preview.item.type === 'photo' && preview.item.file_url
                ? <img src={preview.item.file_url} alt={preview.item.title} className="w-full rounded-xl object-cover max-h-[60vh]" />
                : preview.item.type === 'video' && preview.item.video_url
                  ? <div className="aspect-video rounded-xl overflow-hidden bg-black">
                      <iframe src={preview.item.video_url.replace('watch?v=', 'embed/').split('&')[0]} className="w-full h-full" allowFullScreen title={preview.item.title} />
                    </div>
                  : preview.item.type === 'video'
                    ? <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                        <Video className="w-20 h-20 text-accent-400" />
                      </div>
                    : null
              }
              {preview.item.description && (
                <p className="mt-5 text-slate-600 leading-relaxed">{preview.item.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} {companyName}. Hak cipta dilindungi undang-undang.
            </p>
            <Link to="/" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
