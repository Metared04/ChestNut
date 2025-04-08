import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vsbnmbdvcnetgkjfewnn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYm5tYmR2Y25ldGdramZld25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTQ5MTEsImV4cCI6MjA1OTY3MDkxMX0.TdmBa7inTZ9gD1RVR7LUG_pRsPBjJdz1NpkRpjYbC0w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);