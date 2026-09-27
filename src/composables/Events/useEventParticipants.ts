import { supabase } from "@/lib/supabaseClient"
import {
    NablaClass,
    EventParticipant,
    EventParticipantStatus,
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
    registration_tier: { id: string; class: string | null } | null
    status: string
    registered_at: string
}

export function useEventParticipants(eventId: MaybeRefOrGetter<string>) {
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
                    class
                ),
                status,
                registered_at
                `,
                )
                .eq("event", toValue(eventId))
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
            registrationClass: (p.registration_tier?.class ?? undefined) as
                NablaClass | undefined,
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
                .eq("event", toValue(eventId))
                .eq(`status`, status)

            if (supabaseError) throw supabaseError
            console.log(count)
            return count
        } catch (e) {
            console.error("[useEventParticipants] Error fetching:", e)
            error.value = true
        }
    }

    onMounted(fetchAllParticipants)
    watch(() => toValue(eventId), fetchAllParticipants)

    return {
        allParticipants,
        error,
        getNumberParticipants,
        refresh: fetchAllParticipants,
    }
}
