import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://joboivbydwrjkvhiyywb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvYm9pdmJ5ZHdyamt2aGl5eXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1ODAyNDUsImV4cCI6MjA1OTE1NjI0NX0.7uIIR-p4VyErr1NoT7ziM3tVHaur8_xwF3We9QKix1Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);