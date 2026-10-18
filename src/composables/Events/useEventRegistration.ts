import { supabase } from "@/lib/supabaseClient"
import { RegistrationInfo } from "@/lib/types/frontend.types"
import { useUser } from "@/composables/useNablaUser"
import { useAuth } from "@/composables/useAuth"
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

export function useEventRegistration(eventId: MaybeRefOrGetter<string>) {
    const { username } = useAuth()
    const userData = username.value ? useUser(username.value) : undefined

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
                .eq("event", toValue(eventId))

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

    const allTiers = computed<RegistrationInfo[]>(() =>
        rawTiers.value.map(toRegistrationInfo),
    )

    // Tier everyone can use
    const defaultTier = computed<RegistrationInfo | undefined>(() => {
        const tier = rawTiers.value.find((t) => t.nabla_group === null)
        return tier ? toRegistrationInfo(tier) : undefined
    })

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

    async function register(tier: RegistrationInfo): Promise<boolean> {
        if (!username.value) {
            console.error(
                "[useEventRegistration] Must be logged in to register",
            )
            return false
        }

        const { error: supabaseError } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_events_participants")
            .insert({
                event: toValue(eventId),
                username: username.value,
                registration_tier: tier.id,
                status: "registered",
                // registered_at gets set automatically by the database
            })

        if (supabaseError) {
            console.error(
                "[useEventRegistration] Error registering:",
                supabaseError,
            )
            return false
        }
        return true
    }

    onMounted(fetchTiers)
    watch(() => toValue(eventId), fetchTiers)

    return {
        allTiers,
        defaultTier,
        eligibleTiers,
        loadingGroups,
        error,
        register,
        refresh: fetchTiers,
    }
}
