import { createClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_ID = 'pixatvidlimrbimmuzqs';

function getValidSupabaseUrl() {
  const envUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL
      ? import.meta.env.VITE_SUPABASE_URL.trim()
      : '';

  if (envUrl) {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      return envUrl;
    }
    return `https://${envUrl}.supabase.co`;
  }

  return `https://${SUPABASE_PROJECT_ID}.supabase.co`;
}

const supabaseUrl = getValidSupabaseUrl();
const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY
    ? import.meta.env.VITE_SUPABASE_ANON_KEY.trim()
    : '') || 'sb_publishable_dfRVlon4SxvurYX8b8uUvg_fBsZP7Xs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
