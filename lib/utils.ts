import { Product } from './types';
export const fcfa = (n: number) => new Intl.NumberFormat('fr-FR').format(n).replace(/[\u202f\u00a0]/g, ' ') + ' FCFA';
export const digits = (s?: string | null) => (s || '').replace(/\D/g, '');
export const waUrl = (num: string | null | undefined, text: string) => `https://wa.me/${digits(num)}?text=${encodeURIComponent(text)}`;
export const storageLabel = (gb: number) => (gb >= 1000 ? `${gb / 1000} To` : `${gb} Go`);
export const sortedImages = (p: Product) => [...(p.product_images || [])].sort((a, b) => a.position - b.position);
export const cover = (p: Product) => sortedImages(p)[0]?.url;
export const specLine = (p: Product) =>
  [p.processor, p.ram_gb ? `${p.ram_gb} Go RAM` : null, p.storage_gb ? `${p.storage_type || ''} ${storageLabel(p.storage_gb)}`.trim() : null].filter(Boolean).join(' · ');
export const productMessage = (p: Product, shop: string, url: string) =>
  `Bonjour ${shop}.\n\nJe souhaite avoir des renseignements et éventuellement commander cet ordinateur :\n\nProduit : ${p.name}\nPrix : ${fcfa(p.price)}\nRéférence : ${p.reference}\nLien : ${url}\n\nPouvez-vous me confirmer sa disponibilité ?`;
export const STATUS_LABEL: Record<string, string> = { disponible: 'Disponible', vendu: 'Vendu', rupture: 'En rupture' };
