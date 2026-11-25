'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Msg, { MsgT } from '@/components/Msg';
import { supabase } from '@/lib/supabase';
import { Img as ImgT } from '@/lib/types';

type Kind = 'text' | 'number' | 'area';
const FIELDS: [string, string, Kind][] = [
  ['reference', 'Référence unique (ex. AJU-001)', 'text'], ['brand', 'Marque', 'text'], ['model', 'Modèle', 'text'], ['name', 'Nom complet (vide = marque + modèle)', 'text'],
  ['processor', 'Processeur', 'text'], ['cpu_generation', 'Génération', 'text'], ['ram_gb', 'RAM (Go)', 'number'], ['storage_type', 'Type de stockage (SSD, HDD…)', 'text'],
  ['storage_gb', 'Capacité de stockage (Go)', 'number'], ['screen_size', 'Taille de l’écran', 'text'], ['resolution', 'Résolution', 'text'], ['gpu', 'Carte graphique', 'text'],
  ['os', 'Système d’exploitation', 'text'], ['battery', 'Autonomie', 'text'], ['warranty', 'Garantie', 'text'], ['price', 'Prix actuel (FCFA)', 'number'], ['old_price', 'Ancien prix (FCFA, facultatif)', 'number'],
  ['description', 'Description commerciale', 'area'],
];
const NUM = ['ram_gb', 'storage_gb', 'price', 'old_price'];
type Form = Record<string, string | boolean>;
const EMPTY: Form = { condition: 'occasion', status: 'disponible', is_published: true, is_promo: false };

export default function ProductForm() {
  const { id } = useParams<{ id: string }>(), router = useRouter();
  const isNew = id === 'new';
  const [f, setF] = useState<Form>(EMPTY);
  const [imgs, setImgs] = useState<ImgT[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [m, setM] = useState<MsgT>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (isNew) return;
    const { data } = await supabase.from('products').select('*, product_images(id,url,path,position)').eq('id', id).maybeSingle();
    if (!data) return setM({ ok: false, t: 'Produit introuvable.' });
    const { product_images, ...rest } = data as any;
    const v: Form = {}; Object.entries(rest).forEach(([k, x]) => (v[k] = x === null ? '' : (x as any)));
    setF(v); setImgs([...(product_images || [])].sort((a: ImgT, b: ImgT) => a.position - b.position));
  }, [id, isNew]);
  useEffect(() => { load(); }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setM(null);
    const p: Record<string, any> = { condition: f.condition, status: f.status, is_published: f.is_published, is_promo: f.is_promo };
    for (const [k, , t] of FIELDS) { const v = String(f[k] ?? '').trim(); p[k] = v === '' ? null : NUM.includes(k) ? Number(v) : v; }
    p.reference = String(p.reference || '').replace(/\s+/g, '-');
    if (!p.name) p.name = `${p.brand || ''} ${p.model || ''}`.trim();
    if (p.price === null) { setBusy(false); return setM({ ok: false, t: 'Le prix est obligatoire.' }); }
    const res = isNew ? await supabase.from('products').insert(p).select('id').single() : await supabase.from('products').update(p).eq('id', id).select('id').single();
    if (res.error) {
      setBusy(false);
      return setM({ ok: false, t: res.error.code === '23505' ? 'Cette référence existe déjà. Choisissez-en une autre.' : 'Enregistrement impossible : ' + res.error.message });
    }
    const pid = (res.data as any).id as string;
    let up = 0, fail = 0, pos = imgs.length ? Math.max(...imgs.map((i) => i.position)) + 1 : 0;
    for (const file of files) {
      const path = `${pid}/${crypto.randomUUID()}.${(file.name.split('.').pop() || 'jpg').toLowerCase()}`;
      const { error } = await supabase.storage.from('products').upload(path, file, { contentType: file.type });
      if (error) { fail++; continue; }
      const url = supabase.storage.from('products').getPublicUrl(path).data.publicUrl;
      const { error: e2 } = await supabase.from('product_images').insert({ product_id: pid, url, path, position: pos++ });
      e2 ? fail++ : up++;
    }
    setBusy(false); setFiles([]);
    const t = `Produit enregistré${up ? `, ${up} photo(s) ajoutée(s)` : ''}.${fail ? ` ${fail} photo(s) n'ont pas pu être envoyées.` : ''}`;
    if (isNew) router.replace(`/admin/produits/${pid}`); else { setM({ ok: fail === 0, t }); load(); }
  }
  async function delImg(i: ImgT) {
    await supabase.storage.from('products').remove([i.path]);
    await supabase.from('product_images').delete().eq('id', i.id); load();
  }
  async function mainImg(i: ImgT) {
    const min = Math.min(...imgs.map((x) => x.position));
    await supabase.from('product_images').update({ position: min - 1 }).eq('id', i.id); load();
  }
  const set = (k: string, v: string | boolean) => setF({ ...f, [k]: v });
  return (
    <form onSubmit={save} className="max-w-3xl">
      <Link href="/admin/produits" className="text-sm text-ink/60 hover:text-gold">← Produits</Link>
      <h1 className="mb-5 mt-2 text-2xl font-bold">{isNew ? 'Ajouter un ordinateur' : 'Modifier l’ordinateur'}</h1>
      <Msg m={m} />
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        {FIELDS.map(([k, label, t]) => (
          <label key={k} className={`text-sm ${t === 'area' ? 'sm:col-span-2' : ''}`}>
            <span className="mb-1 block text-ink/65">{label}</span>
            {t === 'area' ? <textarea rows={5} className="input" value={String(f[k] ?? '')} onChange={(e) => set(k, e.target.value)} />
              : <input className="input" type={t === 'number' ? 'number' : 'text'} min={t === 'number' ? 0 : undefined} required={['reference', 'brand', 'model', 'price'].includes(k)} value={String(f[k] ?? '')} onChange={(e) => set(k, e.target.value)} />}
          </label>))}
        <label className="text-sm"><span className="mb-1 block text-ink/65">État</span>
          <select className="input" value={String(f.condition)} onChange={(e) => set('condition', e.target.value)}><option value="neuf">Neuf</option><option value="occasion">Occasion</option></select></label>
        <label className="text-sm"><span className="mb-1 block text-ink/65">Disponibilité</span>
          <select className="input" value={String(f.status)} onChange={(e) => set('status', e.target.value)}><option value="disponible">Disponible</option><option value="rupture">En rupture</option><option value="vendu">Vendu</option></select></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.is_published} onChange={(e) => set('is_published', e.target.checked)} /> Visible sur le site</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.is_promo} onChange={(e) => set('is_promo', e.target.checked)} /> En promotion</label>
      </div>
      <div className="card mt-5 p-5">
        <h2 className="mb-3 font-semibold">Photos</h2>
        {isNew && <p className="mb-3 text-sm text-ink/55">Les photos s’envoient en même temps que l’enregistrement.</p>}
        <div className="mb-3 flex flex-wrap gap-3">{imgs.map((i, k) => (
          <div key={i.id} className="w-28 text-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.url} alt="" className="h-20 w-28 rounded object-cover" />
            <div className="mt-1 flex justify-between">{k === 0 ? <b className="text-gold">Principale</b> : <button type="button" onClick={() => mainImg(i)} className="underline">Principale</button>}
              <button type="button" onClick={() => delImg(i)} className="text-red-600 underline">Retirer</button></div>
          </div>))}</div>
        <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="text-sm" />
        {files.length > 0 && <p className="mt-1 text-sm text-ink/55">{files.length} photo(s) prête(s) à envoyer.</p>}
      </div>
      <button disabled={busy} className="btn-gold mt-5 w-full sm:w-auto">{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
    </form>
  );
}
