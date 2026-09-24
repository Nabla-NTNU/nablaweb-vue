import { supabase } from "@/lib/supabaseClient"
import {
    RegistrationInfo,
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
import { useAuth } from "@/composables/useAuth"

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
            registrationClass: (p.registration_tier?.class ?? undefined) as
                | NablaClass
                | undefined,
            registrationStatus: p.status as EventParticipantStatus,
            registrationDate: new Date(p.registered_at),
        })),
    )

    onMounted(fetchAllParticipants)
    watch(() => toValue(eventid), fetchAllParticipants)

    return { allParticipants, error, refresh: fetchAllParticipants }
}

export function useEventRegistration(eventId: MaybeRefOrGetter<string>) {
    const userData = useAuth()
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

    const allTiers = computed<Map<NablaClass | "default", RegistrationInfo>>(
        () => {
            const map = new Map<NablaClass | "default", RegistrationInfo>()
            for (const tier of rawTiers.value) {
                map.set(((tier.class as NablaClass) || null) ?? "default", {
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
        },
    )

    const myTier = computed<RawRegistrationTier | undefined>(() => {
        return (
            rawTiers.value.find((t) => t.class === userData.userClass.value) ??
            rawTiers.value.find((t) => t.class === null)
        )
    })

    const myRegistrationInfo = computed<RegistrationInfo | undefined>(() =>
        myTier.value
            ? allTiers.value.get(
                  ((myTier.value.class as NablaClass) || null) ?? "default",
              )
            : undefined,
    )

    async function register() {
        if (!userData.isAuthenticated.value || !userData) {
            console.log("Not allowed!!!!!!!!!!!")
        }

        const { error: supabaseError } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_events_participants")
            .insert({
                event: eventId,
                username: userData.username,
                registration_tier: userData.userClass,
                status: "registered",
                registered_at: Date.now(),
            })

        if (supabaseError) {
            console.log("error")
        }
    }

    onMounted(fetchClasses)
    watch(() => toValue(eventId), fetchClasses)

    return {
        allTiers,
        myTier,
        myRegistrationInfo,
        error,
        register,
        refresh: fetchClasses,
    }
}
