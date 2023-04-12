import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  String(process.env.NEXT_PUBLIC_SP_PROJECT_URL),
  String(process.env.NEXT_PUBLIC_SP_ANON_KEY)
)
