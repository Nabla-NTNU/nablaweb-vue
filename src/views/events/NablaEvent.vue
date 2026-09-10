<script setup lang="ts">
    import { useEvents } from "@/composables/useEvents"
    const { events } = useEvents()

    // const event = ref<Event>({
    //     id: "njdfsjknsdfkjndfs",
    //     startTime: new Date("2026-09-06T14:42:00"),
    //     endTime: new Date("2026-09-06T15:42:00"),
    //     location: "Gløs",
    //     body: "Dette er et arrangment",
    //     comments: [],
    //     eventType: EventType.ordinary,
    //     hiddenIfUnavailable: true,
    //     owningGroups: [],
    //     owningPeople: [],
    //     participants: [],
    //     reactions: [],
    //     requiresRegistration: true,
    //     title: "Kult arrangement",
    //     waitingList: [],
    //     image: new URL(
    //         "https://nabla.no/media/thumbnails/uploads/news_pictures/HU5A5376.jpg.770x300_q95_box-0%2C408%2C3600%2C1811_detail_upscale.jpg",
    //     ),
    //     ingress: "Dette er et kult arrangement",
    //     link: new URL("https://nabla.no/"),
    //     organizer: [],
    //     registrationRules: new Map<string, RegistrationInfo>(),
    //     slug: "hallo",
    //     totalCapacity: 200,
    //     isWeekly: true,
    //     reccurenceEndDate: new Date(),
    // })
</script>

<template>
    <div>
        {{ events[0].title }}
    </div>
</template>
