import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient(
  supabaseApiUrl: string,
  supabaseAnonKey: string
) {
  return createClient(supabaseApiUrl, supabaseAnonKey);
}
