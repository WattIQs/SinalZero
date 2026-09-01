import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

function normalizeSupabaseUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/\/+$/, "");
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    // Vercel environments occasionally receive a REST/Auth endpoint instead of the project root.
    // supabase-js appends its own /auth/v1 and /rest/v1 paths, so keeping those paths causes
    // malformed requests such as "Invalid path specified in request URL".
    url.pathname = url.pathname.replace(/\/(rest\/v1|auth\/v1|storage\/v1|realtime\/v1)\/?$/i, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;
