'use client';
import { useEffect, useState } from 'react';
import Msg, { MsgT } from '@/components/Msg';
import { supabase } from '@/lib/supabase';

const F: [string, string, boolean?][] = [
  ['business_name', 'Nom commercial'], ['whatsapp_number', 'Numéro WhatsApp (format international, ex. 229XXXXXXXX)'], ['phone', 'Téléphone'], ['email', 'E-mail'], ['address', 'Adresse'],
  ['hero_title', 'Titre de la page d’accueil'], ['hero_subtitle', 'Sous-titre de la page d’accueil'], ['about_text', 'Texte de présentation', true],
];
export default function Settings() {
  const [f, setF] = useState<Record<string, string>>({});
  const [logo, setLogo] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [m, setM] = useState<MsgT>(null);
  useEffect(() => { supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
    const v: Record<string, string> = {}; Object.entries(data || {}).forEach(([k, x]) => (v[k] = (x as string) ?? '')); setF(v); setLogo(v.logo_url || ''); }); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    let logo_url = logo || null;
    if (file) {
      const path = `site/logo-${Date.now()}.${(file.name.split('.').pop() || 'png').toLowerCase()}`;
      const up = await supabase.storage.from('products').upload(path, file, { contentType: file.type });
      if (up.error) return setM({ ok: false, t: 'Le logo n’a pas pu être envoyé : ' + up.error.message });
      logo_url = supabase.storage.from('products').getPublicUrl(path).data.publicUrl;
    }
    const row: Record<string, any> = { id: 1, logo_url, hero_image_url: f.hero_image_url || null };
    F.forEach(([k]) => (row[k] = (f[k] || '').trim() || null));
    row.business_name = row.business_name || 'AJUNILO BUSINESS+';
    row.whatsapp_number = String(row.whatsapp_number || '').replace(/\D/g, '');
    const { error } = await supabase.from('site_settings').upsert(row);
    if (error) return setM({ ok: false, t: 'Enregistrement impossible : ' + error.message });
    setLogo(logo_url || ''); setFile(null); setF({ ...f, whatsapp_number: row.whatsapp_number }); setM({ ok: true, t: 'Paramètres enregistrés.' });
  }
  return (
    <form onSubmit={save} className="max-w-2xl">
      <h1 className="mb-5 text-2xl font-bold">Paramètres</h1><Msg m={m} />
      <div className="card grid gap-4 p-5">
        {F.map(([k, label, area]) => (
          <label key={k} className="text-sm"><span className="mb-1 block text-ink/65">{label}</span>
            {area ? <textarea rows={4} className="input" value={f[k] || ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
              : <input className="input" value={f[k] || ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} />}</label>))}
        <div className="text-sm"><span className="mb-1 block text-ink/65">Image de la page d’accueil (photo en paysage)</span>
  {/* eslint-disable-next-line @next/next/no-img-element */}
  {f.hero_image_url && <img src={f.hero_image_url} alt="" className="mb-2 h-28 rounded object-cover" />}
  <input type="file" accept="image/*" onChange={async (e) => {
    const img = e.target.files?.[0]; if (!img) return;
    const path = `site/hero-${Date.now()}.${(img.name.split('.').pop() || 'jpg').toLowerCase()}`;
    const up = await supabase.storage.from('products').upload(path, img, { contentType: img.type });
    if (up.error) return setM({ ok: false, t: 'Image non envoyée : ' + up.error.message });
    setF({ ...f, hero_image_url: supabase.storage.from('products').getPublicUrl(path).data.publicUrl });
    setM({ ok: true, t: 'Image prête : clique sur Enregistrer.' });
  }} />
</div><div className="text-sm"><span className="mb-1 block text-ink/65">Logo</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logo && <img src={logo} alt="" className="mb-2 h-14 rounded" />}
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
        <button className="btn-gold">Enregistrer</button>
      </div>
    </form>
  );
}
