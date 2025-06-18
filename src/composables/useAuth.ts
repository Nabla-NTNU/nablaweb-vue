import { ref, computed, readonly } from "vue"
import { supabase } from "@/lib/supabaseClient"
import type { User, Session, AuthError } from "@supabase/supabase-js"

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const username = ref<string | null>(null)
const isInitialised = ref<boolean>(false)

// In the future: this can be stored as meta-data in Supabase! Probably should too.
// https://supabase.com/docs/guides/auth/managing-user-data
async function getUsername(): Promise<void> {
    if (user.value?.id) {
        try {
            const { data, error } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_users")
                .select("username")
                .eq("supabase_id", user.value.id)
                .single()
            if (error) throw error
            username.value = data.username
        } catch (e) {
            console.error(
                `[useAuth] error finding username for user ${user.value.id}`,
                e,
            )
        }
    } else {
        username.value = null
    }
}

// Rewrite for granular admin access issue. Probably fetch user permissions or sumfin
async function isUserAdmin(): Promise<boolean> {
    try {
        if (!username.value) {
            await getUsername()
        }

        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabladmins")
            .select("user")
            .eq("user", username.value!)

        if (data) {
            return data.length > 0
        }
        if (error) {
            throw error
        }
    } catch (e) {
        console.error(
            `[useAuth] error checking if user ${username.value} is admin`,
            e,
        )
    }
    return false
}

async function initialize(): Promise<void> {
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        session.value = data.session
        user.value = data.session?.user ?? null
        await getUsername()
    } catch (e) {
        console.error("[useAuth] init error", e)
    } finally {
        // Make global listener to auth state change
        const authListener = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                session.value = newSession
                user.value = newSession?.user ?? null
                getUsername()
            },
        )
        // And clear the memory manually if app is left
        window.onbeforeunload = () =>
            authListener.data.subscription.unsubscribe()
        isInitialised.value = true
    }
}

// Initialise if havent yet. Must be awaited for guards to work.
if (!isInitialised.value) await initialize()

async function signIn(
    email: string,
    password: string,
): Promise<null | AuthError> {
    try {
        const { error, data } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        user.value = data.user
        return error
    } catch (error) {
        console.error("[useAuth] Error signing in", error)
        return error as AuthError
    }
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

export function useAuth() {
    const isAuthenticated = computed(() => !!user.value)

    return {
        username: readonly(username),
        isAuthenticated,

        signIn,
        signUp,
        signOut,
        isUserAdmin,
    }
}
