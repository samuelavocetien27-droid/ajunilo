'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Stats = { total: number; dispo: number; vendu: number; rupture: number; inq: number; inqNew: number; views: number; top: { name: string; reference: string; views: number }[] };
export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  useEffect(() => {
    const c = (t: string, f?: (q: any) => any) => { const q = supabase.from(t).select('*', { count: 'exact', head: true }); return (f ? f(q) : q).then((r: any) => r.count ?? 0); };
    (async () => {
      const [total, dispo, vendu, rupture, inq, inqNew, views] = await Promise.all([
        c('products'), c('products', (q) => q.eq('status', 'disponible')), c('products', (q) => q.eq('status', 'vendu')),
        c('products', (q) => q.eq('status', 'rupture')), c('inquiries'), c('inquiries', (q) => q.eq('status', 'nouvelle')), c('product_views'),
      ]);
      const { data: vc } = await supabase.from('product_view_counts').select('product_id, views').order('views', { ascending: false }).limit(5);
      const ids = (vc || []).map((v: any) => v.product_id);
      const { data: ps } = ids.length ? await supabase.from('products').select('id, name, reference').in('id', ids) : { data: [] as any[] };
      const top = (vc || []).map((v: any) => { const p = (ps || []).find((x: any) => x.id === v.product_id); return { name: p?.name || '—', reference: p?.reference || '', views: v.views }; });
      setS({ total, dispo, vendu, rupture, inq, inqNew, views, top });
    })();
  }, []);
  if (!s) return <p className="text-ink/60">Chargement…</p>;
  const cards: [string, number][] = [['Ordinateurs', s.total], ['Disponibles', s.dispo], ['Vendus', s.vendu], ['En rupture', s.rupture], ['Demandes', s.inq], ['Nouvelles demandes', s.inqNew], ['Consultations', s.views]];
  return (
    <div>
      <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-bold">Tableau de bord</h1><Link href="/admin/produits/new" className="btn-gold !py-2 text-sm">Ajouter un ordinateur</Link></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{cards.map(([l, v]) => <div key={l} className="card p-4"><p className="text-3xl font-bold">{v}</p><p className="text-sm text-ink/55">{l}</p></div>)}</div>
      <h2 className="mb-3 mt-8 text-xl font-bold">Produits les plus consultés</h2>
      <div className="card divide-y divide-ink/5">
        {s.top.length === 0 && <p className="p-4 text-sm text-ink/55">Aucune consultation enregistrée pour le moment.</p>}
        {s.top.map((t) => <div key={t.reference} className="flex justify-between px-4 py-3 text-sm"><span>{t.name} <span className="text-ink/45">({t.reference})</span></span><b>{t.views}</b></div>)}
      </div>
    </div>
  );
}
