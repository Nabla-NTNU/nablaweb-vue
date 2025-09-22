<script setup lang="ts">
    import { useI18n } from "vue-i18n"
    const { locale } = useI18n()
</script>

<template>
    <div class="flex flex-col items-center">
        <button
            v-if="locale == 'nb'"
            class="rounded-lg border-2 border-transparent bg-primary-dark px-4 py-2 font-semibold text-white transition-all duration-300 hover:border-primary-light"
            @click="locale = 'en'"
        >
            Switch to English
        </button>

        <button
            v-if="locale == 'en'"
            class="rounded-lg border-2 border-transparent bg-primary-dark px-4 py-2 font-semibold text-white transition-all duration-300 hover:border-primary-light"
            @click="locale = 'nn'"
        >
            Bytt til Nynorsk
        </button>

        <button
            v-if="locale == 'nn'"
            class="rounded-lg border-2 border-transparent bg-primary-dark px-4 py-2 font-semibold text-white transition-all duration-300 hover:border-primary-light"
            @click="locale = 'nb'"
        >
            Bytt til Bokmål
        </button>
    </div>
</template>
