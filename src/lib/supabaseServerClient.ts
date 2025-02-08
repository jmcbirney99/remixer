import { createClient } from '@supabase/supabase-js';

// Debug: log the environment variables
console.log('process.env.SUPABASE_URL:', JSON.stringify(process.env.SUPABASE_URL));
console.log('process.env.SUPABASE_ANON_KEY:', JSON.stringify(process.env.SUPABASE_ANON_KEY));

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing env.SUPABASE_URL');
}
if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing env.SUPABASE_ANON_KEY');
}

export const supabaseServerClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
); 