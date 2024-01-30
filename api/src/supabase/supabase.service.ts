import { SupabaseService as SupabaseServiceDev } from './supabase.service.dev';
import { SupabaseService as SupabaseServiceProd } from './supabase.service.prod';

let SupabaseService: typeof SupabaseServiceDev | typeof SupabaseServiceProd;
if (process.env.NODE_ENV === 'production') {
  SupabaseService = SupabaseServiceProd;
} else {
  SupabaseService = SupabaseServiceDev;
}

type SupabaseService = InstanceType<typeof SupabaseService>;

export { SupabaseService };
