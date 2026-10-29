import { supabase } from "@/lib/supabaseClient"
import {
    EventParticipantStatus,
    RegistrationInfo,
} from "@/lib/types/frontend.types"
import { useUser } from "@/composables/useNablaUser"
import {
    Ref,
    ref,
    computed,
    onMounted,
    MaybeRefOrGetter,
    toValue,
    watch,
} from "vue"

type RawRegistrationTier = {
    id: string
    price_kr: number
    nabla_group: { id: string; name: string } | null
    nabla_group_capacity: number | null
    payment_end: string | null
    registration_start: string
    registration_end: string
    deregistration_end: string
}

export function useEventRegistration(
    slug: MaybeRefOrGetter<string>,
    username: string,
) {
    const userData = useUser(username)
    const rawTiers: Ref<RawRegistrationTier[]> = ref([])
    const error: Ref<boolean> = ref(false)

    async function fetchTiers() {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events_registrations")
                .select(
                    `
                    id,
                    price_kr,
                    nabla_group: nabla_groups!nabla_group (
                        id,
                        name
                    ),
                    nabla_group_capacity,
                    payment_end,
                    registration_start,
                    registration_end,
                    deregistration_end
                `,
                )
                .eq("event", toValue(slug))

            if (supabaseError) throw supabaseError
            rawTiers.value = data as unknown as RawRegistrationTier[]
        } catch (e) {
            console.error("[useEventRegistration] Error fetching:", e)
            error.value = true
        }
    }

    function toRegistrationInfo(tier: RawRegistrationTier): RegistrationInfo {
        return {
            id: tier.id,
            groupId: tier.nabla_group?.id,
            groupName: tier.nabla_group?.name,
            allocatedPlaces: tier.nabla_group_capacity ?? undefined,
            paymentEnd: tier.payment_end
                ? new Date(tier.payment_end)
                : undefined,
            registrationStart: new Date(tier.registration_start),
            registrationEnd: new Date(tier.registration_end),
            deregistrationEnd: new Date(tier.deregistration_end),
            price: tier.price_kr,
        }
    }

    const eligibleTiers = computed<RegistrationInfo[]>(() => {
        const myGroupIds = new Set(
            userData?.user.value?.memberOf?.map((g) => g.id) ?? [],
        )
        return rawTiers.value
            .filter(
                (t) =>
                    t.nabla_group !== null && myGroupIds.has(t.nabla_group.id),
            )
            .map(toRegistrationInfo)
    })
    // True while the user's group memberships are still loading, so the UI
    // does not display just the default tier for a moment
    const loadingGroups = computed(() => userData?.isLoading.value ?? false)

    async function register(): Promise<EventParticipantStatus | null> {
        const { data, error: supabaseError } = await supabase
            .schema("nablaweb_vue")
            .rpc("register_for_event", { p_event: toValue(slug) })

        if (supabaseError) {
            console.error(
                "[useEventRegistration] Error registering:",
                supabaseError.message,
            )
            return null
        }
        return data as EventParticipantStatus // "registered" or "waitlisted"
    }

    async function unregister(): Promise<boolean> {
        const { error: supabaseError } = await supabase
            .schema("nablaweb_vue")
            .rpc("cancel_registration", { p_event: toValue(slug) })

        if (supabaseError) {
            console.error(
                "[useEventRegistration] Error unregistering:",
                supabaseError.message,
            )
            return false
        }
        return true
    }

    onMounted(fetchTiers)
    watch(() => toValue(slug), fetchTiers)

    return {
        eligibleTiers,
        error,
        loadingGroups,
        register,
        unregister,
        refresh: fetchTiers,
    }
}
