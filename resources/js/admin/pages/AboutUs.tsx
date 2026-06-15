import { useState, useEffect, useRef } from 'react';
import { Save, Info, Upload, X, Plus, Trash2 } from 'lucide-react';
import { getAbout, updateAbout } from '../api';

interface AboutData { title: string; description_1: string; description_2: string; image_url: string | null; highlights: string[]; vision: string; }

export default function AboutUsPage() {
  const [data, setData] = useState<Partial<AboutData>>({ highlights: [] });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newHighlight, setNewHighlight] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAbout().then((d: AboutData) => { setData({ ...d, highlights: d.highlights ?? [] }); if (d.image_url) setImagePreview(d.image_url); });
  }, []);

  const addHighlight = () => { if (!newHighlight.trim()) return; setData(d => ({ ...d, highlights: [...(d.highlights ?? []), newHighlight.trim()] })); setNewHighlight(''); };
  const removeHighlight = (i: number) => setData(d => ({ ...d, highlights: (d.highlights ?? []).filter((_, idx) => idx !== i) }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    if (data.title) fd.append('title', data.title);
    if (data.description_1) fd.append('description_1', data.description_1);
    if (data.description_2) fd.append('description_2', data.description_2 ?? '');
    if (data.vision) fd.append('vision', data.vision ?? '');
    fd.append('highlights', JSON.stringify(data.highlights ?? []));
    if (imageFile) fd.append('image', imageFile);
    try {
      const updated = await updateAbout(fd);
      setData({ ...updated, highlights: updated.highlights ?? [] });
      if (updated.image_url) setImagePreview(updated.image_url);
      setImageFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><Info className="w-5 h-5 text-green-700" /></div>
        <div><h1 className="text-2xl font-black text-slate-900">Tentang Kami</h1><p className="text-slate-500 text-sm">Profil dan visi perusahaan</p></div>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-slate-900 pb-3 border-b border-gray-100">Konten</h2>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul</label>
            <input value={data.title ?? ''} onChange={e => setData(d => ({ ...d, title: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Paragraf 1</label>
            <textarea rows={3} value={data.description_1 ?? ''} onChange={e => setData(d => ({ ...d, description_1: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Paragraf 2</label>
            <textarea rows={3} value={data.description_2 ?? ''} onChange={e => setData(d => ({ ...d, description_2: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none" /></div>
          <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Visi</label>
            <textarea rows={2} value={data.vision ?? ''} onChange={e => setData(d => ({ ...d, vision: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none" /></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-slate-900 pb-3 border-b border-gray-100">Poin Keunggulan (Bullet)</h2>
          <ul className="space-y-2">
            {(data.highlights ?? []).map((h, i) => (
              <li key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5">
                <span className="flex-1 text-sm text-slate-700">{h}</span>
                <button type="button" onClick={() => removeHighlight(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input value={newHighlight} onChange={e => setNewHighlight(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
              placeholder="Tambah poin baru..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <button type="button" onClick={addHighlight} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1"><Plus className="w-4 h-4" />Tambah</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-slate-900 pb-3 border-b border-gray-100">Foto</h2>
          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden aspect-video">
              <img src={imagePreview} alt="About" className="w-full h-full object-cover" />
              <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5"><X className="w-4 h-4" /></button>
            </div>
          )}
          <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-6 py-4 text-slate-500 hover:border-orange-400 hover:text-orange-500 transition-colors w-full justify-center text-sm">
            <Upload className="w-5 h-5" />{imagePreview ? 'Ganti Foto' : 'Upload Foto'}<span className="text-xs">(max 5MB)</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            <Save className="w-4 h-4" />{saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          {saved && <p className="text-green-600 font-medium text-sm">Berhasil disimpan!</p>}
        </div>
      </form>
    </div>
  );
}
