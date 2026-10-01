<!-- EventCard.vue -->
<script setup lang="ts">
    import {
        EventParticipantStatus,
        type Event,
    } from "@/lib/types/frontend.types"
    import { useEventParticipants } from "@/composables/Events/useEventParticipants"
    import { useEventRegistration } from "@/composables/Events/useEventRegistration"

    const props = defineProps<{ event: Event }>()

    const { allParticipants } = useEventParticipants(() => props.event.id)

    const { register } = useEventRegistration(props.event.id)
    const s = EventParticipantStatus.waitlisted
    const { getNumberParticipants } = useEventParticipants(props.event.id)

    const a = function () {
        getNumberParticipants(s)
    }
</script>

<template>
    <div>
        <span v-for="og in event.organizer" :key="og.id">{{ og.name }}</span>
        <br />
        {{ event.title }}
        <br />
        {{ event.startTime }}
        <br />
        ————————————————————————————————————————————————————————————
        <div v-for="p in allParticipants" :key="p.user.username">
            {{ p.user.firstName }}
            {{ p.user.lastName }}
        </div>
        ————————————————————————————————————————————————————————————
        <div>
            <button
                class="m-1 mt-auto rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
                @click="register"
            >
                Register
            </button>
            <button
                class="m-1 mt-auto rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
                @click="a"
            >
                Get number registered
            </button>
        </div>
    </div>
    ————————————————————————————————————————————————————————————
</template>
