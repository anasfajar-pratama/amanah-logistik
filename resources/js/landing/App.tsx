import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Truck, Plane, Globe2, ShieldCheck, Clock, CheckCircle2,
  Phone, Mail, MapPin, ChevronLeft, ChevronRight, Package, X,
  Building2, Star, Award, Users, Image as ImageIcon, Video
} from 'lucide-react';
import { fetchSiteData, submitContact, SiteData } from './api';
import Galeri from './pages/Galeri';
import Navbar from './components/Navbar';

const ICON_MAP: Record<string, React.ElementType> = {
  Truck, Plane, Globe2, ShieldCheck, Clock, CheckCircle2,
  Phone, Mail, MapPin, Package, Building2, Star, Award, Users,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 1500;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <span ref={ref}>{count}</span>;
}

function HomePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [galleryPreview, setGalleryPreview] = useState<{ item: NonNullable<SiteData['galleries']>[number] } | null>(null);
  const [activeTab, setActiveTab] = useState<'contact' | 'calculator'>('contact');
  const [calcForm, setCalcForm] = useState({
    name: '', phone: '', origin: '', destination: '', service_id: '',
    weight: '', length: '', width: '', height: '', insurance: false, item_value: ''
  });

  const getYtThumb = (url: string) => {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
  };

  useEffect(() => {
    fetchSiteData().then(setData).finally(() => setLoading(false));
  }, []);

  const slides = (data?.homepage?.hero_slides_url?.length
    ? data.homepage.hero_slides_url
    : (data?.homepage?.hero_image_url ? [data.homepage.hero_image_url] : []));
  const currentIndex = slides.length ? Math.min(slideIndex, slides.length - 1) : 0;

  useEffect(() => {
    if (slides.length <= 1 || hoverPaused) return;
    const timer = setInterval(() => setSlideIndex(i => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length, hoverPaused]);

  const location = useLocation();
  useEffect(() => {
    if (loading || !location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    return () => clearTimeout(timer);
  }, [location.hash, loading]);

  const hp = data?.homepage;
  const companyName = data?.settings?.company_name ?? 'Amanah Trans Logistik';
  const whatsapp = data?.settings?.whatsapp_number ?? '6282677305134';
  const tagline = data?.settings?.tagline ?? 'Mitra Logistik Terpercaya Anda';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.phone || !form.message) {
      setFormError('Nama, nomor telepon, dan pesan wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await submitContact(form);
      setSubmitted(true);
      const lines = [
        `Halo, saya ${form.name}`,
        `No. HP: ${form.phone}`,
        form.email ? `Email: ${form.email}` : '',
        '',
        form.message,
      ];
      window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`, '_blank');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setFormError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-700">
        <div className="text-center">
          <Truck className="w-12 h-12 text-accent-500 mx-auto mb-4 animate-bounce" />
          <p className="text-white text-lg font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* NAVBAR */}
      <Navbar companyName={companyName} />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col overflow-hidden"
        onMouseEnter={() => setHoverPaused(true)} onMouseLeave={() => setHoverPaused(false)}>
        <div className="absolute inset-0 z-0">
          {slides.length > 0 ? slides.map((url, i) => (
            <div key={url + i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
              <img src={url} alt="Hero" className={`w-full h-full object-cover ${i === currentIndex ? 'hero-ken-burns' : ''}`} />
            </div>
          )) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
        </div>
        {slides.length > 1 && (
          <>
            <button onClick={() => setSlideIndex(i => (i - 1 + slides.length) % slides.length)} aria-label="Slide sebelumnya"
              className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/40 text-white bg-black/25 backdrop-blur-sm items-center justify-center hover:bg-white/25 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setSlideIndex(i => (i + 1) % slides.length)} aria-label="Slide berikutnya"
              className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/40 text-white bg-black/25 backdrop-blur-sm items-center justify-center hover:bg-white/25 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        <div className="relative z-10 w-full max-w-7xl px-0 sm:px-4 md:px-6 lg:px-8 flex-1 flex items-center pt-24 pb-10">
          <div className="max-w-2xl md:pl-3 lg:pl-[10%]">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-flex items-center gap-2 bg-accent-500/20 text-accent-400 border border-accent-500/30 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                {hp?.hero_badge ?? 'Cepat, Aman, dan Tepat Waktu'}
              </span>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                {hp?.hero_title ?? 'Mitra Logistik'}{' '}
                <span className="text-accent-400">{hp?.hero_highlight ?? 'Terpercaya'}</span>{' '}
                {!hp?.hero_title && 'Anda'}
              </h1>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                {hp?.hero_description ?? 'Kami adalah solusi pengiriman kargo darat dan udara ke seluruh Indonesia. Memastikan setiap barang Anda tiba dengan aman dan tepat waktu.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-accent-500/30 text-base">
                  {hp?.hero_cta_primary ?? 'Kirim Barang Sekarang'}
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a href="#services"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full transition-all text-base">
                  {hp?.hero_cta_secondary ?? 'Pelajari Layanan Kami'}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
        {slides.length > 1 && (
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex justify-center">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlideIndex(i)} aria-label={`Slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/80'}`} />
            ))}
          </div>
        )}

        {/* STATS SECTION IN HERO */}
        <div className="relative z-10 w-[88%] sm:w-[70%] lg:w-[68%] mx-auto pb-0">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-0 lg:divide-x lg:divide-gray-200">
              {[
                { value: hp?.stat_years ?? 10, suffix: '+', label: 'Tahun Pengalaman' },
                { value: hp?.stat_clients ?? 500, suffix: '+', label: 'Klien Puas' },
                { value: hp?.stat_provinces ?? 34, suffix: '', label: 'Provinsi Terlayani' },
                { value: hp?.stat_ontime ?? 99, suffix: '%', label: 'Pengiriman Tepat Waktu' },
              ].map((s, i) => (
                <motion.div key={i} className="text-center px-1 lg:px-6"
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <div className="text-3xl lg:text-4xl font-black text-primary-700 mb-1">
                    <AnimatedNumber value={s.value} />{s.suffix}
                  </div>
                  <div className="text-xs lg:text-sm text-slate-500 font-medium uppercase tracking-wide lg:whitespace-nowrap">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="text-accent-500 font-bold text-sm uppercase tracking-widest">Tentang Kami</span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary-800 mt-2 mb-6 leading-tight">
                {data?.about?.title ?? 'Membangun Koneksi Melalui Logistik yang Handal'}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                {data?.about?.description_1 ?? 'Didirikan oleh para profesional berpengalaman di bidang logistik, Amanah Trans Logistik hadir untuk menjawab tantangan distribusi di Indonesia.'}
              </p>
              {data?.about?.description_2 && (
                <p className="text-slate-600 leading-relaxed mb-6 text-lg">{data.about.description_2}</p>
              )}
              <ul className="space-y-3 mb-8">
                {(data?.about?.highlights ?? ['Jaringan distribusi nasional yang luas', 'Tim profesional dan berpengalaman', 'Layanan pelanggan responsif', 'Sistem pelacakan terintegrasi'])
                  .map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-accent-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
              </ul>
              <a href="#contact"
                className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Hubungi Kami <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
            <motion.div className="relative"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}>
              {data?.about?.image_url
                ? <img src={data.about.image_url} alt="Tentang Kami"
                  className="w-full rounded-2xl shadow-2xl object-cover aspect-[4/3]" />
                : <div className="w-full rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 aspect-[4/3] flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-slate-500" />
                </div>
              }
              <div className="absolute -bottom-6 -left-6 bg-accent-500 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-black">10+</div>
                <div className="text-sm font-medium opacity-90">Tahun Melayani</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-accent-500 font-bold text-sm uppercase tracking-widest">Layanan Kami</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary-800 mt-2 mb-4">
              {hp?.services_title ?? 'Layanan Utama Kami'}
            </h2>
            <p className="text-slate-500 text-lg">
              {hp?.services_description ?? 'Kami menyediakan solusi pengiriman komprehensif untuk memastikan barang Anda sampai ke tujuan dengan aman dan efisien.'}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {(data?.services?.length ? data.services : [
              { id: 1, title: 'Pengiriman Darat', description: 'Armada truk modern yang siap mengirimkan kargo Anda melalui jalur darat dengan aman.', image_url: null, icon: 'Truck' },
              { id: 2, title: 'Pengiriman Udara', description: 'Layanan kargo udara cepat untuk pengiriman mendesak ke seluruh Indonesia.', image_url: null, icon: 'Plane' },
              { id: 3, title: 'Pengiriman Nasional', description: 'Jangkauan ke 34 provinsi di seluruh Indonesia dengan tarif kompetitif.', image_url: null, icon: 'Globe2' },
            ]).map((svc, i) => {
              const Icon = ICON_MAP[svc.icon] ?? Truck;
              return (
                <motion.div key={svc.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="h-48 overflow-hidden bg-accent-50">
                    {svc.image_url
                      ? <img src={svc.image_url} alt={svc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700">
                        <Icon className="w-16 h-16 text-accent-400" />
                      </div>
                    }
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent-600" />
                    </div>
                    <h3 className="text-xl font-bold text-primary-800 mb-2">{svc.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{svc.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-accent-500 font-bold text-sm uppercase tracking-widest">Galeri</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary-800 mt-2 mb-4">
              {hp?.gallery_title ?? 'Dokumentasi Kami'}
            </h2>
            <p className="text-slate-500 text-lg">
              {hp?.gallery_description ?? 'Momen dan kegiatan terbaik PT Amanah Trans Logistik'}
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.galleries?.length ? data.galleries : []).slice(0, 6).map((g, i) => {
              const Icon = g.type === 'video' ? Video : ImageIcon;
              return (
                <motion.div key={g.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => setGalleryPreview({ item: g })}
                  className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="h-48 overflow-hidden bg-accent-50 relative group">
                    {g.type === 'photo' && g.file_url
                      ? <img src={g.file_url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : g.type === 'video' && g.video_url
                        ? <><img src={getYtThumb(g.video_url) ?? ''} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => (e.currentTarget.style.display = 'none')} />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Video className="w-7 h-7 text-primary-700 ml-1" />
                              </div>
                            </div></>
                        : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700">
                            <Video className="w-12 h-12 text-accent-400" />
                          </div>
                    }
                    <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium bg-white/90 text-slate-700">
                      {g.type === 'photo' ? 'Foto' : 'Video'}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-primary-800 mb-1 group-hover:text-accent-500 transition-colors">{g.title}</h3>
                    {g.description && <p className="text-slate-500 text-sm line-clamp-2">{g.description}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
          {(data?.galleries?.length ?? 0) > 6 && (
            <div className="text-center mt-10">
              <Link to="/galeri"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-accent-500/30">
                Lihat Selengkapnya <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* GALLERY PREVIEW POPUP */}
      {galleryPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setGalleryPreview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg text-primary-800">{galleryPreview.item.title}</h2>
              <button onClick={() => setGalleryPreview(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              {galleryPreview.item.type === 'photo' && galleryPreview.item.file_url
                ? <img src={galleryPreview.item.file_url} alt={galleryPreview.item.title} className="w-full rounded-xl object-cover max-h-[60vh]" />
                : galleryPreview.item.type === 'video' && galleryPreview.item.video_url
                  ? <div className="aspect-video rounded-xl overflow-hidden bg-black">
                      <iframe src={galleryPreview.item.video_url.replace('watch?v=', 'embed/').split('&')[0]} className="w-full h-full" allowFullScreen title={galleryPreview.item.title} />
                    </div>
                  : null
              }
              {galleryPreview.item.description && (
                <p className="mt-5 text-slate-600 leading-relaxed">{galleryPreview.item.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADVANTAGES */}
      <section id="advantages" className="py-24 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-accent-400 font-bold text-sm uppercase tracking-widest">Keunggulan Kami</span>
            <h2 className="text-3xl lg:text-4xl font-black mt-2 mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-slate-400 text-lg">Kepercayaan Anda adalah komitmen terbesar kami dalam setiap pengiriman.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(data?.advantages?.length ? data.advantages : [
              { id: 1, title: 'Amanah', description: 'Kami menjunjung tinggi nilai kepercayaan dalam setiap aspek layanan.', icon: 'ShieldCheck', color: 'orange' },
              { id: 2, title: 'Cepat', description: 'Pengiriman tepat waktu dengan armada modern dan rute optimal.', icon: 'Clock', color: 'blue' },
              { id: 3, title: 'Aman', description: 'Setiap paket ditangani dengan standar keamanan tinggi dan dilindungi.', icon: 'Award', color: 'green' },
              { id: 4, title: 'Terpercaya', description: 'Lebih dari 500 klien telah mempercayakan pengiriman mereka kepada kami.', icon: 'Star', color: 'purple' },
            ]).map((adv, i) => {
              const Icon = ICON_MAP[adv.icon] ?? ShieldCheck;
              return (
                <motion.div key={adv.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-primary-800/50 border border-primary-600 rounded-2xl p-6 hover:border-accent-500/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{adv.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{adv.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 bg-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-accent-500 font-bold text-sm uppercase tracking-widest">Hubungi Kami</span>
            <h2 className="text-3xl lg:text-4xl font-black text-primary-800 mt-2 mb-4">Siap Kirim Barang Anda?</h2>
            <p className="text-slate-500 text-lg">Tim kami siap membantu Anda menemukan solusi pengiriman terbaik.</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="space-y-6 mb-8">
                {data?.contact?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-800">Telepon</p>
                      <a href={`tel:${data.contact.phone}`} className="text-slate-600 hover:text-accent-500">
                        {data.contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                {data?.contact?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-800">Email</p>
                      <a href={`mailto:${data.contact.email}`} className="text-slate-600 hover:text-accent-500">
                        {data.contact.email}
                      </a>
                    </div>
                  </div>
                )}
                {data?.contact?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-800">Alamat</p>
                      <p className="text-slate-600">{data.contact.address}</p>
                    </div>
                  </div>
                )}
                {data?.contact?.office_hours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent-600" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-800">Jam Operasional</p>
                      <p className="text-slate-600">{data.contact.office_hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* TABS */}
                <div className="flex border-b border-gray-100">
                  <button onClick={() => setActiveTab('contact')}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                      activeTab === 'contact'
                        ? 'text-accent-500'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    Kirim Pesan
                    {activeTab === 'contact' && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-accent-500 rounded-full" />}
                  </button>
                  <button onClick={() => setActiveTab('calculator')}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                      activeTab === 'calculator'
                        ? 'text-accent-500'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}>
                    Cek Ongkir
                    {activeTab === 'calculator' && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-accent-500 rounded-full" />}
                  </button>
                </div>

                {activeTab === 'contact' ? (
                  <div className="p-8">
                    {submitted ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-primary-800 mb-2">Pesan Terkirim!</h3>
                        <p className="text-slate-500">Tim kami akan segera menghubungi Anda.</p>
                        <button onClick={() => setSubmitted(false)}
                          className="mt-4 text-accent-500 font-medium hover:underline">Kirim pesan lagi</button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap *</label>
                          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="Masukkan nama Anda" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Telepon *</label>
                          <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="08xx-xxxx-xxxx" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="email@contoh.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pesan *</label>
                          <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                            rows={4}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition resize-none"
                            placeholder="Ceritakan kebutuhan pengiriman Anda..." />
                        </div>
                        {formError && <p className="text-red-500 text-sm">{formError}</p>}
                        <button type="submit" disabled={submitting}
                          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2">
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          {submitting ? 'Mengirim...' : 'Kirim Pesan'}
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="p-8">
                    <form onSubmit={e => {
                      e.preventDefault();
                      if (!calcForm.name || !calcForm.phone || !calcForm.origin || !calcForm.destination || !calcForm.service_id || !calcForm.weight) return;
                      const service = data?.services?.find(s => String(s.id) === calcForm.service_id);
                      const lines = [
                        'Halo Amanah Trans Logistik,',
                        '',
                        'Saya ingin cek biaya pengiriman:',
                        '',
                        `Nama: ${calcForm.name}`,
                        `No. HP: ${calcForm.phone}`,
                        `Kota Asal: ${calcForm.origin}`,
                        `Kota Tujuan: ${calcForm.destination}`,
                        `Layanan: ${service?.title ?? calcForm.service_id}`,
                        `Berat: ${calcForm.weight} kg`,
                      ];
                      if (calcForm.length && calcForm.width && calcForm.height) {
                        lines.push(`Dimensi: ${calcForm.length} x ${calcForm.width} x ${calcForm.height} cm`);
                      }
                      lines.push(`Asuransi: ${calcForm.insurance ? 'Ya' : 'Tidak'}${calcForm.insurance && calcForm.item_value ? ` (nilai barang: Rp ${Number(calcForm.item_value).toLocaleString('id-ID')})` : ''}`);
                      lines.push('');
                      lines.push('Mohon info estimasi biayanya. Terima kasih.');
                      window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
                    }} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama *</label>
                          <input required value={calcForm.name} onChange={e => setCalcForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="Nama Anda" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">No. HP *</label>
                          <input required type="tel" value={calcForm.phone} onChange={e => setCalcForm(f => ({ ...f, phone: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="08xx-xxxx-xxxx" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kota Asal *</label>
                          <input required value={calcForm.origin} onChange={e => setCalcForm(f => ({ ...f, origin: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="Contoh: Jakarta" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kota Tujuan *</label>
                          <input required value={calcForm.destination} onChange={e => setCalcForm(f => ({ ...f, destination: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="Contoh: Surabaya" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Layanan *</label>
                          <select required value={calcForm.service_id} onChange={e => setCalcForm(f => ({ ...f, service_id: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition">
                            <option value="">Pilih layanan</option>
                            {(data?.services ?? []).map(s => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Berat (kg) *</label>
                          <input required type="number" min="0" step="0.1" value={calcForm.weight} onChange={e => setCalcForm(f => ({ ...f, weight: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="Contoh: 5" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dimensi (cm) — opsional</label>
                        <div className="grid grid-cols-3 gap-3">
                          <input type="number" min="0" value={calcForm.length} onChange={e => setCalcForm(f => ({ ...f, length: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="Panjang" />
                          <input type="number" min="0" value={calcForm.width} onChange={e => setCalcForm(f => ({ ...f, width: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="Lebar" />
                          <input type="number" min="0" value={calcForm.height} onChange={e => setCalcForm(f => ({ ...f, height: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                            placeholder="Tinggi" />
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="insurance" checked={calcForm.insurance}
                          onChange={e => setCalcForm(f => ({ ...f, insurance: e.target.checked }))}
                          className="mt-1 accent-accent-500" />
                        <div className="flex-1">
                          <label htmlFor="insurance" className="text-sm font-semibold text-slate-700">Asuransi</label>
                          {calcForm.insurance && (
                            <input type="number" min="0" value={calcForm.item_value} onChange={e => setCalcForm(f => ({ ...f, item_value: e.target.value }))}
                              className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                              placeholder="Nilai barang (Rp)" />
                          )}
                        </div>
                      </div>
                      <button type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Kirim ke WhatsApp
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MAPS */}
      {data?.contact?.maps_embed_url && (
        <section className="h-80 bg-accent-100">
          <iframe
            src={data.contact.maps_embed_url}
            className="w-full h-full border-0"
            allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kantor"
          />
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm mb-4">
                <img src="/logo-web.png" alt={companyName} className="h-9 w-auto brightness-[1.15]" />
                <span className="font-extrabold text-[1.345rem] md:text-[1.582rem] tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                  {companyName}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                {tagline}. Kami berkomitmen menghadirkan solusi logistik terbaik untuk kebutuhan bisnis Anda di seluruh Indonesia.
              </p>
              {data?.contact?.phone && (
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Phone className="w-4 h-4 text-accent-400" />
                  <a href={`tel:${data.contact.phone}`} className="hover:text-white transition-colors">{data.contact.phone}</a>
                </div>
              )}
              {data?.contact?.email && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail className="w-4 h-4 text-accent-400" />
                  <a href={`mailto:${data.contact.email}`} className="hover:text-white transition-colors">{data.contact.email}</a>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Layanan</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {(data?.services ?? [{ title: 'Pengiriman Darat' }, { title: 'Pengiriman Udara' }, { title: 'Pengiriman Nasional' }])
                  .map((s, i) => (
                    <li key={i}><a href="#services" className="hover:text-accent-400 transition-colors">{s.title}</a></li>
                  ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Navigasi</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {[['#about', 'Tentang Kami'], ['#services', 'Layanan'], ['/galeri', 'Galeri'], ['#advantages', 'Keunggulan'], ['#contact', 'Kontak']].map(([href, label]) => (
                  <li key={href}>
                    {href.startsWith('/')
                      ? <Link to={href} className="hover:text-accent-400 transition-colors">{label}</Link>
                      : <a href={href} className="hover:text-accent-400 transition-colors">{label}</a>
                    }
                  </li>
                ))}
              </ul>
              {data?.contact?.address && (
                <div className="mt-6">
                  <h4 className="font-bold text-white mb-2">Alamat</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{data.contact.address}</p>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-primary-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} {companyName}. Hak cipta dilindungi undang-undang.
            </p>
            <p className="text-slate-600 text-xs">Dibuat dengan sepenuh hati untuk kemajuan logistik Indonesia.</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOATING BUTTON */}
      <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo,%20saya%20ingin%20bertanya%20tentang%20layanan%20pengiriman%20Amanah%20Trans%20Logistik.`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: '#25D366' }}
        title="Chat WhatsApp">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/galeri" element={<Galeri />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
