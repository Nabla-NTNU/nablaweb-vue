import { supabase } from "@/lib/supabaseClient"
import { Event, EventType } from "@/lib/types/frontend.types"
import {
    Ref,
    ref,
    computed,
    onMounted,
    MaybeRefOrGetter,
    toValue,
    watch,
} from "vue"
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
    owning_groups: { group: { id: string; name: string; logo: string } }[]
    owning_individuals: {
        user: {
            username: string
            first_name: string
            last_name: string
            profile_picture: string
        }
    }[]
}

export function useEvent(id: MaybeRefOrGetter<string>) {
    const { locale } = useI18n()
    const rawEvent: Ref<RawEvent | null> = ref(null)
    const error: Ref<boolean> = ref(false)

    async function fetchEvent() {
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
                    ),
                    owning_groups: nabla_events_owner_groups (
                        group: nabla_groups!organizing_group (
                            id,
                            name,
                            logo
                        )
                    ),
                    owning_individuals: nabla_events_owner_individuals (
                        user: nabla_users!username (
                            username,
                            first_name,
                            last_name,
                            profile_picture
                        )
                    )
                `,
                )
                .eq("id", toValue(id))
                .single()

            if (supabaseError) throw supabaseError
            rawEvent.value = data as unknown as RawEvent
        } catch (e) {
            console.error("[useEvent] Error fetching:", e)
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

    const event = computed<Event | undefined>(() => {
        if (!rawEvent.value) return undefined
        const raw = rawEvent.value
        const translation = pickTranslation(raw.translations)

        return {
            id: raw.id,
            startTime: new Date(raw.start_time),
            endTime: new Date(raw.end_time),
            location: raw.location || undefined,
            eventType: raw.event_type as EventType,
            hiddenIfUnavailable: raw.is_hidden,
            requiresRegistration: raw.registration_required,
            image: raw.event_photo ? new URL(raw.event_photo) : undefined,
            slug: raw.slug,
            totalCapacity: raw.global_registration_limit,
            organizer: raw.organiser_group
                ? [
                      {
                          id: raw.organiser_group.id,
                          name: raw.organiser_group.name,
                      },
                  ]
                : [],
            title: translation?.title ?? "",
            ingress: translation?.description,
            body: translation?.body_text ?? "",
            comments: [],
            reactions: [],
            owningGroups: raw.owning_groups.map((og) => ({
                id: og.group.id,
                name: og.group.name,
            })),
            owningPeople: raw.owning_individuals.map((oi) => ({
                username: oi.user.username,
                firstName: oi.user.first_name,
                lastName: oi.user.last_name,
            })),
            participants: [],
            waitingList: [],
            recurrenceEndDate:
                raw.event_type === "recurrent"
                    ? new Date(raw.recurrent_end_date)
                    : undefined,
        }
    })

    onMounted(fetchEvent)
    watch(() => toValue(id), fetchEvent)

    return { event, error, refresh: fetchEvent }
}
