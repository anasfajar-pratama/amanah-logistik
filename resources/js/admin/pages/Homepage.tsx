import { useState, useEffect, useRef } from 'react';
import { Save, Home, Upload, X } from 'lucide-react';
import { getHomepage, updateHomepage } from '../api';

interface HomepageData {
  hero_badge: string; hero_title: string; hero_highlight: string;
  hero_description: string; hero_cta_primary: string; hero_cta_secondary: string;
  hero_image_url: string | null; hero_slides_url: string[];
  stat_years: number; stat_clients: number;
  stat_provinces: number; stat_ontime: number;
  services_title: string; services_description: string;
  gallery_title: string; gallery_description: string;
}

interface NewSlide { id: number; file: File; preview: string; }

export default function HomepagePage() {
  const [data, setData] = useState<Partial<HomepageData>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingSlides, setExistingSlides] = useState<(string | null)[]>([]);
  const [newSlides, setNewSlides] = useState<NewSlide[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    getHomepage().then((d: HomepageData) => {
      setData(d);
      if (d.hero_image_url) setImagePreview(d.hero_image_url);
      setExistingSlides(d.hero_slides_url ?? []);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSlidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const items: NewSlide[] = files.map(file => ({ id: nextId.current++, file, preview: URL.createObjectURL(file) }));
    setNewSlides(prev => [...prev, ...items]);
    if (sliderRef.current) sliderRef.current.value = '';
  };

  const removeExistingSlide = (index: number) => {
    setExistingSlides(prev => prev.map((u, i) => i === index ? null : u));
  };

  const removeNewSlide = (id: number) => {
    setNewSlides(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null && !k.endsWith('_url') && !['hero_image', 'hero_slides', 'id'].includes(k)) {
        fd.append(k, String(v));
      }
    });
    if (imageFile) fd.append('hero_image', imageFile);
    existingSlides.forEach((url, i) => { if (url === null) fd.append('remove_hero_slides[]', String(i)); });
    newSlides.forEach(s => fd.append('hero_slides[]', s.file));
    try {
      const updated = await updateHomepage(fd);
      setData(updated);
      if (updated.hero_image_url) setImagePreview(updated.hero_image_url);
      setExistingSlides(updated.hero_slides_url ?? []);
      setNewSlides([]);
      setImageFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof HomepageData, label: string, type: 'text' | 'textarea' | 'number' = 'text') => (
    <div key={key}>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={3} value={String(data[key] ?? '')} onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition resize-none text-sm" />
      ) : (
        <input type={type} value={String(data[key] ?? '')} onChange={e => setData(d => ({ ...d, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition text-sm" />
      )}
    </div>
  );

  const visibleSlides = existingSlides.filter((u): u is string => u !== null);
  const totalSlides = visibleSlides.length + newSlides.length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Home className="w-5 h-5 text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-primary-800">Homepage</h1>
          <p className="text-slate-500 text-sm">Kelola konten hero dan statistik</p>
        </div>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Image */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-primary-800 mb-5 pb-3 border-b border-gray-100">Gambar Hero</h2>
          <div className="space-y-4">
            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden aspect-video">
                <img src={imagePreview} alt="Hero" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); setData(d => ({ ...d, hero_image_url: null })); }}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-6 py-4 text-slate-500 hover:border-accent-400 hover:text-accent-500 transition-colors w-full justify-center">
              <Upload className="w-5 h-5" />
              {imagePreview ? 'Ganti Gambar Hero' : 'Upload Gambar Hero'}
              <span className="text-xs">(max 5MB, akan dikompres otomatis)</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        {/* Hero Slider */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-primary-800 mb-1">Gambar Slider Hero</h2>
          <p className="text-slate-500 text-sm mb-5 pb-3 border-b border-gray-100">Beberapa gambar yang berputar otomatis di hero. Jika kosong, area hero memakai gambar hero tunggal.</p>
          {(totalSlides > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {visibleSlides.map((url, i) => (
                <div key={`e-${i}`} className="relative rounded-lg overflow-hidden aspect-video group">
                  <img src={url} alt="Slide" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingSlide(i)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {newSlides.map(s => (
                <div key={s.id} className="relative rounded-lg overflow-hidden aspect-video group">
                  <img src={s.preview} alt="Slide" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewSlide(s.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => sliderRef.current?.click()}
            className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-6 py-4 text-slate-500 hover:border-accent-400 hover:text-accent-500 transition-colors w-full justify-center">
            <Upload className="w-5 h-5" />
            Tambah Gambar Slider
            <span className="text-xs">(bisa pilih beberapa sekaligus)</span>
          </button>
          <input ref={sliderRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSlidesChange} />
        </div>

        {/* Hero Content */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-primary-800 mb-5 pb-3 border-b border-gray-100">Konten Hero</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {field('hero_badge', 'Badge/Label')}
            {field('hero_title', 'Judul Utama')}
            {field('hero_highlight', 'Kata Highlight (berwarna)')}
            {field('hero_description', 'Deskripsi', 'textarea')}
            {field('hero_cta_primary', 'Tombol Utama')}
            {field('hero_cta_secondary', 'Tombol Sekunder')}
          </div>
        </div>
        {/* Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-primary-800 mb-5 pb-3 border-b border-gray-100">Statistik</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {field('stat_years', 'Tahun Pengalaman', 'number')}
            {field('stat_clients', 'Klien Puas', 'number')}
            {field('stat_provinces', 'Provinsi Terlayani', 'number')}
            {field('stat_ontime', 'Tepat Waktu (%)', 'number')}
          </div>
        </div>
        {/* Services Heading */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-primary-800 mb-5 pb-3 border-b border-gray-100">Judul Seksi Layanan</h2>
          <div className="space-y-4">
            {field('services_title', 'Judul Seksi Layanan')}
            {field('services_description', 'Deskripsi Seksi Layanan', 'textarea')}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-primary-800 mb-3">Seksi Galeri</h3>
          <div className="space-y-4">
            {field('gallery_title', 'Judul Seksi Galeri')}
            {field('gallery_description', 'Deskripsi Seksi Galeri', 'textarea')}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          {saved && <p className="text-green-600 font-medium text-sm">Berhasil disimpan!</p>}
        </div>
      </form>
    </div>
  );
}
