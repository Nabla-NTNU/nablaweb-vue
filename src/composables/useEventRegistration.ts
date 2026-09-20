import { supabase } from "@/lib/supabaseClient"
import { RegistrationInfo, EventParticipant } from "@/lib/types/frontend.types"
import {
    Ref,
    ref,
    computed,
    onMounted,
    MaybeRefOrGetter,
    toValue,
    watch,
} from "vue"
import { useAuth } from "@/composables/useAuth"

type RawParticipants = {
    registered_at: string
    user: {
        username: string
        first_name: string
        last_name: string
        profile_picture: string
    }
}

type RawRegistrationTier = {
    id: string
    price_kr: number
    class: string | null
    class_capacity: number | null
    payment_end: string | null
    registration_start: string
    registration_end: string
    deregistration_end: string
}

export function useEventParticipants(eventid: MaybeRefOrGetter<string>) {
    const rawParticipants: Ref<RawParticipants[]> = ref([])
    const error: Ref<boolean> = ref(false)

    async function fetchAllParticipants() {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events_participants")
                .select(
                    `
                registered_at,
                user: nabla_users!username (
                    username,
                    first_name,
                    last_name,
                    profile_picture
                )
                `,
                )
                .eq("event", toValue(eventid))
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
            registrationDate: new Date(p.registered_at),
        })),
    )

    onMounted(fetchAllParticipants)
    watch(() => toValue(eventid), fetchAllParticipants)

    return { allParticipants, error, refresh: fetchAllParticipants }
}

export function useEventRegistration(eventId: MaybeRefOrGetter<string>) {
    const { userClass } = useAuth()
    const rawTiers: Ref<RawRegistrationTier[]> = ref([])
    const error: Ref<boolean> = ref(false)

    async function fetchClasses() {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events_registrations")
                .select(
                    `
                    id,
                    price_kr,
                    class,
                    class_capacity,
                    payment_end,
                    registration_start,
                    registration_end,
                    deregistration_end
                `,
                )
                .eq("event", toValue(eventId))

            if (supabaseError) throw supabaseError
            rawTiers.value = data as unknown as RawRegistrationTier[]
        } catch (e) {
            console.error("[useEventRegistration] Error fetching:", e)
            error.value = true
        }
    }

    const allTiers = computed<Map<string, RegistrationInfo>>(() => {
        const map = new Map<string, RegistrationInfo>()
        for (const tier of rawTiers.value) {
            map.set(tier.class ?? "default", {
                allocatedPlaces: tier.class_capacity ?? undefined,
                paymentEnd: tier.payment_end
                    ? new Date(tier.payment_end)
                    : undefined,
                registrationStart: new Date(tier.registration_start),
                registrationEnd: new Date(tier.registration_end),
                deregistrationEnd: new Date(tier.deregistration_end),
                price: tier.price_kr,
            })
        }
        return map
    })

    const myTier = computed<RawRegistrationTier | undefined>(() => {
        return (
            rawTiers.value.find((t) => t.class === userClass.value) ??
            rawTiers.value.find((t) => t.class === null)
        )
    })

    const myRegistrationInfo = computed<RegistrationInfo | undefined>(() =>
        myTier.value
            ? allTiers.value.get(myTier.value.class ?? "default")
            : undefined,
    )

    onMounted(fetchClasses)
    watch(() => toValue(eventId), fetchClasses)

    return {
        allTiers,
        myTier,
        myRegistrationInfo,
        error,
        refresh: fetchClasses,
    }
}
