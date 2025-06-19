import { ref, computed, readonly } from "vue"
import { supabase } from "@/lib/supabaseClient"
import type { User, Session, AuthError } from "@supabase/supabase-js"

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const username = ref<string | null>(null)
const profilePicture = ref<URL | null>(null)
const isInitialised = ref<boolean>(false)

// In the future: this can be stored as meta-data in Supabase! Probably should too.
// https://supabase.com/docs/guides/auth/managing-user-data
async function getUser(): Promise<void> {
    if (user.value?.id) {
        try {
            const { data, error } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_users")
                .select(
                    `username, first_name, last_name, profilePicture: profile_picture`,
                )
                .eq("supabase_id", user.value.id)
                .single()
            if (error) throw error
            username.value = data.username
            try {
                profilePicture.value = new URL(data.profilePicture)
            } catch (error) {
                console.error(
                    `[useAuth] user had a non-URL profile picture ${user.value.id}`,
                    error,
                )
            }
        } catch (error) {
            console.error(
                `[useAuth] error finding username for user ${user.value.id}`,
                error,
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
            await getUser()
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
        await getUser()
    } catch (e) {
        console.error("[useAuth] init error", e)
    } finally {
        // Make global listener to auth state change
        const authListener = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                session.value = newSession
                user.value = newSession?.user ?? null
                getUser()
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
        session.value = data.session
        getUser()
        return error
    } catch (error) {
        console.error("[useAuth] Error signing in", error)
        return error as AuthError
    }
}

async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        user.value = null
        session.value = null
        username.value = null
        return error
    } catch (error) {
        console.error("[useAuth] Error signing out", error)
        return error as AuthError
    }
}

async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
}

export function useAuth() {
    const isAuthenticated = computed(() => !!user.value)

    return {
        username: readonly(username),
        profilePicture: readonly(profilePicture),
        isAuthenticated,

        signIn,
        signUp,
        signOut,
        isUserAdmin,
    }
}
