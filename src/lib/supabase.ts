import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znffejctlpwpevxjwivq.supabase.co';
const supabaseAnonKey = 'sb_publishable__Wkr3YD4cFUr0YrrvygexA_LIVFmZHj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
