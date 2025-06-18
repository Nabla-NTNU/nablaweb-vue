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
            text: t("om-nabla"),
            link: "/om",
            dropdownItems: [
                {
                    text: t("styret"),
                    link: "/om/styret",
                },
                {
                    text: t("undergrupper"),
                    link: "/om/undergrupper",
                },
                {
                    text: "Nabladet",
                    link: "/om/nabladet",
                },
                {
                    text: t("kjelleren"),
                    link: "/om/kjelleren",
                },
                {
                    text: t("kontakt"),
                    link: "/om/kontakt-og-varsling",
                },
            ],
        },
        {
            text: t("kalender"),
            link: "/kalender",
            dropdownItems: [
                {
                    text: t("arrangement"),
                    link: "/kalender",
                },
                {
                    text: t("bedpres"),
                    link: "/kalender",
                },
                {
                    text: t("regelmessig"),
                    link: "/kalender",
                },
            ],
        },
        {
            text: t("karriere"),
            link: "/karriere",
            dropdownItems: [
                {
                    text: t("for-bedrifter"),
                    link: "/for-bedrifter",
                },
                {
                    text: t("jobb"),
                    link: "/jobb",
                },
            ],
        },
        {
            text: "Wiki",
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
                v-if="!mobileNavVisible"
                class="absolute -bottom-6 left-14 flex rounded-ee-xl rounded-es-xl rounded-se-xl border-2 border-primary-400 bg-primary-800 px-2 py-1 font-zilla text-s font-semibold tracking-[0.5px]"
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
            <nav class="hidden flex-row m:flex">
                <div v-for="item in headerItems" :key="item.link" class="">
                    <NavigationLink
                        :link-text="item.text"
                        :link-to="item.link"
                        :dropdown-items="item.dropdownItems"
                        class="m:flex"
                    />
                </div>
                <NablaProfileLink class="h-header w-header" />
            </nav>

            <!-- Shitty mobile menu to begin process -->
            <nav
                v-if="mobileNavVisible"
                class="flex flex-col space-y-4 bg-primary pb-4 m:hidden"
            >
                <router-link
                    to="/for-komponenter/komiteer"
                    class="m-4 block rounded-xl p-4 transition duration-300 ease-in-out hover:bg-secondary"
                    @click="mobileNavVisible = false"
                >
                    Undergrupper
                </router-link>
                <router-link
                    to="/profil"
                    class="m-4 block rounded-xl p-4 transition duration-300 ease-in-out hover:bg-secondary"
                    @click="mobileNavVisible = false"
                >
                    Profil
                </router-link>
            </nav>
        </div>
    </header>
</template>

<i18n lang="yaml">
nb:
    om-nabla: Om Nabla
    kalender: Kalender
    karriere: Karriere
    for-bedrifter: For Bedrifter
    styret: Styret
    undergrupper: Undergrupper
    kjelleren: Kjelleren
    kontakt: Kontakt og varsling
    arrangement: Arrangement
    bedpres: BedPres
    regelmessig: Regelmessige
    jobb: Jobbannonser

en:
    om-nabla: About Nabla
    kalender: Calendar
    karriere: Carreer
    for-bedrifter: For Businesses
    styret: The Council
    undergrupper: Groups
    kjelleren: The Cellar
    kontakt: Contact or warn
    arrangement: Events
    bedpres: Business presentations
    regelmessig: Regular
    jobb: Jobs
</i18n>
