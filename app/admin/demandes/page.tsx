'use client';
import { useCallback, useEffect, useState } from 'react';
import Msg, { MsgT } from '@/components/Msg';
import { supabase } from '@/lib/supabase';

type Inq = { id: string; name: string; phone: string | null; email: string | null; message: string; product_ref: string | null; status: string; created_at: string };
const LABEL: Record<string, string> = { nouvelle: 'Nouvelle demande', en_cours: 'En cours', traitee: 'Traitée' };
export default function Inquiries() {
  const [list, setList] = useState<Inq[] | null>(null);
  const [m, setM] = useState<MsgT>(null);
  const load = useCallback(async () => { const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }); setList((data as Inq[]) || []); }, []);
  useEffect(() => { load(); }, [load]);
  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    setM(error ? { ok: false, t: error.message } : { ok: true, t: 'Statut mis à jour.' }); load();
  }
  async function del(id: string) { if (confirm('Supprimer cette demande ?')) { await supabase.from('inquiries').delete().eq('id', id); load(); } }
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Demandes</h1><Msg m={m} />
      {!list ? <p className="text-ink/60">Chargement…</p> : list.length === 0 ? <p className="card p-8 text-center text-ink/60">Aucune demande reçue.</p> : (
        <div className="space-y-3">{list.map((q) => (
          <div key={q.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{q.name} <span className="text-sm font-normal text-ink/50">{new Date(q.created_at).toLocaleString('fr-FR')}</span></p>
              <select value={q.status} onChange={(e) => setStatus(q.id, e.target.value)} className="input !w-auto">{Object.entries(LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            </div>
            <p className="mt-1 text-sm text-ink/65">{[q.phone, q.email, q.product_ref && `Réf. ${q.product_ref}`].filter(Boolean).join(' · ')}</p>
            <p className="mt-2 whitespace-pre-line text-sm">{q.message}</p>
            <button onClick={() => del(q.id)} className="mt-2 text-xs text-red-600 underline">Supprimer</button>
          </div>))}</div>)}
    </div>
  );
}
