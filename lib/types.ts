export type Img = { id: string; url: string; path: string; position: number };
export type Product = {
  id: string; reference: string; brand: string; model: string; name: string; description: string | null;
  processor: string | null; cpu_generation: string | null; ram_gb: number | null; storage_type: string | null;
  storage_gb: number | null; screen_size: string | null; resolution: string | null; gpu: string | null; os: string | null;
  condition: 'neuf' | 'occasion'; battery: string | null; warranty: string | null; price: number; old_price: number | null;
  status: 'disponible' | 'vendu' | 'rupture'; is_published: boolean; is_promo: boolean; created_at: string;
  product_images?: Img[];
};
export type Settings = {
  business_name: string; whatsapp_number: string; logo_url: string | null; phone: string | null; email: string | null;
  address: string | null; about_text: string | null; hero_title: string | null; hero_subtitle: string | null;
  hero_image_url: string | null;};
export const DEFAULT_SETTINGS: Settings = {
  business_name: 'AJUNILO BUSINESS+', whatsapp_number: '', logo_url: null, phone: null, email: null,
  address: null, about_text: null, hero_title: null, hero_subtitle: null,
  hero_image_url: string | null,};
