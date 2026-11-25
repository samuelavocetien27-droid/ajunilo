import Link from 'next/link';
import { Product } from '@/lib/types';
import { cover, fcfa, specLine, STATUS_LABEL } from '@/lib/utils';
import Img from './Img';
import WaButton from './WaButton';

export default function ProductCard({ p, wa, shop }: { p: Product; wa: string; shop: string }) {
  const ok = p.status === 'disponible';
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/ordinateurs/${encodeURIComponent(p.reference)}`} className="relative block aspect-[4/3] overflow-hidden bg-mist">
        <Img src={cover(p)} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${ok ? 'bg-white text-green-700' : 'bg-ink text-white'}`}>{STATUS_LABEL[p.status]}</span>
        <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs text-white">{p.condition === 'neuf' ? 'Neuf' : 'Occasion'}</span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-ink/55">{p.brand}</p>
        <h3 className="text-lg font-semibold leading-snug">{p.model}</h3>
        <p className="text-sm text-ink/65">{specLine(p)}</p>
        <div className="mt-auto pt-2">
          <p className="text-xl font-bold">{fcfa(p.price)}</p>
          {p.old_price ? <p className="text-sm text-ink/45 line-through">{fcfa(p.old_price)}</p> : null}
        </div>
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <Link href={`/ordinateurs/${encodeURIComponent(p.reference)}`} className="btn-dark !py-2.5 text-sm">Voir les détails</Link>
          <WaButton number={wa} product={p} shop={shop} />
        </div>
      </div>
    </article>
  );
}
