import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Save, Upload, Layers, ToggleLeft, ToggleRight } from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../api';

interface Service { id: number; title: string; description: string; image_url: string | null; icon: string; sort_order: number; is_active: boolean; }

const ICONS = ['Truck', 'Plane', 'Globe2', 'Package', 'ShieldCheck', 'Clock', 'Award', 'Star'];

const emptyForm = { title: '', description: '', icon: 'Truck', sort_order: 0, is_active: true };

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: Service | null }>({ open: false, editing: null });
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => getServices().then(setServices);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setImageFile(null); setImagePreview(null); setErrorMsg(''); setModal({ open: true, editing: null }); };
  const openEdit = (s: Service) => { setForm({ title: s.title, description: s.description, icon: s.icon, sort_order: s.sort_order, is_active: s.is_active }); setImageFile(null); setImagePreview(s.image_url); setErrorMsg(''); setModal({ open: true, editing: s }); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'is_active' ? (v ? '1' : '0') : String(v)));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (modal.editing) { await updateService(modal.editing.id, fd); }
      else { await createService(fd); }
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
    if (!confirm('Hapus layanan ini?')) return;
    await deleteService(id);
    load();
  };

  const toggleActive = async (s: Service) => {
    const fd = new FormData();
    fd.append('is_active', !s.is_active ? '1' : '0');
    await updateService(s.id, fd);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-accent-700" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-primary-800">Layanan</h1>
            <p className="text-slate-500 text-sm">Kelola layanan pengiriman</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> Tambah Layanan
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(s => (
          <div key={s.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="h-40 bg-accent-50 overflow-hidden">
              {s.image_url
                ? <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">Tidak ada gambar</div>
              }
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-primary-800">{s.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {s.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4">{s.description}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(s)} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => toggleActive(s)} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-lg transition-colors">
                  {s.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {s.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button onClick={() => handleDelete(s.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors ml-auto">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg text-primary-800">{modal.editing ? 'Edit Layanan' : 'Tambah Layanan'}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi *</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Icon</label>
                  <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400">
                    {ICONS.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urutan</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" />
                </div>
              </div>
              {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{errorMsg}</div>}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gambar</label>
                {imagePreview && <img src={imagePreview} alt="" className="w-full h-32 object-cover rounded-xl mb-2" />}
                <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-slate-500 hover:border-accent-400 hover:text-accent-500 transition-colors w-full justify-center text-sm">
                  <Upload className="w-4 h-4" /> {imagePreview ? 'Ganti Gambar' : 'Upload Gambar'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
              </div>
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
