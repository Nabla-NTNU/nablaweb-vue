import { supabase } from "@/lib/supabaseClient"
import { Event, RegistrationInfo, EventType } from "@/lib/types/frontend.types"
import { Ref, ref, onMounted } from "vue"

export function useEvents() {
    const events: Ref<Event[]> = ref([])
    const error: Ref<boolean> = ref(false)

    async function fetchAllEvents() {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events")
                .select(
                    `
                    id,
                    startTime: start_time,
                    endTime: end_time,
                    location,
                    eventType: event_type,
                    hiddenIfUnavailable: is_hidden,
                    requiresRegistration: registration_required,
                    image: event_photo,
                    slug,
                    totalCapacity: global_registration_limit
                `,
                )
                .order("order", { ascending: true })

            if (supabaseError) throw supabaseError
            events.value = (data as unknown as Event[]).map((event) => ({
                ...event,
                id: event.id,
                startTime: new Date(event.startTime),
                endTime: event.endTime ? new Date(event.endTime) : undefined,
                location: event.location,
                body: "",
                comments: [],
                eventType:
                    event.eventType in EventType
                        ? (event.eventType as EventType)
                        : EventType.undefined,
                hiddenIfUnavailable: event.hiddenIfUnavailable,
                owningGroups: [],
                owningPeople: [],
                participants: [],
                reactions: [],
                requiresRegistration: event.requiresRegistration,
                title: "",
                waitingList: [],
                image: event.image ? new URL(event.image) : undefined,
                ingress: "",
                organizer: [],
                registrationRules: new Map<string, RegistrationInfo>(),
                slug: event.slug,
                totalCapacity: event.totalCapacity,

                recurrenceEndDate: event.recurrenceEndDate
                    ? new Date(event.recurrenceEndDate)
                    : undefined,
            }))
        } catch (e) {
            console.error("[useEvents] Error fetching:", e)
            error.value = true
        }
    }

    onMounted(() => {
        fetchAllEvents()
    })

    return { events, error, refresh: fetchAllEvents }
}
