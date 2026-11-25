'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContactForm({ productRef }: { productRef?: string }) {
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const phone = String(d.get('phone') || '').trim(), email = String(d.get('email') || '').trim();
    if (!phone && !email) return setMsg({ ok: false, t: 'Indiquez un téléphone ou un e-mail pour que nous puissions vous répondre.' });
    setBusy(true);
    const { error } = await supabase.from('inquiries').insert({
      name: String(d.get('name')).trim(), phone: phone || null, email: email || null,
      message: String(d.get('message')).trim(), product_ref: productRef || null,
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, t: "Votre demande n'a pas pu être envoyée. Réessayez ou écrivez-nous sur WhatsApp." });
    form.reset();
    setMsg({ ok: true, t: 'Demande envoyée. Nous vous répondons dès que possible.' });
  }
  return (
    <form onSubmit={submit} className="card grid gap-3 p-5">
      <input name="name" required maxLength={120} placeholder="Votre nom" className="input" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="phone" maxLength={40} placeholder="Téléphone" className="input" />
        <input name="email" type="email" maxLength={160} placeholder="E-mail" className="input" />
      </div>
      <textarea name="message" required maxLength={2000} rows={5} className="input"
        defaultValue={productRef ? `Bonjour, je souhaite des renseignements sur l'ordinateur ${productRef}.` : ''} placeholder="Votre message" />
      <button disabled={busy} className="btn-gold">{busy ? 'Envoi…' : 'Envoyer la demande'}</button>
      {msg && <p role="status" className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{msg.t}</p>}
    </form>
  );
}
