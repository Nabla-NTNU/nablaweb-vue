<script setup lang="ts">
    import {
        chosenTheme,
        chosenStyle,
        StyleTheme,
        ColorTheme,
    } from "@/composables/useTheme"

    function toggleTheme() {
        if (chosenTheme.value == ColorTheme.System) {
            chosenTheme.value = ColorTheme.Dark
        } else if (chosenTheme.value == ColorTheme.Dark) {
            chosenTheme.value = ColorTheme.Light
        } else if (chosenTheme.value == ColorTheme.Light) {
            chosenTheme.value = ColorTheme.System
        }
    }

    function toggleStyle() {
        if (chosenStyle.value == StyleTheme.Classic) {
            chosenStyle.value = StyleTheme.Modern
        } else if (chosenStyle.value == StyleTheme.Modern) {
            chosenStyle.value = StyleTheme.Classic
        }
    }
</script>

<template>
    <div class="flex flex-col items-center space-y-4 p-4">
        <!-- Toggle Classic/Modern Button -->
        <button
            v-if="chosenStyle == StyleTheme.Classic"
            class="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="toggleStyle"
        >
            Switch to Modern
        </button>
        <button
            v-if="chosenStyle == StyleTheme.Modern"
            class="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="toggleStyle"
        >
            Switch to Classic
        </button>

        <!-- Toggle Lightmode/Darkmode Button -->
        <button
            v-if="chosenTheme == ColorTheme.System"
            class="rounded-lg bg-secondary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="toggleTheme"
        >
            Switch to Dark
        </button>
        <button
            v-if="chosenTheme == ColorTheme.Dark"
            class="rounded-lg bg-secondary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="toggleTheme"
        >
            Switch to Light
        </button>
        <button
            v-if="chosenTheme == ColorTheme.Light"
            class="rounded-lg bg-secondary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="toggleTheme"
        >
            Switch to System
        </button>
    </div>
</template>
