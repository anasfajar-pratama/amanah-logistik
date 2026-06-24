import { useState, useEffect } from 'react';
import { Save, Phone } from 'lucide-react';
import { getContact, updateContact } from '../api';

interface ContactData { phone: string; email: string; address: string; maps_embed_url: string; office_hours: string; }

export default function ContactPage() {
  const [data, setData] = useState<ContactData>({ phone: '', email: '', address: '', maps_embed_url: '', office_hours: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getContact().then((d: ContactData) => setData({ phone: d.phone ?? '', email: d.email ?? '', address: d.address ?? '', maps_embed_url: d.maps_embed_url ?? '', office_hours: d.office_hours ?? '' })); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await updateContact(data); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  const field = (key: keyof ContactData, label: string, type: 'text' | 'email' | 'tel' | 'textarea' = 'text', hint?: string) => (
    <div key={key}>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={3} value={data[key]} onChange={e => setData(d => ({ ...d, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 resize-none" />
      ) : (
        <input type={type} value={data[key]} onChange={e => setData(d => ({ ...d, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" />
      )}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><Phone className="w-5 h-5 text-purple-700" /></div>
        <div><h1 className="text-2xl font-black text-primary-800">Kontak</h1><p className="text-slate-500 text-sm">Info kontak dan peta lokasi</p></div>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-primary-800 pb-3 border-b border-gray-100">Informasi Kontak</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {field('phone', 'Nomor Telepon', 'tel')}
            {field('email', 'Email', 'email')}
          </div>
          {field('address', 'Alamat Lengkap', 'textarea')}
          {field('office_hours', 'Jam Operasional', 'text')}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-primary-800 pb-3 border-b border-gray-100">Google Maps</h2>
          {field('maps_embed_url', 'URL Embed Google Maps (src dari iframe)', 'text', 'Buka Google Maps → Share → Embed → copy nilai src="..." saja')}
          {data.maps_embed_url && (
            <div className="rounded-xl overflow-hidden border border-gray-200 h-48">
              <iframe src={data.maps_embed_url} className="w-full h-full border-0" title="Preview Peta" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl">
            <Save className="w-4 h-4" />{saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          {saved && <p className="text-green-600 font-medium text-sm">Berhasil disimpan!</p>}
        </div>
      </form>
    </div>
  );
}
