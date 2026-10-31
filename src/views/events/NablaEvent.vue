<script setup lang="ts">
    import { useRoute, RouterLink } from "vue-router"
    import { computed } from "vue"
    import { useI18n } from "vue-i18n"
    import { useEvent } from "@/composables/Events/useEvent.js"
    import { useEventRegistration } from "@/composables/Events/useEventRegistration"

    const { t } = useI18n()
    import UserCard from "@/components/general/UserCard.vue"

    import { useAuth } from "@/composables/useAuth.js"
    import GroupCard from "@/components/group-page/GroupCard.vue"
    import { EventParticipantStatus } from "@/lib/types/frontend.types"

    const route = useRoute()
    const slug = computed(() => route.params.slug as string)
    const { event, refresh } = useEvent(slug)
    const { username, isAdmin } = useAuth()
    const { register, unregister } = useEventRegistration(slug)

    async function registerAndRefresh() {
        await register()
        await refresh()
    }
    async function unregisterAndRefresh() {
        await unregister()
        await refresh()
    }
    const myParticipation = computed(() => {
        if (!event.value || !username.value) return undefined
        return [
            ...event.value.registeredParticipants,
            ...event.value.waitlistedParticipants,
        ].find((p) => p.user.username === username.value)
    })

    const userIsAdmin = computed(() => {
        if (isAdmin.value) {
            return true
        }
        if (event.value?.owningPeople) {
            for (const ownerIdx in event.value.owningPeople) {
                const owner = event.value.owningPeople[ownerIdx]
                if (owner.username === username.value) {
                    console.log("Is owningpeople")
                    return true
                }
            }
        }

        return false
    })
</script>

<template>
    <!-- Photos take a while to load. Would be nice to show a pulsating svg while photoLoaded is false.-->
    <div class="mx-auto 2xl:flex">
        <div v-if="event" class="flex max-w-[1440px] flex-grow flex-col">
            <div class="mx-auto flex flex-row gap-8">
                <div
                    class="flex w-full max-w-[500px] shrink-0 flex-grow pl-16 pt-4"
                >
                    <img
                        v-if="event?.image"
                        onload="//photoLoaded = true"
                        :src="event?.image.href"
                        alt="Bilde av medlemmene i gruppen"
                    />
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-1 pr-6">
                        <div class="flex px-2 text-m-bold">
                            Arrangementet starter:
                        </div>
                        <div class="flex">
                            {{ event.startTime.toLocaleDateString("no") }}
                        </div>
                        <div class="flex px-2">
                            {{ event.startTime.toLocaleTimeString("no") }}
                        </div>
                    </div>

                    <div v-if="event.endTime" class="flex flex-1 pr-6">
                        <div class="flex px-2 text-m-bold">
                            Arrangementet slutter:
                        </div>
                        <div class="flex">
                            {{ event.endTime.toLocaleDateString("no") }}
                        </div>
                        <div class="flex px-2">
                            {{ event.endTime.toLocaleTimeString("no") }}
                        </div>
                    </div>

                    <div class="flex flex-1 pr-6">
                        <div class="text-m-bold">Sted:</div>
                        <div class="px-2">{{ event.location }}</div>
                    </div>

                    <div
                        class="flex shrink-0 flex-wrap justify-center gap-6 pl-16"
                    >
                        <div v-if="event.organizer">
                            <h2
                                class="group mb-4 flex items-center justify-center text-subtitle-2 font-semibold tracking-tight"
                            >
                                {{ t("arrangert_av") }}:
                            </h2>
                            <GroupCard
                                v-for="organizer in event.organizer"
                                :id="organizer.id"
                                :key="organizer.id"
                                :name="organizer.name"
                                :logo="organizer.logo"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="sm:px-6 lg:px-8 mx-auto flex w-full max-w-[1440px] px-4 py-10"
            >
                <div class="flex-1 pl-6">
                    <div class="mb-4 flex flex-row">
                        <h1
                            class="grow text-title-2 font-semibold tracking-tight"
                        >
                            {{ event.title }}
                        </h1>
                        <RouterLink
                            v-if="userIsAdmin"
                            :to="`/arrangement/${event.slug}/admin`"
                            class="rounded-lg bg-primary px-4 py-2 text-center font-semibold text-white transition-all duration-300"
                            style="white-space: pre-line"
                        >
                            {{ t("adminpanel") }}
                        </RouterLink>
                    </div>

                    <article v-if="event.ingress" class="reset-tailwind flex-1">
                        <b>{{ event.ingress }}</b>
                    </article>
                    <br />
                    <article class="reset-tailwind flex-1">
                        {{ event.body }}
                    </article>
                    <div v-if="event.requiresRegistration">
                        <div v-if="event.registeredParticipants">
                            <h2
                                class="group mb-4 flex items-center text-subtitle-2 font-semibold tracking-tight"
                            >
                                {{ t("deltakere") }}:
                            </h2>
                            <div class="flex flex-wrap justify-center gap-6">
                                <UserCard
                                    v-for="eventParticipant in event.registeredParticipants"
                                    :key="eventParticipant.user.username"
                                    :username="eventParticipant.user.username"
                                    :first-name="
                                        eventParticipant.user.firstName
                                    "
                                    :last-name="eventParticipant.user.lastName"
                                    :profile-picture="
                                        eventParticipant.user.profilePicture
                                    "
                                />
                            </div>
                        </div>

                        Antall deltakere:
                        {{ event.registeredParticipants.length }} /
                        {{ event.totalCapacity }}
                    </div>
                    <template v-if="username">
                        <button
                            class="max-w-[200px] rounded-full border-2 border-transparent bg-primary px-4 py-1 text-title-5 text-primary-25 duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light m:text-title-4"
                            v-if="!myParticipation"
                            @click="registerAndRefresh"
                        >
                            {{ t("registrer") }}
                        </button>

                        <button
                            class="max-w-[200px] rounded-full border-2 border-transparent bg-primary px-4 py-1 text-title-5 text-primary-25 duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light m:text-title-4"
                            v-else
                            @click="unregisterAndRefresh"
                        >
                            {{
                                myParticipation.registrationStatus ===
                                EventParticipantStatus.waitlisted
                                    ? t("meld_av_venteliste")
                                    : t("avregistrer")
                            }}
                        </button>
                    </template>
                </div>
            </div>

            <div v-if="event.owningPeople.length > 0">
                <h2
                    class="group mb-4 flex items-center text-subtitle-2 font-semibold tracking-tight"
                >
                    {{ t("ansvarlige") }} :
                </h2>
                <div class="flex flex-wrap justify-center gap-6">
                    <UserCard
                        v-for="eventOwner in event.owningPeople"
                        :key="eventOwner.username"
                        :username="eventOwner.username"
                        :first-name="eventOwner.firstName"
                        :last-name="eventOwner.lastName"
                        :profile-picture="eventOwner.profilePicture"
                    />
                </div>
                {{ t("kontakt_arrangør") }}
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
nb:
    adminpanel: "Hemmelige Saker \n (Adminpanel)"
    deltakere: Deltakere
    ansvarlige: Ansvarlige
    kontakt_arrangør: Ta kontakt med arrangørene dersom du har noen spørsmål angående arrangementet!
    arrangert_av: "Arrangert av"
    registrer: "Registrer"
    avregistrer: "Avregistrer"
    meld_av_venteliste: "Fjern fra venteliste"

en:
    adminpanel: "Secret Button \n (Admin page)"
    deltakere: Participants
    ansvarlige: Organizers
    kontakt_arrangør: Contact the organizers if you have any questions about the event!
    arrangert_av: "Organized by"
    registrer: "Register"
    avregistrer: "Unregister"
    venteliste: "Leave waiting list"
</i18n>
