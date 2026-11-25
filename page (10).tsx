import type { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { getSettings } from '@/lib/data';
import { waUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Contact' };
export default async function Page({ searchParams }: { searchParams: { ref?: string } }) {
  const s = await getSettings();
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
      <div>
        <h1 className="mb-4 text-3xl font-bold">Contact</h1>
        <div className="space-y-2 text-ink/75">
          {s.whatsapp_number && <p>WhatsApp : +{s.whatsapp_number.replace(/\D/g, '')}</p>}
          {s.phone && <p>Téléphone : {s.phone}</p>}{s.email && <p>E-mail : {s.email}</p>}{s.address && <p>Adresse : {s.address}</p>}
        </div>
        <a href={waUrl(s.whatsapp_number, `Bonjour ${s.business_name}, j'ai une question.`)} target="_blank" rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white"><MessageCircle size={20} /> Écrire sur WhatsApp</a>
      </div>
      <ContactForm productRef={searchParams.ref} />
    </div>
  );
}
