'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
export default function ViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    const key = `viewed:${productId}`;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch { /* ignore */ }
    supabase.from('product_views').insert({ product_id: productId }).then(() => {});
  }, [productId]);
  return null;
}
