import { supabase } from "@/lib/supabaseClient"
import { Event, EventType } from "@/lib/types/frontend.types"
import { Ref, ref, onMounted, watch } from "vue"
import { useI18n } from "vue-i18n"

function makeURL(str: string): URL | undefined {
    try {
        return new URL(str)
    } catch (error) {
        console.log(`[useNablaEvents] Invalid URL: ${str}`, error)
        return undefined
    }
}

export function useEvents() {
    const error: Ref<boolean> = ref(false)
    const events: Ref<Event[]> = ref([])
    const { locale, t, mergeLocaleMessage } = useI18n()

    async function fetchAllEvents() {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_events")
                .select(
                    `
                    start_time,
                    end_time,
                    location,
                    event_type,
                    is_hidden,
                    registration_required,
                    event_photo_url,
                    slug,
                    total_registration_limit ,
                    nb_title,       
                    nb_description,
                    nb_body_text,
                    en_title,
                    en_description,
                    en_body_text,
                    nn_title,
                    nn_description,
                    nn_body_text,
                    organiser_group: nabla_groups!organiser (
                        id,
                        name,
                        subgroup: nabla_subgroups (logo)
                    )

                `,
                )
                .order("start_time", { ascending: false }) // Order by start time to get the most recent events first

            if (supabaseError) throw supabaseError

            events.value = data.map((event) => {
                mergeLocaleMessage("en", {
                    [`${event.slug}_title`]: event.en_title,
                    [`${event.slug}_ingress`]: event.en_description,
                    [`${event.slug}_body`]: event.en_body_text,
                })
                mergeLocaleMessage("nn", {
                    [`${event.slug}_title`]: event.nn_title,
                    [`${event.slug}_ingress`]: event.nn_description,
                    [`${event.slug}_body`]: event.nn_body_text,
                })
                mergeLocaleMessage("nb", {
                    [`${event.slug}_title`]: event.nb_title,
                    [`${event.slug}_ingress`]: event.nb_description,
                    [`${event.slug}_body`]: event.nb_body_text,
                })

                return {
                    startTime: new Date(event.start_time),
                    endTime: new Date(event.end_time),
                    location: event.location || undefined,
                    eventType: event.event_type as EventType,
                    hiddenIfUnavailable: event.is_hidden,
                    requiresRegistration: event.registration_required,
                    image: event.event_photo_url
                        ? new URL(event.event_photo_url)
                        : undefined,
                    slug: event.slug,
                    totalCapacity: event.total_registration_limit,
                    organizer: event.organiser_group
                        ? [
                              {
                                  id: event.organiser_group.id,
                                  name: event.organiser_group.name,
                                  logo: makeURL(
                                      event.organiser_group.subgroup?.logo ||
                                          "",
                                  ),
                              },
                          ]
                        : [],
                    title: t(`${event.slug}_title`),
                    ingress: t(`${event.slug}_ingress`),
                    body: t(`${event.slug}_body`),
                    comments: [],
                    reactions: [],
                    owningGroups: [],
                    owningPeople: [],
                    participants: [],
                }
            })
        } catch (e) {
            console.error("[useEvents] Error fetching:", e)
            error.value = true
        }
    }

    watch(locale, () => {
        events.value.forEach((event) => {
            event.title = t(`${event.slug}_title`)
            event.ingress = t(`${event.slug}_ingress`)
            event.body = t(`${event.slug}_body`)
        })
    })

    onMounted(() => {
        fetchAllEvents()
    })

    return { events, error, refresh: fetchAllEvents }
}
