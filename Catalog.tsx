'use client';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Product } from '@/lib/types';
import { storageLabel } from '@/lib/utils';
import ProductCard from './ProductCard';

type Opt = string | number;
export default function Catalog({ products, wa, shop }: { products: Product[]; wa: string; shop: string }) {
  const [f, setF] = useState({ q: '', brand: '', cpu: '', ram: '', sto: '', cond: '', min: '', max: '', sort: '' });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const opts = (get: (p: Product) => Opt | null): Opt[] =>
    Array.from(new Set(products.map(get).filter((v): v is Opt => v !== null && v !== ''))).sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))));

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const r = products.filter((p) =>
      (!q || `${p.name} ${p.brand} ${p.model} ${p.reference}`.toLowerCase().includes(q)) &&
      (!f.brand || p.brand === f.brand) && (!f.cpu || p.processor === f.cpu) &&
      (!f.ram || p.ram_gb === Number(f.ram)) && (!f.sto || p.storage_gb === Number(f.sto)) &&
      (!f.cond || p.condition === f.cond) && (!f.min || p.price >= Number(f.min)) && (!f.max || p.price <= Number(f.max)));
    if (f.sort === 'asc') r.sort((a, b) => a.price - b.price);
    if (f.sort === 'desc') r.sort((a, b) => b.price - a.price);
    return r;
  }, [products, f]);

  const Sel = ({ k, label, items, fmt }: { k: keyof typeof f; label: string; items: Opt[]; fmt?: (v: Opt) => string }) => (
    <select value={f[k]} onChange={set(k)} className="input" aria-label={label}>
      <option value="">{label}</option>
      {items.map((v) => <option key={v} value={v}>{fmt ? fmt(v) : v}</option>)}
    </select>
  );
  return (
    <div>
      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-4">
          <Search size={16} className="absolute left-3 top-3.5 text-ink/40" />
          <input value={f.q} onChange={set('q')} placeholder="Rechercher par nom ou modèle" className="input !pl-9" />
        </div>
        <Sel k="brand" label="Toutes les marques" items={opts((p) => p.brand)} />
        <Sel k="cpu" label="Tous les processeurs" items={opts((p) => p.processor)} />
        <Sel k="ram" label="Toute la RAM" items={opts((p) => p.ram_gb)} fmt={(v) => `${v} Go`} />
        <Sel k="sto" label="Tout le stockage" items={opts((p) => p.storage_gb)} fmt={(v) => storageLabel(Number(v))} />
        <select value={f.cond} onChange={set('cond')} className="input" aria-label="État">
          <option value="">Neuf ou occasion</option><option value="neuf">Neuf</option><option value="occasion">Occasion</option>
        </select>
        <input type="number" min="0" value={f.min} onChange={set('min')} placeholder="Prix min (FCFA)" className="input" />
        <input type="number" min="0" value={f.max} onChange={set('max')} placeholder="Prix max (FCFA)" className="input" />
        <select value={f.sort} onChange={set('sort')} className="input" aria-label="Tri">
          <option value="">Trier par prix</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option>
        </select>
      </div>
      <p className="mb-4 text-sm text-ink/60">{list.length} ordinateur{list.length > 1 ? 's' : ''}</p>
      {list.length === 0 ? (
        <p className="card p-10 text-center text-ink/60">Aucun ordinateur ne correspond à votre recherche. Modifiez les filtres ou contactez-nous sur WhatsApp.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.id} p={p} wa={wa} shop={shop} />)}</div>
      )}
    </div>
  );
}
