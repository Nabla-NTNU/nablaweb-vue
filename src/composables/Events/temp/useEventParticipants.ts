import { supabase } from "@/lib/supabaseClient"
import {
    EventParticipant,
    EventParticipantStatus,
    NablaGroup,
    RegistrationInfo,
} from "@/lib/types/frontend.types"
import {
    Ref,
    ref,
    computed,
    onMounted,
    MaybeRefOrGetter,
    toValue,
    watch,
} from "vue"

type RawParticipants = {
    user: {
        username: string
        first_name: string
        last_name: string
        profile_picture: string
    }
    registration_tier: {
        id: string
        nabla_group: { id: string; name: string } | null
    } | null
    status: string
    registered_at: string
}

export function useEventParticipants(slug: MaybeRefOrGetter<string>) {
    const rawParticipants: Ref<RawParticipants[]> = ref([])
    const error: Ref<boolean> = ref(false)

    async function fetchAllParticipants() {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events_participants")
                .select(
                    `
                user: nabla_users!username (
                    username,
                    first_name,
                    last_name,
                    profile_picture
                ),
                registration_tier: nabla_events_registrations!registration_tier (
                    id,
                    nabla_group: nabla_groups!nabla_group(
                        id,
                        name
                        )
                ),
                status,
                registered_at
                `,
                )
                .eq("event", toValue(slug))
            if (supabaseError) throw supabaseError
            rawParticipants.value = data as unknown as RawParticipants[]
        } catch (e) {
            console.error("[useEventParticipants] Error fetching:", e)
            error.value = true
        }
    }
    const allParticipants = computed<EventParticipant[]>(() =>
        rawParticipants.value.map((p) => ({
            user: {
                username: p.user.username,
                firstName: p.user.first_name,
                lastName: p.user.last_name,
                profilePicture: p.user.profile_picture
                    ? new URL(p.user.profile_picture)
                    : undefined,
            },
            registrationClass: (p.registration_tier?.nabla_group ??
                undefined) as NablaGroup | undefined,
            registrationStatus: p.status as EventParticipantStatus,
            registrationDate: new Date(p.registered_at),
        })),
    )

    const getNumberParticipants = async function (
        status: EventParticipantStatus,
    ) {
        try {
            const { count, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events_participants")
                .select(`status`, { count: `exact`, head: true })
                .eq("event", toValue(slug))
                .eq(`status`, status)

            if (supabaseError) throw supabaseError
            return count
        } catch (e) {
            console.error("[useEventParticipants] Error fetching:", e)
            error.value = true
        }
    }

    const getNumberParticipantsTiers = async function (
        tier: RegistrationInfo,
    ): Promise<number | null> {
        try {
            const { count, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events_participants")
                .select(`registration_tier`, { count: `exact`, head: true })
                .eq("event", toValue(slug))
                .eq(`registration_tier`, tier.id)

            if (supabaseError) throw supabaseError

            return count
        } catch (e) {
            console.error("[useEventParticipants] Error fetching:", e)
            error.value = true
            return null
        }
    }

    const getGlobalRegistrationLimit = async function (): Promise<
        number | null
    > {
        try {
            const { count, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events")
                .select(`global_registration_limit`)
            if (supabaseError) throw supabaseError

            return count
        } catch (e) {
            console.error("[useEventParticipants] Error fetching:", e)
            error.value = true
            return null
        }
    }

    onMounted(fetchAllParticipants)
    watch(() => toValue(slug), fetchAllParticipants)

    return {
        allParticipants,
        error,
        getNumberParticipants,
        getNumberParticipantsTiers,
        getGlobalRegistrationLimit,
        refresh: fetchAllParticipants,
    }
}
