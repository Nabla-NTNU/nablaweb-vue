import { ref, computed, readonly, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'      // typescript moment

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const isLoading = ref(true)

async function initialize() {
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
            session.value = data.session
            user.value    = data.session?.user ?? null
    } catch (e) {
        console.error('[useAuth] init error', e)
    } finally {
        isLoading.value = false
    }
}

// Since we don't run this every time a page loads we need to listen for state changes
const { data: authListener } = supabase.auth.onAuthStateChange(
    (_event, newSession) => {
        session.value = newSession
        user.value    = newSession?.user ?? null
    }
)

initialize()

export function useAuth() {
    // Save memory when a page requiering auth dissapears
    onUnmounted(() => {
        authListener.subscription.unsubscribe()
    })
  
    // If user == null, isAuthenticated is false
    const isAuthenticated = computed(() => !!user.value)
  
    // action methods
    async function signIn(email: string, password: string) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        return data
    }
  
    async function signUp(email: string, password: string) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
    }
  
    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }
  
    return {
        user: readonly(user),
        session: readonly(session),
        isLoading: readonly(isLoading),
        isAuthenticated,
        
        signIn,
        signUp,
        signOut,
    }
  }