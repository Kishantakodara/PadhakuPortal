import { createClient } from '@supabase/supabase-js';

// Get environment variables for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ujzlhfojtcyvafaysldp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemxoZm9qdGN5dmFmYXlzbGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODA5MTAsImV4cCI6MjA5NDA1NjkxMH0.CiSgVWT4L9QYzPo_UD53PNwxxMQCwt-PT143SjT4qyA';

// Service role key — bypasses all RLS. Used only for admin storage operations.
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key — can delete storage files without RLS policies
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : supabase; // fallback to regular client if key not set