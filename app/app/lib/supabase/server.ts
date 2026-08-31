import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/app/lib/env';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Cookie writes may fail from a Server Component. The proxy is responsible
          // for refreshing the authentication session in that case.
        }
      },
    },
  });
}
