import { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import { getSettings, updateSettings } from '../api';

interface Setting { id: number; key: string; value: string; label: string; type: string; group: string; }

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then((data: Setting[]) => {
      setSettings(data);
      const vals: Record<string, string> = {};
      data.forEach((s) => { vals[s.key] = s.value ?? ''; });
      setValues(vals);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(values);
      setSaved(true);
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
                  {s.type === 'textarea' ? (
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
