// Supabase client setup

import { createClient } from '@supabase/supabase-js';

// These would typically be in your .env.local file
const supabaseUrl = "https://sscokngxfthymbriqhnt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY29rbmd4ZnRoeW1icmlxaG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzU1NzksImV4cCI6MjA2MjgxMTU3OX0.wfVkJ2dj3E85Bsn4xLW_qRSUZ2Bl22_qD4y_1gtwSNM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);