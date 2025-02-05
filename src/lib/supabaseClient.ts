import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nahgmxgnnrphqrxudhme.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haGdteGdubnJwaHFyeHVkaG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNjU0NzcsImV4cCI6MjA1Mzc0MTQ3N30.rOEdOwTE1ll_PNiaH3CgUMIZjR3qhKDkNILygZwj2ow';

// Create a single supabase client for use across your app
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 