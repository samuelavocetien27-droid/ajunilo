'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Msg, { MsgT } from '@/components/Msg';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { fcfa, STATUS_LABEL } from '@/lib/utils';

export default function Products() {
  const [list, setList] = useState<Product[] | null>(null);
  const [m, setM] = useState<MsgT>(null);
  const load = useCallback(async () => {
    const { data } = await supabase.from('products').select('*, product_images(id,url,path,position)').order('created_at', { ascending: false });
    setList((data as Product[]) || []);
  }, []);
  useEffect(() => { load(); }, [load]);
  async function patch(p: Product, v: Partial<Product>, ok: string) {
    const { error } = await supabase.from('products').update(v).eq('id', p.id);
    setM(error ? { ok: false, t: 'Modification impossible : ' + error.message } : { ok: true, t: ok }); load();
  }
  async function remove(p: Product) {
    if (!confirm(`Supprimer définitivement « ${p.name} » et ses photos ?`)) return;
    const paths = (p.product_images || []).map((i) => i.path);
    if (paths.length) await supabase.storage.from('products').remove(paths);
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    setM(error ? { ok: false, t: 'Suppression impossible : ' + error.message } : { ok: true, t: 'Produit supprimé.' }); load();
  }
  return (
    <div>
      <div className="mb-5 flex items-center justify-between"><h1 className="text-2xl font-bold">Produits</h1><Link href="/admin/produits/new" className="btn-gold !py-2 text-sm">Ajouter un ordinateur</Link></div>
      <Msg m={m} />
      {!list ? <p className="text-ink/60">Chargement…</p> : list.length === 0 ? <p className="card p-8 text-center text-ink/60">Aucun ordinateur. Ajoutez le premier.</p> : (
        <div className="space-y-3">{list.map((p) => (
          <div key={p.id} className="card flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-[200px] flex-1">
              <p className="font-semibold">{p.name} <span className="text-sm font-normal text-ink/45">{p.reference}</span></p>
              <p className="text-sm text-ink/60">{fcfa(p.price)} · {STATUS_LABEL[p.status]} · {p.is_published ? 'Visible' : 'Masqué'}{p.is_promo ? ' · Promo' : ''}</p>
            </div>
            <Link href={`/admin/produits/${p.id}`} className="btn-line">Modifier</Link>
            <button className="btn-line" onClick={() => patch(p, { is_published: !p.is_published }, p.is_published ? 'Produit masqué.' : 'Produit visible.')}>{p.is_published ? 'Masquer' : 'Afficher'}</button>
            <button className="btn-line" onClick={() => patch(p, p.status === 'vendu' ? { status: 'disponible' } : { status: 'vendu' }, 'Disponibilité mise à jour.')}>{p.status === 'vendu' ? 'Remettre en vente' : 'Marquer vendu'}</button>
            <button className="btn-line !border-red-200 text-red-600" onClick={() => remove(p)}>Supprimer</button>
          </div>))}</div>)}
    </div>
  );
}
