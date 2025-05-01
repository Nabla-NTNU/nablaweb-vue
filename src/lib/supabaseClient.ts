import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Defined in a .env.local for dev, can explore what makes sense for prod
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: 'nablaweb_vue' } })