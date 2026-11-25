import Link from 'next/link';
import { Laptop } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getProducts, getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';
export default async function Home() {
  const [s, all] = await Promise.all([getSettings(), getProducts()]);
  const row = (title: string, items: typeof all, empty?: string) => (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">{title}</h2>
      {items.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} wa={s.whatsapp_number} shop={s.business_name} />)}</div>
        : <p className="text-ink/55">{empty || 'Bientôt de nouveaux ordinateurs.'}</p>}
    </section>
  );
  const why = [
    ['Caractéristiques claires', 'Chaque fiche affiche uniquement les informations réelles de l’ordinateur.'],
    ['Commande sur WhatsApp', 'Un clic ouvre la conversation avec le produit, son prix et sa référence.'],
    ['Prix en FCFA', 'Le prix est affiché sur chaque fiche, sans surprise.'],
    ['Neuf et occasion', 'Filtrez selon l’état et le budget qui vous conviennent.'],
  ];
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        {s.hero_image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.hero_image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/10" />
          </>
        ) : <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />}
        <div className={`relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-28 ${s.hero_image_url ? '' : 'md:grid-cols-[1.3fr_1fr] md:py-24'}`}>
          <div className={s.hero_image_url ? 'max-w-xl' : ''}>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">{s.hero_title || 'L’ordinateur qu’il vous faut, au prix juste.'}</h1>
            <p className="mt-5 max-w-lg text-white/80">{s.hero_subtitle || 'Ordinateurs portables sélectionnés, caractéristiques détaillées, commande directe sur WhatsApp.'}</p>
            <Link href="/ordinateurs" className="btn-gold mt-8">Découvrir nos ordinateurs</Link>
          </div>
          {!s.hero_image_url && <div className="hidden justify-center md:flex"><div className="rounded-3xl border border-gold/30 p-14 text-gold"><Laptop size={150} strokeWidth={0.8} /></div></div>}
        </div>
      </section>
      {row('Nos meilleures offres', all.filter((p) => p.is_promo).slice(0, 4), 'Les promotions apparaîtront ici.')}
      <div className="bg-mist">{row('Nouveautés', all.slice(0, 4))}</div>
      {row('Nos ordinateurs disponibles', all.filter((p) => p.status === 'disponible').slice(0, 8))}
      <div className="text-center"><Link href="/ordinateurs" className="btn-dark mb-12">Voir tout le catalogue</Link></div>
      <section className="bg-ink py-14 text-white"><div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Pourquoi choisir {s.business_name}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(([t, d]) => <div key={t} className="border-l-2 border-gold pl-4"><h3 className="font-semibold text-gold">{t}</h3><p className="mt-1 text-sm text-white/70">{d}</p></div>)}
        </div></div></section>
    </>
  );
}
