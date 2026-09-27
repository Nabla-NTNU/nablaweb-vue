import { supabase } from "@/lib/supabaseClient"
import { RegistrationInfo, NablaClass } from "@/lib/types/frontend.types"
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
        if (
            !userData.isAuthenticated.value ||
            userData.username.value == undefined ||
            !userData
        ) {
            console.log("Not allowed!")
            return
        }

        const { error: supabaseError } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_events_participants")
            .insert({
                event: eventId.toString(),
                username: userData.username.value.toString(),
                registration_tier: myTier.value?.id,
                status: "registered",
                // regristered_at gets set automatically by database
            })

        if (supabaseError) {
            console.log("supabase error")
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
