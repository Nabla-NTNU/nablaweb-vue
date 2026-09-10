<script setup lang="ts">
    import {
        Event,
        EventType,
        RegistrationInfo,
    } from "@/lib/types/frontend.types"
    import { ref } from "vue"

    const event = ref<Event>({
        id: "njdfsjknsdfkjndfs",
        startTime: new Date("2026-09-06T14:42:00"),
        endTime: new Date("2026-09-06T15:42:00"),
        location: "Gløs",
        body: "Dette er et arrangment",
        comments: [],
        eventType: EventType.ordinary,
        hiddenIfUnavailable: true,
        owningGroups: [],
        owningPeople: [],
        participants: [],
        reactions: [],
        requiresRegistration: true,
        title: "Kult arrangement",
        waitingList: [],
        image: new URL(
            "https://nabla.no/media/thumbnails/uploads/news_pictures/HU5A5376.jpg.770x300_q95_box-0%2C408%2C3600%2C1811_detail_upscale.jpg",
        ),
        ingress: "Dette er et kult arrangement",
        link: new URL("https://nabla.no/"),
        organizer: [],
        registrationRules: new Map<string, RegistrationInfo>(),
        slug: "hallo",
        totalCapacity: 200,
        isWeekly: true,
        reccurenceEndDate: new Date(),
    })
</script>

<template>
    <h1 class="grow text-title-2 font-semibold tracking-tight">
        {{ event.title }}
    </h1>

    <h2 class="font-semibolf text-title-5 tracking-tight">
        {{ event.ingress }}
    </h2>

    {{ event.body }}
</template>
