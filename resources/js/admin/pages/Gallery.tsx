import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Save, Upload, Image, Video, ToggleLeft, ToggleRight } from 'lucide-react';
import { getGalleries, createGallery, updateGallery, deleteGallery } from '../api';

interface GalleryItem {
  id: number; title: string; description: string | null;
  type: 'photo' | 'video'; file: string | null; file_url: string | null;
  video_url: string | null; sort_order: number; is_active: boolean;
}

const emptyForm = { title: '', description: '', type: 'photo' as const, video_url: '', sort_order: 0, is_active: true };

const getYtThumb = (url: string) => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: GalleryItem | null }>({ open: false, editing: null });
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => getGalleries().then(setItems);
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm); setFile(null); setPreview(null); setErrorMsg('');
    setModal({ open: true, editing: null });
  };
  const openEdit = (g: GalleryItem) => {
    setForm({ title: g.title, description: g.description ?? '', type: g.type, video_url: g.video_url ?? '', sort_order: g.sort_order, is_active: g.is_active });
    setFile(null); setPreview(g.type === 'photo' ? g.file_url : null); setErrorMsg('');
    setModal({ open: true, editing: g });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      fd.append(k, k === 'is_active' ? (v ? '1' : '0') : String(v));
    });
    if (file) fd.append('file', file);
    try {
      if (modal.editing) { await updateGallery(modal.editing.id, fd); }
      else { await createGallery(fd); }
      setModal({ open: false, editing: null });
      load();
    } catch (err: any) {
      const data = err?.response?.data;
      const msg = data?.message ?? err?.message ?? 'Gagal menyimpan';
      const details = data?.errors ? Object.values(data.errors).flat().join(', ') : '';
      setErrorMsg(details ? msg + ': ' + details : msg);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus item galeri ini?')) return;
    await deleteGallery(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center">
            <Image className="w-5 h-5 text-accent-700" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-primary-800">Galeri</h1>
            <p className="text-slate-500 text-sm">Kelola foto dan video dokumentasi</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> Tambah Item
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(g => (
          <div key={g.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="h-44 bg-accent-50 overflow-hidden relative group">
              {g.type === 'photo' && g.file_url
                ? <img src={g.file_url} alt={g.title} className="w-full h-full object-cover" />
                : g.type === 'video' && g.video_url
                  ? <><img src={getYtThumb(g.video_url) ?? ''} alt={g.title} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Video className="w-6 h-6 text-primary-700 ml-0.5" />
                        </div>
                      </div></>
                  : <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">Tidak ada gambar</div>
              }
              <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium bg-white/90 text-slate-700">
                {g.type === 'photo' ? 'Foto' : 'Video'}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-primary-800 mb-1">{g.title}</h3>
              {g.description && <p className="text-slate-500 text-sm line-clamp-2 mb-3">{g.description}</p>}
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(g)} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(g.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors ml-auto">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">Belum ada item galeri.</div>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg text-primary-800">{modal.editing ? 'Edit Item' : 'Tambah Item'}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{errorMsg}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul *</label>
                    <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" />
                    {errorMsg && errorMsg.includes('title') && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipe *</label>
                  <select value={form.type} onChange={e => {
                    setForm(f => ({ ...f, type: e.target.value as 'photo' | 'video', video_url: '' }));
                    setFile(null); setPreview(null);
                  }} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400">
                    <option value="photo">Foto</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urutan</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" />
                </div>
              </div>
              {form.type === 'photo' ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">File Foto</label>
                  {preview && <img src={preview} alt="" className="w-full h-40 object-cover rounded-xl mb-2" />}
                  <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-slate-500 hover:border-accent-400 hover:text-accent-500 transition-colors w-full justify-center text-sm">
                    <Upload className="w-4 h-4" /> {preview ? 'Ganti Foto' : 'Upload Foto'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL Video (YouTube)</label>
                  <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl transition-colors flex-1 justify-center">
                  <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button type="button" onClick={() => setModal({ open: false, editing: null })} className="px-5 py-2.5 border border-gray-200 rounded-xl text-slate-700 hover:bg-gray-50 font-medium">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
