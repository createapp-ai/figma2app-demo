import { createSupabaseClient as createSupabaseClientDev } from './supabase.dev';
import { createSupabaseClient as createSupabaseClientProd } from './supabase.prod';

let supabase: ReturnType<
  typeof createSupabaseClientDev | typeof createSupabaseClientProd
>;

if (import.meta.env.DEV) {
  const DEV_JWT_SECRET = import.meta.env.VITE_DEV_JWT_SECRET as string;
  if (!DEV_JWT_SECRET) {
    throw new Error('Missing env variable for DEV_JWT_SECRET');
  }
  supabase = createSupabaseClientDev(DEV_JWT_SECRET);
} else {
  const SUPABASE_API_URL = import.meta.env.VITE_SUPABASE_API_URL as string;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  if (!SUPABASE_API_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing env variables for Supabase (SUPABASE_API_URL, SUPABASE_ANON_KEY)'
    );
  }
  supabase = createSupabaseClientProd(SUPABASE_API_URL, SUPABASE_ANON_KEY);
}

export { supabase };
