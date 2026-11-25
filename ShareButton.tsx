'use client';
import { useState } from 'react';
import { Share2 } from 'lucide-react';
export default function ShareButton({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else { await navigator.clipboard.writeText(url); setDone(true); setTimeout(() => setDone(false), 2500); }
    } catch { /* partage annulé */ }
  }
  return <button onClick={share} className="btn-line w-full"><Share2 size={16} /> {done ? 'Lien copié' : 'Partager cette fiche'}</button>;
}
