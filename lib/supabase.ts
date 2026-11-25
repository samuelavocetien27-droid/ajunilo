import { createClient } from '@supabase/supabase-js';

// Clé publique "anon" uniquement : la sécurité repose sur les politiques RLS (voir supabase/schema.sql).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  { auth: { persistSession: typeof window !== 'undefined', autoRefreshToken: typeof window !== 'undefined' } }
);
