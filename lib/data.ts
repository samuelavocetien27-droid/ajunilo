import { supabase } from './supabase';
import { DEFAULT_SETTINGS, Product, Settings } from './types';

export async function getSettings(): Promise<Settings> {
  try {
   const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
    return { ...DEFAULT_SETTINGS, ...(data || {}) };
  } catch { return DEFAULT_SETTINGS; }
}
export async function getProducts(): Promise<Product[]> {
  try {
   const { data } = await supabase.from('products').select('*, product_images(*)')
      .eq('is_published', true).order('created_at', { ascending: false });
    return (data as Product[]) || [];
  } catch { return []; }
}
