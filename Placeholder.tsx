import { Laptop } from 'lucide-react';
export default function Placeholder({ className = '' }: { className?: string }) {
  return <div className={`flex items-center justify-center bg-gradient-to-br from-mist to-neutral-200 text-ink/25 ${className}`}><Laptop size={48} strokeWidth={1.2} /></div>;
}
