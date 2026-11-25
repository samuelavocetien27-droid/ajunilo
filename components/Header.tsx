'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
const links = [['/', 'Accueil'], ['/ordinateurs', 'Ordinateurs'], ['/promotions', 'Promotions'], ['/contact', 'Contact']];
export default function Header({ name, logo }: { name: string; logo: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-wide">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logo && <img src={logo} alt="" className="h-9 w-9 rounded object-contain" />}
          <span className="text-gold">{name}</span>
        </Link>
        <nav className="hidden gap-7 text-sm md:flex">
          {links.map(([h, l]) => <Link key={h} href={h} className="text-white/80 transition hover:text-gold">{l}</Link>)}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-white/10 px-4 pb-3 md:hidden">
          {links.map(([h, l]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-white/90">{l}</Link>)}
        </nav>
      )}
    </header>
  );
}
