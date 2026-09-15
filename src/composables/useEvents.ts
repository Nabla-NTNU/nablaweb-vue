import { supabase } from "@/lib/supabaseClient"
import { Event, EventType } from "@/lib/types/frontend.types"
import { Ref, ref, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n"

type RawEvent = {
    id: string
    start_time: string
    end_time: string
    location: string
    event_type: string
    is_hidden: boolean
    registration_required: boolean
    event_photo: string
    slug: string
    global_registration_limit: number
    recurrent_end_date: string
    translations: {
        language: "nb" | "en"
        title: string
        description: string
        body_text: string
    }[]
    organiser_group: { id: string; name: string; logo: string } | null
}

export function useEvents() {
    const { locale } = useI18n()
    const rawEvents: Ref<RawEvent[]> = ref([])
    const error: Ref<boolean> = ref(false)

    async function fetchAllEvents() {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events")
                .select(
                    `
                    id,
                    start_time,
                    end_time,
                    location,
                    event_type,
                    is_hidden,
                    registration_required,
                    event_photo,
                    slug,
                    global_registration_limit,
                    recurrent_end_date,
                    translations: nabla_events_translations (
                        language,
                        title,
                        description,
                        body_text
                    ),
                    organiser_group: nabla_groups!organiser (
                        id,
                        name,
                        logo
                    )
                `,
                )
                .order("start_time", { ascending: false }) // Order by start time to get the most recent events first

            if (supabaseError) throw supabaseError
            rawEvents.value = data as unknown as RawEvent[]
        } catch (e) {
            console.error("[useEvents] Error fetching:", e)
            error.value = true
        }
    }

    function pickTranslation(translations: RawEvent["translations"]) {
        return (
            translations.find((t) => t.language === locale.value) ??
            translations.find((t) => t.language === "nb") ??
            translations[0]
        )
    }

    const events = computed<Event[]>(() =>
        rawEvents.value.map((event) => {
            const translation = pickTranslation(event.translations)
            return {
                id: event.id,
                startTime: event.start_time
                    ? new Date(event.start_time)
                    : undefined,
                endTime: event.end_time ? new Date(event.end_time) : undefined,
                location: event.location || undefined,
                eventType: event.event_type as EventType,
                hiddenIfUnavailable: event.is_hidden,
                requiresRegistration: event.registration_required,
                image: event.event_photo
                    ? new URL(event.event_photo)
                    : undefined,
                slug: event.slug,
                totalCapacity: event.global_registration_limit,
                organizer: event.organiser_group
                    ? [
                          {
                              id: event.organiser_group.id,
                              name: event.organiser_group.name,
                          },
                      ]
                    : [],
                title: translation?.title ?? "",
                ingress: translation?.description,
                body: translation?.body_text ?? "",
                comments: [],
                reactions: [],
                owningGroups: [],
                owningPeople: [],
                participants: [],
                waitingList: [],
                recurrenceEndDate:
                    event.event_type === "recurrent"
                        ? new Date(event.recurrent_end_date)
                        : undefined,
            }
        }),
    )

    onMounted(() => {
        fetchAllEvents()
    })

    return { events, error, refresh: fetchAllEvents }
}
