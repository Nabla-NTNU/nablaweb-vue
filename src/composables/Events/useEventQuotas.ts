import { supabase } from "@/lib/supabaseClient"
import { EventParticipantStatus, Quota } from "@/lib/types/frontend.types"
import { useAuth } from "@/composables/useAuth"
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

export function useEventRegistration(slug: MaybeRefOrGetter<string>) {
    const rawQuotas: Ref<RawRegistrationQuota[]> = ref([])
    const { username } = useAuth()
    const userData = username.value ? useUser(username.value) : undefined
    const error: Ref<boolean> = ref(false)

    async function fetchQuotas() {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events_quotas")
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
            rawQuotas.value = data as unknown as RawRegistrationQuota[]
        } catch (e) {
            console.error("[useEventRegistration] Error fetching:", e)
            error.value = true
        }
    }

    function toRegistrationInfo(quota: RawRegistrationQuota): Quota {
        return {
            id: quota.id,
            groupId: quota.nabla_group?.id,
            groupName: quota.nabla_group?.name,
            allocatedPlaces: quota.nabla_group_capacity ?? undefined,
            paymentEnd: quota.payment_end
                ? new Date(quota.payment_end)
                : undefined,
            registrationStart: new Date(quota.registration_start),
            registrationEnd: new Date(quota.registration_end),
            deregistrationEnd: new Date(quota.deregistration_end),
            price: quota.price_kr,
        }
    }

    // For frontend
    const eligibleQuotas = computed<Quota[]>(() => {
        const myGroupIds = new Set(
            userData?.user.value?.memberOf?.map((g) => g.id) ?? [],
        )
        return rawQuotas.value
            .filter(
                (t) =>
                    t.nabla_group !== null && myGroupIds.has(t.nabla_group.id),
            )
            .map(toRegistrationInfo)
    })

    // Security definer handles logic for registering
    async function register(): Promise<EventParticipantStatus | null> {
        const { data, error: supabaseError } = await supabase
            .schema("nablaweb_vue")
            .rpc("register_for_event", { p_event: toValue(slug) })

        if (supabaseError) {
            console.error(
                "[useEventQuotas] Error registering:",
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
                "[useEventQuotas] Error unregistering:",
                supabaseError.message,
            )
            return false
        }
        return true
    }

    onMounted(fetchQuotas)
    watch(() => toValue(slug), fetchQuotas)

    return {
        eligibleQuotas,
        error,
        register,
        unregister,
        refresh: fetchQuotas,
    }
}
