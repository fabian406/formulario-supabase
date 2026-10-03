import { createClient } from '@supabase/supabase-js'

// Las credenciales vienen del archivo .env (nunca se suben a GitHub)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
