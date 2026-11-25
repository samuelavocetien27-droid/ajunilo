'use client';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { productMessage, waUrl } from '@/lib/utils';

export default function WaButton({ number, product, shop, big, label }: { number: string; product: Product; shop: string; big?: boolean; label?: string }) {
  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(window.location.origin), []);
  const href = waUrl(number, productMessage(product, shop, `${origin}/ordinateurs/${encodeURIComponent(product.reference)}`));
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] font-semibold text-white transition hover:brightness-95 ${big ? 'w-full px-6 py-4 text-base' : 'px-3 py-2.5 text-sm'}`}>
      <MessageCircle size={big ? 22 : 18} /> {label ?? (big ? 'COMMANDER SUR WHATSAPP' : 'WhatsApp')}
    </a>
  );
}
