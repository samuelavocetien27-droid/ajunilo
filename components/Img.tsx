'use client';
import { useState } from 'react';
import Placeholder from './Placeholder';
export default function Img({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(false);
  if (!src || bad) return <Placeholder className={className} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={className} />;
}
