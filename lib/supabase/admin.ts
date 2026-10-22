import { createClient } from '@supabase/supabase-js';

/**
 * Server-only privileged Supabase client.
 * Uses SUPABASE_SERVICE_ROLE_KEY if provided in environment.
 * Never exposed to browser bundles.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
