import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'pixatvidlimrbimmuzqs';

// Resolves a valid Supabase URL even if the user provided only the project ID
function getValidSupabaseUrl(): string {
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();

  if (envUrl) {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      return envUrl;
    }
    // If user or environment set just the project ID (e.g. 'pixatvidlimrbimmuzqs')
    return `https://${envUrl}.supabase.co`;
  }

  return `https://${SUPABASE_PROJECT_ID}.supabase.co`;
}

const supabaseUrl = getValidSupabaseUrl();
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  'sb_publishable_dfRVlon4SxvurYX8b8uUvg_fBsZP7Xs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

