import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database.types"

const isDev = import.meta.env.DEV
const devURL = `http://${window.location.hostname}:54321`
const envURL = import.meta.env.VITE_SUPABASE_URL as string
const supabaseURL = isDev ? devURL : envURL

const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseAnonKey = envAnonKey as string

if (!envAnonKey) {
    throw new Error(
        "[supabaseClient] Missing VITE_SUPABASE_ANON_KEY environment variable. Make sure it is set in the env file",
    )
}

if (!envURL) {
    throw new Error(
        "[supabaseClient] Missing VITE_SUPABASE_URL environment variable. Make sure it is set in the env file",
    )
}

export const supabase = createClient<Database>(supabaseURL, supabaseAnonKey)
