import { useState, useEffect, useRef } from 'react';
import { Save, Home, Upload, X } from 'lucide-react';
import { getHomepage, updateHomepage } from '../api';

interface HomepageData {
  hero_badge: string; hero_title: string; hero_highlight: string;
  hero_description: string; hero_cta_primary: string; hero_cta_secondary: string;
  hero_image_url: string | null; stat_years: number; stat_clients: number;
  stat_provinces: number; stat_ontime: number;
  services_title: string; services_description: string;
  gallery_title: string; gallery_description: string;
}

export default function HomepagePage() {
  const [data, setData] = useState<Partial<HomepageData>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getHomepage().then((d: HomepageData) => {
      setData(d);
      if (d.hero_image_url) setImagePreview(d.hero_image_url);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null && !k.endsWith('_url')) fd.append(k, String(v)); });
    if (imageFile) fd.append('hero_image', imageFile);
    try {
      const updated = await updateHomepage(fd);
      setData(updated);
      if (updated.hero_image_url) setImagePreview(updated.hero_image_url);
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
