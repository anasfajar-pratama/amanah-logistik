import { useState, useEffect, useRef } from 'react';
import { Save, Settings, Upload, X } from 'lucide-react';
import { getSettings, updateSettings } from '../api';

interface Setting { id: number; key: string; value: string; label: string; type: string; group: string; url?: string | null; }

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconRemoved, setFaviconRemoved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSettings().then((data: Setting[]) => {
      setSettings(data);
      const vals: Record<string, string> = {};
      data.forEach((s) => {
        if (s.type === 'image') {
          if (s.url) setFaviconPreview(s.url);
        } else {
          vals[s.key] = s.value ?? '';
        }
      });
      setValues(vals);
    });
  }, []);

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconFile(file);
    setFaviconRemoved(false);
    setFaviconPreview(URL.createObjectURL(file));
  };

  const removeFavicon = () => {
    setFaviconFile(null);
    setFaviconRemoved(true);
    setFaviconPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(`settings[${k}]`, v));
      if (faviconFile) fd.append('favicon', faviconFile);
      if (faviconRemoved && !faviconFile) fd.append('remove_favicon', '1');
      const res = await updateSettings(fd);
      setSaved(true);
      if (res.favicon_url) setFaviconPreview(res.favicon_url);
      setFaviconFile(null);
      setFaviconRemoved(false);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const grouped = settings.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {} as Record<string, Setting[]>);

  const groupLabels: Record<string, string> = {
    general: 'Informasi Umum',
    social: 'Media Sosial & WhatsApp',
    seo: 'SEO & Meta',
    branding: 'Favicon & Judul',
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-slate-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-primary-800">Pengaturan</h1>
          <p className="text-slate-500 text-sm">Konfigurasi umum website</p>
        </div>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-primary-800 mb-5 pb-3 border-b border-gray-100">
              {groupLabels[group] ?? group}
            </h2>
            <div className="space-y-4">
              {items.map((s) => (
                <div key={s.key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{s.label}</label>
                  {s.type === 'image' ? (
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {faviconPreview
                          ? <img src={faviconPreview} alt="Favicon" className="w-full h-full object-contain" />
                          : <span className="text-slate-400 text-xs text-center px-2">Belum ada</span>}
                      </div>
                      <div className="space-y-2">
                        <button type="button"
                          onClick={() => fileRef.current?.click()}
                          className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                          <Upload className="w-4 h-4" />
                          Pilih Gambar
                        </button>
                        {faviconPreview && (
                          <button type="button" onClick={removeFavicon}
                            className="flex items-center gap-1 text-red-500 text-sm font-medium hover:underline">
                            <X className="w-4 h-4" /> Hapus
                          </button>
                        )}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFaviconChange} />
                        <p className="text-xs text-slate-400">Disarankan PNG/ICO format persegi (min. 32x32).</p>
                      </div>
                    </div>
                  ) : s.type === 'textarea' ? (
                    <textarea rows={3} value={values[s.key] ?? ''} onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition resize-none text-sm" />
                  ) : (
                    <input type="text" value={values[s.key] ?? ''} onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition text-sm" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
          {saved && <p className="text-green-600 font-medium text-sm">Pengaturan berhasil disimpan!</p>}
        </div>
      </form>
    </div>
  );
}
