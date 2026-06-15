import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react';
import { getAdvantages, createAdvantage, updateAdvantage, deleteAdvantage } from '../api';

interface Advantage { id: number; title: string; description: string; icon: string; color: string; sort_order: number; is_active: boolean; }

const ICONS = ['ShieldCheck', 'Clock', 'Award', 'Star', 'Truck', 'Globe2', 'Users', 'CheckCircle2'];
const COLORS = ['orange', 'blue', 'green', 'purple', 'red', 'yellow'];

const emptyForm = { title: '', description: '', icon: 'ShieldCheck', color: 'orange', sort_order: 0, is_active: true };

export default function AdvantagesPage() {
  const [items, setItems] = useState<Advantage[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: Advantage | null }>({ open: false, editing: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => getAdvantages().then(setItems);
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setModal({ open: true, editing: null }); };
  const openEdit = (a: Advantage) => { setForm({ title: a.title, description: a.description, icon: a.icon, color: a.color, sort_order: a.sort_order, is_active: a.is_active }); setModal({ open: true, editing: a }); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.editing) { await updateAdvantage(modal.editing.id, form); }
      else { await createAdvantage(form); }
      setModal({ open: false, editing: null });
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus keunggulan ini?')) return;
    await deleteAdvantage(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center"><Star className="w-5 h-5 text-yellow-700" /></div>
          <div><h1 className="text-2xl font-black text-slate-900">Keunggulan</h1><p className="text-slate-500 text-sm">Nilai dan keunggulan perusahaan</p></div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm"><Plus className="w-4 h-4" />Tambah</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(a => (
          <div key={a.id} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-orange-500" />
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{a.is_active ? 'Aktif' : 'Nonaktif'}</span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{a.title}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{a.description}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(a)} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"><Pencil className="w-3.5 h-3.5" />Edit</button>
              <button onClick={() => handleDelete(a.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg ml-auto"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg text-slate-900">{modal.editing ? 'Edit Keunggulan' : 'Tambah Keunggulan'}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi *</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Icon</label>
                  <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {ICONS.map(i => <option key={i}>{i}</option>)}</select></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Warna</label>
                  <select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {COLORS.map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-700">Status Aktif</label>
                <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? 'bg-orange-500' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl flex-1 justify-center"><Save className="w-4 h-4" />{saving ? 'Menyimpan...' : 'Simpan'}</button>
                <button type="button" onClick={() => setModal({ open: false, editing: null })} className="px-5 py-2.5 border border-gray-200 rounded-xl text-slate-700 hover:bg-gray-50 font-medium">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
