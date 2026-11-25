'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Msg, { MsgT } from '@/components/Msg';

export default function Login() {
  const router = useRouter();
  const [m, setM] = useState<MsgT>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    const d = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({ email: String(d.get('email')), password: String(d.get('password')) });
    if (error) { setBusy(false); return setM({ ok: false, t: 'E-mail ou mot de passe incorrect.' }); }
    const { data } = await supabase.rpc('is_admin');
    if (!data) { await supabase.auth.signOut(); setBusy(false); return setM({ ok: false, t: "Ce compte n'a pas les droits d'administrateur." }); }
    router.replace('/admin');
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-soft">
        <h1 className="mb-5 text-2xl font-bold">Connexion administrateur</h1>
        <Msg m={m} />
        <input name="email" type="email" required placeholder="E-mail" className="input mb-3" autoComplete="email" />
        <input name="password" type="password" required placeholder="Mot de passe" className="input mb-4" autoComplete="current-password" />
        <button disabled={busy} className="btn-gold w-full">{busy ? 'Connexion…' : 'Se connecter'}</button>
      </form>
    </div>
  );
}
