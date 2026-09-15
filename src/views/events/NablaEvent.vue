<script setup lang="ts">
    import { useEvents } from "@/composables/useEvents"
    const { events } = useEvents()
</script>

<template>
    <br />
    <div v-for="event in events" :key="event.id">
        <span
            v-for="organizer_group in event.organizer"
            :key="organizer_group.id"
        >
            <!-- organizer_group contains only the name and id of the groups organizing.
                 If one needs more info on the group one will have to use the group id.  -->
            {{ organizer_group.name }}
        </span>
        <br />
        {{ event.title }}
        <br />
        {{ event.startTime }}
        <br />
        {{ event.endTime }}
        <br />
        {{ event.location }}
        <br />
        {{ event.eventType }}

        <br />
        {{ event.ingress }}
        <br />
        <br />
    </div>
</template>
