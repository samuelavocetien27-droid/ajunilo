import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { getSettings } from '@/lib/data';

const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    metadataBase: site ? new URL(site) : undefined,
    title: { default: `${s.business_name} — Ordinateurs portables`, template: `%s | ${s.business_name}` },
    description: s.about_text || `${s.business_name} : boutique informatique. Découvrez nos ordinateurs et commandez sur WhatsApp.`,
    openGraph: { title: s.business_name, type: 'website', locale: 'fr_FR' },
  };
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
