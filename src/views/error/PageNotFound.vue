<script setup lang="ts">
    import { ref, onMounted } from "vue"
    import { useI18n } from "vue-i18n"

    const { t } = useI18n()

    const quotes = [
        "intersection",
        "takeon",
        "limit",
        "null",
        "waveform",
        "set",
        "equation",
    ]

    const quote = ref()

    onMounted(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length)
        quote.value = quotes[randomIndex]
    })
</script>

<template>
    <div class="overflow relative h-full w-full">
        <div
            class="absolute z-0 h-full w-full overflow-hidden fill-neutralish p-10 blur-[10px] transition duration-200 ease-in-out"
        >
            <svg
                id="Nabla Logo"
                xmlns="http://www.w3.org/2000/svg"
                xml:space="preserve"
                version="1.1"
                viewBox="0 4.747 133.333 119.041"
            >
                <g id="layer3" transform="translate(-.626 -.338)">
                    <path
                        id="Triangle"
                        d="M.626 42.44c1.038-2.025 1.947-4.052 2.856-6.078 1.947-3.925 4.025-7.597 7.01-10.89.91-.886 1.818-1.772 2.727-2.532 1.169-.887 2.597-1.14 4.025-1.266 4.284-.254 8.698-.507 12.983-.38 11.944.38 23.888 1.013 35.832 1.266 8.18.253 16.358.127 24.667 0 4.804-.127 9.737-.507 14.541-1.013 5.972-.507 11.035-3.04 15.45-7.091 3.245-3.04 6.62-5.825 10.386-8.231.52-.38 1.168-.76 1.817-1.013.26-.127.78-.127 1.04-.127-.13.38 0 .76-.26 1.013-.78 1.013-1.429 2.026-2.337 2.913-5.713 6.711-11.166 13.422-16.229 20.387-5.583 7.598-10.906 15.449-15.58 23.553-7.27 12.41-13.372 25.325-17.656 38.875-1.168 3.798-2.077 7.597-2.986 11.396-.39 1.773-1.428 3.292-2.467 4.812-4.024 5.445-8.568 10.257-13.891 14.436a12.904 12.904 0 0 1-2.207 1.393c-.91.506-1.299.253-1.818-.507a1145.282 1145.282 0 0 1-9.997-16.842 684.589 684.589 0 0 1-22.98-42.927c-2.855-5.824-5.582-11.65-8.438-17.348-.39-.76-.78-1.392-1.169-2.152-.389-.76-1.038-1.14-1.947-1.393-3.375-.76-6.751-.76-10.127-.507-1.038 0-2.077.127-3.245.254zm40.246-1.646c.13.38.13.634.26.887 1.298 3.292 2.467 6.584 3.895 9.75 4.674 10.384 10.256 20.26 16.358 29.884 1.948 3.04 4.025 5.825 6.232 8.738 1.039 1.393 1.558 1.266 2.467-.127 1.168-1.646 2.207-3.292 3.116-5.065 4.284-8.23 8.309-16.462 12.593-24.566 3.375-6.458 6.88-12.79 11.165-18.74.26-.38.52-.76.909-1.394-1.688-.126-3.116-.38-4.674-.38-7.14-.126-14.41-.38-21.551-.253-9.088.127-18.176.507-27.394.887-1.039 0-2.207.253-3.376.38z"
                    />
                    <path
                        id="Dash"
                        d="M69.435 84.608c-.65-.76-1.169-1.52-1.688-2.28-5.453-8.104-10.516-16.461-15.32-25.072-1.817-3.419-3.505-6.838-5.193-10.383-.26-.507-.39-1.14-.52-1.773s.13-.887.78-1.013c1.038-.127 1.428 0 1.947.886 5.193 9.117 10.256 18.108 15.45 27.225 1.817 3.166 3.505 6.332 5.323 9.497.389 1.14.13 2.153-.78 2.913z"
                    />
                </g>
            </svg>
        </div>
        <div class="relative h-full m:content-center">
            <div
                class="sm:px-6 lg:px-8 mx-auto flex w-full max-w-[1200px] flex-col px-4 py-10 m:flex-row"
            >
                <div
                    class="sm:px-6 lg:px-8 mx-auto px-4 py-10 text-title-2 font-semibold"
                >
                    404:
                </div>
                <div class="flex flex-1 flex-col">
                    <div
                        v-if="quote"
                        class="px-4 py-10 text-center font-zilla text-title-6 m:text-left m:text-title-2"
                    >
                        {{ t(quote) }}
                    </div>
                    <!-- Think the jokes work better without, but I can see the argument for keeping it -->
                    <!-- <div class=" px-4 text-center m:text-left">
                            {{ t('message') }}
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
nb:
    intersection: "Snittet av sidene våre og søket er et tomt sett."
    takeon: "Der var browseren din raskere enn lyset. Siden fins ikke enda, jo!"
    limit: "Det fins en epsilon større enn null som peker denne sida mot en delta som går mot null."
    "null": "Segmentation fault (core dumped)"
    waveform: "Nettsida kollapset da du observerte et sted nettstedet ikke var."
    set: "En universal mengde av alle mengder som ikke inneholder seg selv inneholder ikke denne siden."
    message: "Stemmer dette ittj? Gjerne gi WebKom en beskjed!"
    equation: "4 + e**i*π - 4! - (1+2+3) - 7? = 42"

en:
    intersection: "The intersection of our pages and the URL leads to an empty set."
    takeon: "Your browser used technology so advanced the bits travelled back in time. The page doesn't exist yet!"
    limit: "There exists an epsilon greater than zero that goes towards a delta pointing this page towards zero"
    "null": "Segmentation fault (core dumped)"
    waveform: "The website collapsed upon your observation of a place it could not be."
    set: "A universal set cannot contain this page, as it does not exist."
    message: "Is this a mistake? Please let WebKom know!"
    equation: "4 + e**i*π - 4! - (1+2+3) - 7? = 42"
</i18n>
