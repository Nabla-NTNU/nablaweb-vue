<script setup lang="ts">
    import { ref, onMounted } from "vue"
    import { useI18n } from "vue-i18n"

    const { t } = useI18n()

    const quotes = ["union", "takeon", "limit", "null"]

    const quote = ref()

    onMounted(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length)
        quote.value = quotes[randomIndex]
    })
</script>

<template>
    <div class="flex w-full flex-grow flex-col">
        <div
            class="sm:px-6 lg:px-8 mx-auto flex w-full max-w-[1200px] flex-row px-4 py-10"
        >
            <div
                class="sm:px-6 lg:px-8 mx-auto flex flex-col px-4 py-10 text-title-2 font-semibold"
            >
                404:
            </div>

            <div
                v-if="quote"
                class="sm:px-6 lg:px-8 mx-auto flex w-full flex-col px-4 py-10 font-zilla text-title-2"
            >
                {{ t(quote) }}
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
nb:
    union: "Union av sidene våre og søknaden er et tomt sett."
    takeon: "Der var browseren din raskere enn lyset. Siden fins ikke enda, jo!"
    limit: "Det fins et epsilon større enn null som peker denne sida mot noe som går mot null."
    "null": "Segmentation fault (core dumped)"
en:
    union: "The union of our pages and the URL leads to an empty set."
    takeon: "Your browser used technology so advanced the bits travelled back in time. The page doesn't exist yet!"
    limit: "hey"
    "null": "Segmentation fault (core dumped)"
</i18n>
