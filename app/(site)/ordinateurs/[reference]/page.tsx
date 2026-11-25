import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import ShareButton from '@/components/ShareButton';
import ViewTracker from '@/components/ViewTracker';
import WaButton from '@/components/WaButton';
import { getSettings } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { cover, fcfa, sortedImages, STATUS_LABEL, storageLabel } from '@/lib/utils';

export const dynamic = 'force-dynamic';
async function load(ref: string) {
  const { data } = await supabase.from('products').select('*, product_images(id,url,path,position)')
    .eq('reference', decodeURIComponent(ref)).eq('is_published', true).maybeSingle();
  return data as Product | null;
}
export async function generateMetadata({ params }: { params: { reference: string } }): Promise<Metadata> {
  const p = await load(params.reference);
  if (!p) return { title: 'Ordinateur introuvable' };
  return { title: p.name, description: p.description?.slice(0, 160) || `${p.name} — ${fcfa(p.price)}`, openGraph: { title: p.name, images: cover(p) ? [cover(p) as string] : [] } };
}
export default async function Page({ params }: { params: { reference: string } }) {
  const [p, s] = await Promise.all([load(params.reference), getSettings()]);
  if (!p) notFound();
  const rows: [string, string | null | undefined][] = [
    ['Marque', p.brand], ['Modèle', p.model],
    ['Processeur', [p.processor, p.cpu_generation].filter(Boolean).join(' — ')],
    ['Mémoire RAM', p.ram_gb ? `${p.ram_gb} Go` : null],
    ['Stockage', p.storage_gb ? `${p.storage_type || ''} ${storageLabel(p.storage_gb)}`.trim() : null],
    ['Taille de l’écran', p.screen_size], ['Résolution', p.resolution], ['Carte graphique', p.gpu], ['Système d’exploitation', p.os],
    ['État', p.condition === 'neuf' ? 'Neuf' : 'Occasion'], ['Autonomie', p.battery], ['Garantie', p.warranty],
    ['Disponibilité', STATUS_LABEL[p.status]], ['Référence', p.reference],
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <ViewTracker productId={p.id} />
      <Link href="/ordinateurs" className="text-sm text-ink/60 hover:text-gold">← Tous les ordinateurs</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <Gallery images={sortedImages(p)} alt={p.name} />
        <div>
          <p className="text-sm text-ink/55">{p.brand}</p>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{fcfa(p.price)}</span>
            {p.old_price ? <span className="text-ink/45 line-through">{fcfa(p.old_price)}</span> : null}
          </div>
          <p className={`mt-2 inline-block rounded-full px-3 py-1 text-sm ${p.status === 'disponible' ? 'bg-green-50 text-green-700' : 'bg-ink text-white'}`}>{STATUS_LABEL[p.status]}</p>
          {p.description && <p className="mt-5 whitespace-pre-line text-ink/75">{p.description}</p>}
          <div className="mt-6 space-y-3">
            <WaButton number={s.whatsapp_number} product={p} shop={s.business_name} big />
            <Link href={`/contact?ref=${encodeURIComponent(p.reference)}`} className="btn-line w-full">Demander des renseignements</Link>
            <ShareButton title={p.name} />
          </div>
        </div>
      </div>
      <h2 className="mb-3 mt-12 text-2xl font-bold">Caractéristiques</h2>
      <dl className="card divide-y divide-ink/5">
        {rows.filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="grid grid-cols-2 gap-4 px-5 py-3 text-sm"><dt className="text-ink/55">{k}</dt><dd className="font-medium">{v}</dd></div>
        ))}
      </dl>
    </div>
  );
}
