'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const nav = [['/admin', 'Tableau de bord'], ['/admin/produits', 'Produits'], ['/admin/demandes', 'Demandes'], ['/admin/parametres', 'Paramètres']];
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(), router = useRouter();
  const [ok, setOk] = useState(false);
  const login = path === '/admin/login';
  useEffect(() => {
    if (login) return setOk(true);
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace('/admin/login');
      const { data } = await supabase.rpc('is_admin');
      if (!data) { await supabase.auth.signOut(); return router.replace('/admin/login?e=1'); }
      setOk(true);
    })();
  }, [login, router]);
  if (!ok) return <p className="p-10 text-center text-ink/60">Chargement…</p>;
  if (login) return <>{children}</>;
  return (
    <div className="min-h-screen bg-mist">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-sm">
          <span className="font-display font-bold text-gold">Administration</span>
          {nav.map(([h, l]) => <Link key={h} href={h} className={path === h ? 'text-gold' : 'text-white/75 hover:text-gold'}>{l}</Link>)}
          <Link href="/" target="_blank" className="ml-auto text-white/60 hover:text-gold">Voir le site</Link>
          <button onClick={async () => { await supabase.auth.signOut(); router.replace('/admin/login'); }} className="text-white/60 hover:text-gold">Déconnexion</button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
