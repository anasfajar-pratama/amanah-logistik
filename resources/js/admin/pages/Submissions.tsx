import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Check, ChevronLeft, ChevronRight, Phone, Mail } from 'lucide-react';
import { getSubmissions, markSubmissionRead, deleteSubmission } from '../api';

interface Submission { id: number; name: string; phone: string; email: string | null; message: string; is_read: boolean; created_at: string; }

export default function SubmissionsPage() {
  const [data, setData] = useState<{ data: Submission[]; current_page: number; last_page: number; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Submission | null>(null);

  const load = (p: number) => getSubmissions(p).then(setData);
  useEffect(() => { load(page); }, [page]);

  const handleMarkRead = async (s: Submission) => {
    if (!s.is_read) { await markSubmissionRead(s.id); load(page); }
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pesan ini?')) return;
    await deleteSubmission(id);
    if (selected?.id === id) setSelected(null);
    load(page);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><MessageSquare className="w-5 h-5 text-red-700" /></div>
          <div>
            <h1 className="text-2xl font-black text-primary-800">Pesan Masuk</h1>
            <p className="text-slate-500 text-sm">{data?.total ?? 0} pesan total</p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {(data?.data ?? []).map(s => (
            <button key={s.id} onClick={() => { setSelected(s); handleMarkRead(s); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${selected?.id === s.id ? 'border-accent-400 bg-accent-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
              <div className="flex items-start justify-between mb-1">
                <span className="font-bold text-primary-800 text-sm">{s.name}</span>
                {!s.is_read && <span className="w-2 h-2 rounded-full bg-accent-500 flex-shrink-0 mt-1" />}
              </div>
              <p className="text-slate-500 text-xs line-clamp-2 mb-1">{s.message}</p>
              <p className="text-slate-400 text-xs">{formatDate(s.created_at)}</p>
            </button>
          ))}
          {(!data || data.data.length === 0) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Belum ada pesan masuk</p>
            </div>
          )}
          {data && data.last_page > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-slate-500">{page} / {data.last_page}</span>
              <button disabled={page === data.last_page} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-primary-800">{selected.name}</h2>
                  <p className="text-slate-500 text-sm">{formatDate(selected.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!selected.is_read && (
                    <button onClick={() => handleMarkRead(selected)} className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg"><Check className="w-3.5 h-3.5" />Tandai Dibaca</button>
                  )}
                  <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"><Trash2 className="w-3.5 h-3.5" />Hapus</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm text-slate-700 bg-accent-50 px-4 py-2.5 rounded-xl hover:bg-accent-100"><Phone className="w-4 h-4 text-accent-500" />{selected.phone}</a>
                {selected.email && <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-slate-700 bg-accent-50 px-4 py-2.5 rounded-xl hover:bg-accent-100"><Mail className="w-4 h-4 text-accent-500" />{selected.email}</a>}
              </div>
              <div className="bg-accent-50 rounded-xl p-5">
                <p className="text-sm font-semibold text-slate-700 mb-2">Pesan:</p>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex gap-3 mt-6">
                <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(selected.name)}%2C%20terima%20kasih%20telah%20menghubungi%20Amanah%20Trans%20Logistik.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl"
                  style={{ backgroundColor: '#25D366' }}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Balas via WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-slate-400 h-full flex flex-col items-center justify-center">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
              <p>Pilih pesan untuk melihat detailnya</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
