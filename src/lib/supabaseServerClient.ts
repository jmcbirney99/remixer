import { createClient } from '@supabase/supabase-js';

// Debug: log the environment variables
console.log('process.env.SUPABASE_URL:', JSON.stringify(process.env.SUPABASE_URL));
console.log('process.env.SUPABASE_ANON_KEY:', JSON.stringify(process.env.SUPABASE_ANON_KEY));

const supabaseUrl =
  process.env.SUPABASE_URL?.trim() || 'https://nahgmxgnnrphqrxudhme.supabase.co';
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY?.trim() || 'Your_Default_Anon_Key';

export const supabaseServerClient = createClient(supabaseUrl, supabaseAnonKey); 