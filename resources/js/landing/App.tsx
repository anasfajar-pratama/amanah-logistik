import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Truck, Plane, Globe2, ShieldCheck, Clock, CheckCircle2,
  Phone, Mail, MapPin, Menu, X, ChevronRight, Package,
  Building2, Star, Award, Users
} from 'lucide-react';
import { fetchSiteData, submitContact, SiteData } from './api';

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

export default function App() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchSiteData().then(setData).finally(() => setLoading(false));
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch {
      setFormError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <Truck className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-bounce" />
          <p className="text-white text-lg font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className={`font-bold text-lg tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                {companyName}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {[['#about', 'Tentang Kami'], ['#services', 'Layanan'], ['#advantages', 'Keunggulan'], ['#contact', 'Kontak']].map(([href, label]) => (
                <a key={href} href={href}
                  className={`text-sm font-medium transition-colors hover:text-orange-500 ${scrolled ? 'text-slate-700' : 'text-white/90'}`}>
                  {label}
                </a>
              ))}
              <a href="#contact"
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                Minta Penawaran
              </a>
            </div>
            <button className="md:hidden p-2" onClick={() => setNavOpen(!navOpen)}>
              {navOpen
                ? <X className={`w-6 h-6 ${scrolled ? 'text-slate-900' : 'text-white'}`} />
                : <Menu className={`w-6 h-6 ${scrolled ? 'text-slate-900' : 'text-white'}`} />
              }
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
            {[['#about', 'Tentang Kami'], ['#services', 'Layanan'], ['#advantages', 'Keunggulan'], ['#contact', 'Kontak']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setNavOpen(false)}
                className="block text-slate-700 font-medium py-2 hover:text-orange-500">{label}</a>
            ))}
            <a href="#contact" onClick={() => setNavOpen(false)}
              className="block bg-orange-500 text-white text-center font-semibold py-2.5 rounded-full">
              Minta Penawaran
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {hp?.hero_image_url
            ? <img src={hp.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          }
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/75 to-slate-900/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                {hp?.hero_badge ?? 'Cepat, Aman, dan Tepat Waktu'}
              </span>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6">
                {hp?.hero_title ?? 'Mitra Logistik'}{' '}
                <span className="text-orange-400">{hp?.hero_highlight ?? 'Terpercaya'}</span>{' '}
                {!hp?.hero_title && 'Anda'}
              </h1>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl">
                {hp?.hero_description ?? 'Kami adalah solusi pengiriman kargo darat dan udara ke seluruh Indonesia. Memastikan setiap barang Anda tiba dengan aman dan tepat waktu.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:shadow-orange-500/30 text-base">
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: hp?.stat_years ?? 10, suffix: '+', label: 'Tahun Pengalaman' },
              { value: hp?.stat_clients ?? 500, suffix: '+', label: 'Klien Puas' },
              { value: hp?.stat_provinces ?? 34, suffix: '', label: 'Provinsi Terlayani' },
              { value: hp?.stat_ontime ?? 99, suffix: '%', label: 'Pengiriman Tepat Waktu' },
            ].map((s, i) => (
              <motion.div key={i} className="text-center"
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <div className="text-4xl md:text-5xl font-black text-orange-400 mb-2">
                  <AnimatedNumber value={s.value} />{s.suffix}
                </div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Tentang Kami</span>
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mt-2 mb-6 leading-tight">
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
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
              </ul>
              <a href="#contact"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Hubungi Kami <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
            <motion.div className="relative"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}>
              {data?.about?.image_url
                ? <img src={data.about.image_url} alt="Tentang Kami"
                  className="w-full rounded-2xl shadow-2xl object-cover aspect-[4/3]" />
                : <div className="w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 aspect-[4/3] flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-slate-500" />
                </div>
              }
              <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white rounded-2xl p-6 shadow-xl">
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
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Layanan Kami</span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mt-2 mb-4">
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
                  <div className="h-48 overflow-hidden bg-slate-100">
                    {svc.image_url
                      ? <img src={svc.image_url} alt={svc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-700">
                        <Icon className="w-16 h-16 text-orange-400" />
                      </div>
                    }
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{svc.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{svc.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-orange-400 font-bold text-sm uppercase tracking-widest">Keunggulan Kami</span>
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
                  className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-400" />
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
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-2xl mx-auto mb-16"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-orange-500 font-bold text-sm uppercase tracking-widest">Hubungi Kami</span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mt-2 mb-4">Siap Kirim Barang Anda?</h2>
            <p className="text-slate-500 text-lg">Tim kami siap membantu Anda menemukan solusi pengiriman terbaik.</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="space-y-6 mb-8">
                {data?.contact?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Telepon</p>
                      <a href={`tel:${data.contact.phone}`} className="text-slate-600 hover:text-orange-500">
                        {data.contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                {data?.contact?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Email</p>
                      <a href={`mailto:${data.contact.email}`} className="text-slate-600 hover:text-orange-500">
                        {data.contact.email}
                      </a>
                    </div>
                  </div>
                )}
                {data?.contact?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Alamat</p>
                      <p className="text-slate-600">{data.contact.address}</p>
                    </div>
                  </div>
                )}
                {data?.contact?.office_hours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Jam Operasional</p>
                      <p className="text-slate-600">{data.contact.office_hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Pesan Terkirim!</h3>
                    <p className="text-slate-500">Tim kami akan segera menghubungi Anda.</p>
                    <button onClick={() => setSubmitted(false)}
                      className="mt-4 text-orange-500 font-medium hover:underline">Kirim pesan lagi</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap *</label>
                      <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        placeholder="Masukkan nama Anda" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Telepon *</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        placeholder="08xx-xxxx-xxxx" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        placeholder="email@contoh.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pesan *</label>
                      <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        rows={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
                        placeholder="Ceritakan kebutuhan pengiriman Anda..." />
                    </div>
                    {formError && <p className="text-red-500 text-sm">{formError}</p>}
                    <button type="submit" disabled={submitting}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors text-base">
                      {submitting ? 'Mengirim...' : 'Kirim Pesan'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MAPS */}
      {data?.contact?.maps_embed_url && (
        <section className="h-80 bg-gray-200">
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
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl">{companyName}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                {tagline}. Kami berkomitmen menghadirkan solusi logistik terbaik untuk kebutuhan bisnis Anda di seluruh Indonesia.
              </p>
              {data?.contact?.phone && (
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                  <Phone className="w-4 h-4 text-orange-400" />
                  <a href={`tel:${data.contact.phone}`} className="hover:text-white transition-colors">{data.contact.phone}</a>
                </div>
              )}
              {data?.contact?.email && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <a href={`mailto:${data.contact.email}`} className="hover:text-white transition-colors">{data.contact.email}</a>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Layanan</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {(data?.services ?? [{ title: 'Pengiriman Darat' }, { title: 'Pengiriman Udara' }, { title: 'Pengiriman Nasional' }])
                  .map((s, i) => (
                    <li key={i}><a href="#services" className="hover:text-orange-400 transition-colors">{s.title}</a></li>
                  ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Navigasi</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {[['#about', 'Tentang Kami'], ['#services', 'Layanan'], ['#advantages', 'Keunggulan'], ['#contact', 'Kontak']].map(([href, label]) => (
                  <li key={href}><a href={href} className="hover:text-orange-400 transition-colors">{label}</a></li>
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
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
