import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import { getSettings } from '@/lib/data';
import { waUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <Header name={s.business_name} logo={s.logo_url} />
      <main className="min-h-[70vh]">{children}</main>
      <footer className="bg-ink text-white/75">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
          <div><p className="font-display text-lg text-gold">{s.business_name}</p><p className="mt-2 text-sm">{s.about_text || 'Boutique informatique : ordinateurs portables neufs et d’occasion.'}</p></div>
          <div className="text-sm"><p className="mb-2 font-semibold text-white">Navigation</p>
            {[['/ordinateurs', 'Ordinateurs'], ['/promotions', 'Promotions'], ['/contact', 'Contact']].map(([h, l]) => <Link key={h} href={h} className="block py-1 hover:text-gold">{l}</Link>)}</div>
          <div className="space-y-1 text-sm"><p className="mb-2 font-semibold text-white">Contact</p>
            {s.phone && <p>{s.phone}</p>}{s.email && <p>{s.email}</p>}{s.address && <p>{s.address}</p>}
            {!s.phone && !s.email && !s.address && <p>Écrivez-nous sur WhatsApp.</p>}</div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} {s.business_name}</p>
      </footer>
      <a href={waUrl(s.whatsapp_number, `Bonjour ${s.business_name}, j'ai une question.`)} target="_blank" rel="noopener noreferrer" aria-label="Contacter sur WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105">
        <MessageCircle size={28} />
      </a>
    </>
  );
}
