import { supabase } from "@/lib/supabaseClient"
import { Event, EventType, EventParticipant } from "@/lib/types/frontend.types"
import { Ref, ref, onMounted, MaybeRefOrGetter, toValue, watch } from "vue"
import { useI18n } from "vue-i18n"

function makeURL(str: string): URL | undefined {
    try {
        return new URL(str)
    } catch (error) {
        console.log(`[useNablaEvent] Invalid URL: ${str}`, error)
        return undefined
    }
}

export function useEvent(slug: MaybeRefOrGetter<string>) {
    const { locale, t, mergeLocaleMessage } = useI18n()
    const error: Ref<boolean> = ref(false)
    const event: Ref<Event | undefined> = ref()

    async function fetchEvent() {
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
                    total_registration_limit,
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
                    ),
                    owning_groups: nabla_events_owner_groups (
                        group: nabla_groups!organizing_group (
                            id,
                            name,
                            subgroup: nabla_subgroups (logo)
                        )
                    ),
                    owning_individuals: nabla_events_owner_individuals (
                        user: nabla_users!username (
                            username,
                            first_name,
                            last_name,
                            profile_picture
                        )
                    ),
                    participants: nabla_events_participants (
                        registrationDate: registered_at,
                        user: nabla_users!username (
                            username,
                            firstName: first_name,
                            lastName: last_name,
                            profilePicture: profile_picture
                        ),
                        quota: nabla_events_quotas!quota (
                            id,
                            price: price_kr,
                            allocatedPlaces: nabla_group_capacity,
                            paymentEnd: payment_end,
                            registrationStart: registration_start,
                            registrationEnd: registration_end,
                            deregistrationEnd: deregistration_end,
                            group: nabla_groups!nabla_group (
                                id, 
                                name
                            )
                        )
                    )
                    `,
                )
                .eq("slug", toValue(slug))
                .single()

            if (supabaseError) throw supabaseError

            // Better ways to do this? Maybe remove the func entirely
            type ParticipantRow = (typeof data)["participants"][number]

            function mapParticipant(p: ParticipantRow): EventParticipant {
                const q = p.quota
                return {
                    user: {
                        username: p.user.username,
                        firstName: p.user.firstName,
                        lastName: p.user.lastName,
                        profilePicture: p.user.profilePicture
                            ? new URL(p.user.profilePicture)
                            : undefined,
                    },
                    // We only care about the quota group in this function, but idk how to only use them

                    quota: {
                        id: q.id,
                        group: q.group ?? undefined,
                        price: q.price,
                        allocatedPlaces: q.allocatedPlaces ?? undefined,
                        paymentEnd: q.paymentEnd
                            ? new Date(q.paymentEnd)
                            : undefined,
                        registrationStart: new Date(q.registrationStart),
                        registrationEnd: new Date(q.registrationEnd),
                        deregistrationEnd: new Date(q.deregistrationEnd),
                    },
                    registrationDate: new Date(p.registrationDate),
                }
            }

            const allParticipants = data.participants.map((p) =>
                mapParticipant(p),
            )

            mergeLocaleMessage("en", {
                [`${data.slug}_title`]: data.en_title,
                [`${data.slug}_ingress`]: data.en_description,
                [`${data.slug}_body`]: data.en_body_text,
            })
            mergeLocaleMessage("nn", {
                [`${data.slug}_title`]: data.nn_title,
                [`${data.slug}_ingress`]: data.nn_description,
                [`${data.slug}_body`]: data.nn_body_text,
            })
            mergeLocaleMessage("nb", {
                [`${data.slug}_title`]: data.nb_title,
                [`${data.slug}_ingress`]: data.nb_description,
                [`${data.slug}_body`]: data.nb_body_text,
            })

            event.value = {
                startTime: new Date(data.start_time),
                endTime: new Date(data.end_time),
                location: data.location || undefined,
                eventType: data.event_type as EventType,
                hiddenIfUnavailable: data.is_hidden,
                requiresRegistration: data.registration_required,
                image: data.event_photo_url
                    ? new URL(data.event_photo_url)
                    : undefined,
                slug: data.slug,
                totalCapacity: data.total_registration_limit,
                organizer: data.organiser_group
                    ? [
                          {
                              id: data.organiser_group.id,
                              name: data.organiser_group.name,
                              logo: makeURL(data.organiser_group.subgroup.logo),
                          },
                      ]
                    : [],
                title: t(`${data.slug}_title`),
                ingress: t(`${data.slug}_ingress`),
                body: t(`${data.slug}_body`),
                comments: [],
                reactions: [],
                owningGroups: data.owning_groups.map((og) => ({
                    id: og.group.id,
                    name: og.group.name,
                    //logo: og.group.subgroup.logo
                })),
                owningPeople: data.owning_individuals.map((oi) => ({
                    username: oi.user.username,
                    firstName: oi.user.first_name,
                    lastName: oi.user.last_name,
                })),
                participants: allParticipants.filter(
                    (p) => p.quota.group?.name !== "waitlist",
                ),
                waitlisted: allParticipants.filter(
                    (p) => p.quota.group?.name === "waitlist",
                ),
            }
        } catch (e) {
            console.error("[useEvent] Error fetching:", e)
            error.value = true
        }
    }

    onMounted(fetchEvent)
    watch(() => toValue(slug), fetchEvent)

    watch(locale, () => {
        if (!event.value) return

        event.value.title = t(`${event.value.slug}_title`)
        event.value.ingress = t(`${event.value.slug}_ingress`)
        event.value.body = t(`${event.value.slug}_body`)
    })

    return { event, error, refresh: fetchEvent }
}

export async function doesEventExist(slug: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_events")
            .select("slug")
            .eq("slug", slug)
        if (error) {
            throw error
        }
        return data.length > 0
    } catch (e) {
        console.error(`[useNablaEvent] Error fetching event: ${e}`)
    }
    return false
}

export async function isEventOwner(
    username: string,
    slug: string,
): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_events")
            .select(
                `
                    owning_individuals: nabla_events_owner_individuals (
                        user: nabla_users!username (
                            username
                        )
                    )
                `,
            )
            .eq("slug", slug)
            .single()
        if (error) {
            throw error
        }
        for (const owner of data.owning_individuals) {
            if (owner.user.username == username) {
                return true
            }
        }
    } catch (e) {
        console.error(`[useNablaGroup] Error fetching event owners: ${e}`)
    }
    return false
}
