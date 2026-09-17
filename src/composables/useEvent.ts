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
export function useEvent(id: string) {
    const { locale } = useI18n()
    const rawEvent: Ref<RawEvent[]> = ref([])
    const error: Ref<boolean> = ref(false)

    async function fetchEvent(id: string) {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events")
                .select(
                    `
                        id
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
                .eq(`id`, id)
                .single()

            if (supabaseError) throw supabaseError
            rawEvent.value = data as unknown as RawEvent[]
        } catch (e) {
            console.error("[UseEvent] Error fetching:", e)
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

    const event = computed<Event[]>(() =>
        rawEvent.value.map((event) => {
            const translation = pickTranslation(event.translations)
            return {
                id: event.id,
                startTime: new Date(event.start_time),
                endTime: new Date(event.end_time),
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
                recurrenceEndDate: new Date(event.recurrent_end_date),
            }
        }),
    )

    onMounted(() => {
        fetchEvent(id)
    })
    return { event, error, refresh: fetchEvent }
}
