import type { Metadata } from 'next';
import Catalog from '@/components/Catalog';
import { getProducts, getSettings } from '@/lib/data';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Promotions' };
export default async function Page() {
  const [s, products] = await Promise.all([getSettings(), getProducts()]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Promotions</h1>
      <Catalog products={products.filter((p) => p.is_promo)} wa={s.whatsapp_number} shop={s.business_name} />
    </div>
  );
}
