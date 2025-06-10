import { ref, computed, readonly, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from "@/lib/types/database.types";

const user = ref<User | null>(null)
const username = ref<string | null>(null)
const session = ref<Session | null>(null)
const isLoading = ref(true)

async function getUsername(): Promise<void> {
    if (user.value?.id) {
        try {
            const { data, error } = await supabase
                .schema('nablaweb_vue')
                .from('nabla_users')
                .select('username')
                .eq('supabase_id', user.value.id)
                .single()
            if (error) throw error
            username.value = data.username
        } catch (e) {
            console.error(`[useAuth] error finding username for user ${user.value.id}`, e)
        } finally {
            isLoading.value = false
        }
    }
    else {
        username.value = null
    }   
}

async function isUserAdmin(): Promise<boolean> {
    try {
        if (!username.value) {
            // broken for when user accesses page via link
            await getUsername()
        }

        const {data, error} = await supabase
            .schema('nablaweb_vue')
            .from('nabladmins')
            .select('user')
            .eq('user', username.value!)
        if (data) { return data.length > 0 }
        if (error) { throw error }
    }
    catch (e) {
        console.error(`[useAuth] error checking if user ${username} is admin $`)
    }
    return false
}

async function initialize(): Promise<void> {
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        session.value = data.session
        user.value    = data.session?.user ?? null
        await getUsername()
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
        getUsername()
    }
)

initialize()

export function useAuth() {
    // Save memory when a page requiering auth dissapears
    onUnmounted(() => {
        authListener.subscription.unsubscribe()
    })
  
    const isAuthenticated = computed(() => !!user.value)
  
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
        location.reload()
    }
  
    return {
        user: readonly(user),
        username: readonly(username),
        session: readonly(session),
        isLoading: readonly(isLoading),
        isAuthenticated,
        
        signIn,
        signUp,
        signOut,
        isUserAdmin
    }
}