import { createClient } from '@supabase/supabase-js';

// Get environment variables for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ujzlhfojtcyvafaysldp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemxoZm9qdGN5dmFmYXlzbGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODA5MTAsImV4cCI6MjA5NDA1NjkxMH0.CiSgVWT4L9QYzPo_UD53PNwxxMQCwt-PT143SjT4qyA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);