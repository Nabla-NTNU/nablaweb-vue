<script setup lang="ts">
    import { useEvents } from "@/composables/Events/useEvents"

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
                    (e) => e.eventType !== 'bedpress',
                )"
                :key="event.id"
            >
                <router-link
                    :to="`/arrangement/${event.slug}`"
                    class="text-link"
                >
                    {{ event.title }}
                </router-link>
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
                    (e) => e.eventType === 'bedpress',
                )"
                :key="bedpress.id"
            >
                <router-link
                    :to="`/arrangement/${bedpress.slug}`"
                    class="text-link"
                >
                    {{ bedpress.title }}
                </router-link>
            </div>
        </div>
    </div>
</template>
