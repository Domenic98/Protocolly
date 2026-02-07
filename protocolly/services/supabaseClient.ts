
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fpkwioocnqfjanrgilxf.supabase.co';
const supabaseKey = 'sb_publishable_aURXZnU6qfx1z6HCbi2J1A_uXhUzvRF';

export const supabase = createClient(supabaseUrl, supabaseKey);
