<!-- EventCard.vue -->
<script setup lang="ts">
    import type { Event } from "@/lib/types/frontend.types"
    import { useEventParticipants } from "@/composables/useEventRegistration"

    const props = defineProps<{ event: Event }>()

    const { allParticipants } = useEventParticipants(() => props.event.id)
</script>

<template>
    <div>
        <span v-for="og in event.organizer" :key="og.id">{{ og.name }}</span>
        <br />
        {{ event.title }}
        <br />
        {{ event.startTime }}
        <br />
        <div v-for="p in allParticipants" :key="p.user.username">
            {{ p.user.firstName }}
            {{ p.user.lastName }}
        </div>
    </div>
</template>
