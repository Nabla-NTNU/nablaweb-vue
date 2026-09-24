<script setup lang="ts">
    import { useEvents } from "@/composables/useEvents"
    import { EventType } from "@/lib/types/frontend.types"

    const { events } = useEvents()
</script>

<template>
    <div class="mt-32 flex justify-around">
        <!-- Arrangementer -->
        <div>
            <div class="text-center font-poppins text-title-4 text-fg">
                Arrangementer
            </div>
            <div
                class="w-120 font-lato text-l text-fg"
                v-for="event in events.filter(
                    (e) => e.eventType !== EventType.bedpress,
                )"
                :key="event.id"
            >
                {{ event.title }}
            </div>
        </div>

        <!-- Bedriftspresentasjoner -->
        <div>
            <div class="text-center font-poppins text-title-4 text-fg">
                Bedriftspresentasjoner
            </div>
            <div
                class="w-120 font-lato text-l text-fg"
                v-for="bedpress in events.filter(
                    (e) => e.eventType === EventType.bedpress,
                )"
                :key="bedpress.id"
            >
                {{ bedpress.title }}
            </div>
        </div>
    </div>
</template>
