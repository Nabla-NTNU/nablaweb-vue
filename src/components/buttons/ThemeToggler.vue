<script setup lang="ts">
    import { chosenTheme, chosenStyle } from "@/composables/useTheme"
    import { ColorTheme, StyleTheme } from "@/lib/types/frontend.types"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

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
            {{ t("bytt-til-moderne") }}
        </button>
        <button
            v-if="chosenStyle == StyleTheme.Modern"
            class="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="toggleStyle"
        >
            {{ t("bytt-til-klassisk") }}
        </button>

        <!-- Toggle Lightmode/Darkmode Button -->
        <button
            v-if="chosenTheme == ColorTheme.System"
            class="rounded-lg bg-secondary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="toggleTheme"
        >
            {{ t("bytt-til-mørk") }}
        </button>
        <button
            v-if="chosenTheme == ColorTheme.Dark"
            class="rounded-lg bg-secondary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="toggleTheme"
        >
            {{ t("bytt-til-lys") }}
        </button>
        <button
            v-if="chosenTheme == ColorTheme.Light"
            class="rounded-lg bg-secondary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="toggleTheme"
        >
            {{ t("bytt-til-system") }}
        </button>
    </div>
</template>

<i18n lang="yaml">
nb:
    bytt-til-moderne: Bytt til Moderne
    bytt-til-klassisk: Bytt til Klassisk
    bytt-til-mørk: Bytt til Mørk
    bytt-til-lys: Bytt til Lys
    bytt-til-system: Bytt til System
en:
    bytt-til-moderne: Switch to Modern
    bytt-til-klassisk: Switch to Classic
    bytt-til-mørk: Switch to Dark
    bytt-til-lys: Switch to Light
    bytt-til-system: Switch to System
</i18n>
