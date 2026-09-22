<script setup lang="ts">
    import { useEvents } from "@/composables/useEvents"
    import EventCard from "./EventCard.vue"

    const { events } = useEvents()
</script>

<template>
    <h1>Event</h1>
    <EventCard v-for="event in events" :key="event.id" :event="event" />
</template>
