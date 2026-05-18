import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ujzlhfojtcyvafaysldp.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemxoZm9qdGN5dmFmYXlzbGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODA5MTAsImV4cCI6MjA5NDA1NjkxMH0.CiSgVWT4L9QYzPo_UD53PNwxxMQCwt-PT143SjT4qyA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Kept as a compatibility alias for admin screens. Do not expose a Supabase
// service-role key in Vite/browser code; privileged operations belong server-side.
export const supabaseAdmin = supabase;
