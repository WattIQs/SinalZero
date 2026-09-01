import { createClient } from "@supabase/supabase-js";
import "./auth-fixes.css";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "https://ugxdktqitrsookssncdd.supabase.co";
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? "sb_publishable_zcYnKZuFa9QdlzDbkIgn4w_LXUIaoj7";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
