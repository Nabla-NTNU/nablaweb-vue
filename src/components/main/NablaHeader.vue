<script setup lang="ts">
    import { ref, onMounted } from "vue"
    import { useI18n } from "vue-i18n"
    import NablaLogo from "./header-links/ReturnLink.vue"
    import NavigationLink from "./header-links/NavigationLink.vue"
    import NablaProfileLink from "./header-links/ProfileLink.vue"
    const { t } = useI18n()

    const mobileNavVisible = ref(false)

    const quotes = [
        "Du kan nå endre fargetema i profilen din 🎨",
        "WebKom er best 💯",
        "Sjekk ut det nyeste Nabladet 🔆",
        "Ny kodegolf! ⛳",
        "Nye brettspill på kontoret 🎲",
        "Oter 🦦",
        "Lenge leve Snabla 🐘",
        "Lenge leve Nabi 🐘",
        "UFO? 🛸",
        "KultKom ☄️",
        "God påske! 🐣",
        "Søk undergruppe 📅",
        "Scary Nabla 🦇",
        "🎃🎃🎃",
        "Pumpkin spice latte 🍂",
        "17.mai 🎉",
        "Gratulerer med dagen 🎉",
        "Søk UKAAAAA, bli slave du også 🧨",
        "Skal DU stille på SKE? 😇",
        "Du SKAL stille på SKE! 😈",
        "God jul 🎄",
        "Sjekket Joulekalenderen i dag? 🎁",
        "Kanelbolleonsdag 🍴",
        "Sconestorsdag 🫓",
        "Fredagsquiz ❔",
    ]

    type HeaderItem = {
        text: string
        link: string
        // Could be recursive, but multiple dropdown layers is bad UX
        dropdownItems?: {
            text: string
            link: string
        }[]
    }

    const headerItems: HeaderItem[] = [
        {
            text: "om-nabla",
            link: "/om",
            dropdownItems: [
                {
                    text: "styret",
                    link: "/om/styret",
                },
                {
                    text: "undergrupper",
                    link: "/om/grupper",
                },
                {
                    text: "nabladet",
                    link: "/om/nabladet",
                },
                {
                    text: "skråttcast",
                    link: "/om/skråttcast",
                },
                {
                    text: "kjelleren",
                    link: "/om/kjelleren",
                },
                {
                    text: "kontakt",
                    link: "/om/kontakt-og-varsling",
                },
            ],
        },
        {
            text: "kalender",
            link: "/kalender",
            dropdownItems: [
                {
                    text: "arrangement",
                    link: "/kalender",
                },
                {
                    text: "bedpres",
                    link: "/kalender",
                },
                {
                    text: "regelmessig",
                    link: "/kalender",
                },
            ],
        },
        {
            text: "karriere",
            link: "/karriere",
            dropdownItems: [
                {
                    text: "for-bedrifter",
                    link: "/for-bedrifter",
                },
                {
                    text: "jobb",
                    link: "/jobb",
                },
            ],
        },
        {
            text: "wiki",
            link: "/wiki",
        },
    ]

    const currentQuote = ref("")

    onMounted(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length)
        currentQuote.value = quotes[randomIndex]
    })
</script>

<template>
    <header
        class="top-0 h-max-header sticky z-10 h-header grid-rows-1 content-center font-poppins text-title-6 text-gray-25"
    >
        <div
            class="flex flex-row items-center justify-between bg-primary pl-4 pr-6 transition duration-300 ease-in-out"
        >
            <!-- Tips & tricks -->
            <div
                class="absolute -bottom-6 left-14 hidden rounded-ee-xl rounded-es-xl rounded-se-xl border-2 border-primary-400 bg-primary-800 px-2 py-1 font-zilla text-s font-semibold tracking-[0.5px] s:flex"
            >
                {{ currentQuote }}
            </div>

            <!-- Logo -->
            <router-link class="h-header w-header content-center" to="/">
                <NablaLogo
                    class="h-4/5 w-4/5 fill-secondary transition-all duration-200 hover:fill-secondary-dark"
                />
            </router-link>

            <!-- Links in header: desktop -->
            <nav class="hidden flex-row s:flex">
                <div v-for="item in headerItems" :key="item.link" class="">
                    <NavigationLink
                        :link-text="t(item.text)"
                        :link-to="item.link"
                        :dropdown-items="
                            item.dropdownItems?.map((item) => {
                                return { text: t(item.text), link: item.link }
                            })
                        "
                        class="s:flex"
                    />
                </div>
                <NablaProfileLink class="h-header w-header" />
            </nav>
            <!-- Toggle for stuff -->
            <button
                class="hover:text-secondary s:hidden"
                @click="mobileNavVisible = !mobileNavVisible"
            >
                nav
            </button>
        </div>
    </header>
    <!-- Shitty mobile menu to begin process -->
    <Transition
        enter-from-class="max-h-[0px]"
        enter-to-class="max-h-[1000px]"
        enter-active-class="overflow-hidden transition-all duration-300 ease-in-out"
        leave-from-class="max-h-[1000px]"
        leave-to-class="max-h-[0px]"
        leave-active-class="overflow-hidden transition-all duration-300 ease-in-out"
    >
        <nav
            v-show="mobileNavVisible"
            class="flex w-full flex-col bg-primary-dark pt-[1px] text-center font-poppins text-title-6 text-gray-25 s:hidden"
        >
            <div v-for="item in headerItems" :key="item.link" class="">
                <div
                    class="w-fill h-fill my-[1px] flex bg-primary py-2 transition duration-300 hover:bg-primary-dark hover:text-secondary"
                >
                    <router-link
                        to="/for-komponenter/komiteer"
                        class="h-full w-full"
                        @click="mobileNavVisible = false"
                    >
                        {{ t(item.text) }}
                    </router-link>
                </div>
            </div>
            <div class="mt-[1px] w-full bg-primary py-2">
                <router-link
                    to="/for-komponenter/komiteer"
                    class="w-full transition duration-300 ease-in-out hover:bg-secondary"
                    @click="mobileNavVisible = false"
                >
                    Log in
                </router-link>
            </div>
        </nav>
    </Transition>
</template>

<i18n lang="yaml">
nb:
    om-nabla: Om Nabla
    kalender: Kalender
    karriere: Karriere
    for-bedrifter: For Bedrifter
    styret: Styret
    undergrupper: Undergrupper
    nabladet: Nabladet
    skråttcast: Skråttcast
    kjelleren: Kjelleren
    kontakt: Kontakt og varsling
    arrangement: Arrangement
    bedpres: BedPres
    regelmessig: Regelmessige
    jobb: Jobbannonser
    wiki: Wiki

en:
    om-nabla: About Nabla
    kalender: Calendar
    karriere: Carreer
    for-bedrifter: For Businesses
    styret: The Council
    undergrupper: Groups
    nabladet: Nabladet
    skråttcast: Skråttcast
    kjelleren: The Cellar
    kontakt: Contact
    arrangement: Events
    bedpres: Business presentations
    regelmessig: Regular
    jobb: Jobs
    wiki: Wiki
</i18n>
