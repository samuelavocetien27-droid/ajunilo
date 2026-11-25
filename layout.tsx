import type { Metadata } from 'next';
import AdminShell from '@/components/AdminShell';
export const metadata: Metadata = { title: 'Administration', robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) { return <AdminShell>{children}</AdminShell>; }
