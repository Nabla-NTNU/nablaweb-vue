import { ref, computed, readonly } from "vue"
import { supabase } from "@/lib/supabaseClient"
import type {
    User as SupabaseUser,
    Session,
    AuthError,
} from "@supabase/supabase-js"
import type { NablaUser } from "@/lib/types/frontend.types"

const supabaseUser = ref<SupabaseUser | null>(null)
const session = ref<Session | null>(null)
const nablaUser = ref<NablaUser | null>(null)
const isAdmin = ref<boolean>(false) // Refactor for granular admin access

// guard to only initialize once
let initializePromise: Promise<void> | undefined

function resetUser() {
    supabaseUser.value = null
    session.value = null
    nablaUser.value = null
    isAdmin.value = false
}

function toURL(url: string): URL | undefined {
    try {
        return new URL(url)
    } catch (error) {
        console.error(`[useAuth] Erronious URL "${url}"`, error)
        return undefined
    }
}

// In the future: this can be stored as meta-data in Supabase! Probably should too.
// https://supabase.com/docs/guides/auth/managing-user-data
async function fetchSession() {
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        session.value = data.session

        if (data.session?.user) {
            supabaseUser.value = data.session.user
        } else {
            resetUser()
        }
    } catch (e) {
        console.error("[useAuth] Could not get session", e)
    }
}

async function fetchNablaUser() {
    if (supabaseUser.value?.id) {
        try {
            const { data, error } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_users")
                .select(
                    `
                        username,
                        firstName: first_name,
                        lastName: last_name,
                        profilePicture: profile_picture
                    `,
                )
                .eq("supabase_id", supabaseUser.value?.id)
                .single()
            if (error) throw error
            nablaUser.value = {
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                profilePicture: toURL(data.profilePicture),
            }
        } catch (error) {
            console.error(
                `[useAuth] Failed to fetch NablaUser with supabase ID ${supabaseUser.value?.id}`,
                error,
            )
        }
    } else {
        console.error(
            `[useAuth] Fetching user when not logged in. Resetting auth.`,
        )
        resetUser()
    }
}

// Refactor for granular admin access
async function fetchUserPermissions() {
    if (nablaUser.value?.username) {
        try {
            const { data, error } = await supabase
                .schema("nablaweb_vue")
                .from("nabladmins")
                .select("user")
                .eq("user", nablaUser.value?.username)
            if (error) throw error
            if (data.length > 0) {
                isAdmin.value = true
                return
            }
        } catch (error) {
            console.error(
                `[useAuth] error checking if user ${nablaUser.value?.username} is admin`,
                error,
            )
        }
    } else {
        console.error(
            `[useAuth] Fetching user permissions of a user not logged in. Resetting auth.`,
        )
    }
    isAdmin.value = false
}

async function renewUser() {
    resetUser()
    await fetchSession()
    if (supabaseUser.value?.id) {
        await fetchNablaUser()
        await fetchUserPermissions()
    }
}

async function initialize() {
    try {
        await renewUser()
    } catch (e) {
        console.error("[useAuth] init error", e)
    }
}

async function signIn(
    email: string,
    password: string,
): Promise<null | AuthError> {
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        await renewUser()
        return null
    } catch (error) {
        console.error("[useAuth] Error signing in", error)
        return error as AuthError
    }
}

async function signOut(): Promise<null | AuthError> {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        await renewUser()
        // window.location.replace("/")
        return null
    } catch (error) {
        console.error("[useAuth] Error signing out", error)
        resetUser()
        return error as AuthError
    }
}

// async function signUp(email: string, password: string) {
//     const { error } = await supabase.auth.signUp({ email, password })
//     if (error) throw error
// }

if (!initializePromise) {
    initializePromise = initialize()
    await initializePromise
}

export function useAuth() {
    return {
        username: computed(() => nablaUser.value?.username),
        profilePicture: computed(() => nablaUser.value?.profilePicture),
        isAuthenticated: computed(() => !!supabaseUser.value),
        isAdmin: readonly(isAdmin),

        signIn,
        signOut,
        // signUp,
    }
}
