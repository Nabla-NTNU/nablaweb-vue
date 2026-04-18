<script setup lang="ts">
    import MobileHeader from "@/components/main/headers/MobileHeader.vue"
    import DesktopHeader from "@/components/main/headers/DesktopHeader.vue"
    import { useI18n } from "vue-i18n"
    useI18n()

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
        "Se revyen 🎭",
        "Hvem er Haakon Børs Lind ❓",
        "Det gyldne integral ∫",
        "'As the young people say this is Skibidi' 6️⃣7️⃣",
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
                    link: "/styret",
                },
                {
                    text: "undergrupper",
                    link: "/undergrupper",
                },
                {
                    text: "nabladet",
                    link: "/nabladet",
                },
                {
                    text: "skråttcast",
                    link: "/skraattcast",
                },
                {
                    text: "kjelleren",
                    link: "/kjelleren",
                },
                {
                    text: "kontakt",
                    link: "/kontakt",
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
                {
                    text: "eureka",
                    link: "/eureka",
                },
            ],
        },
        {
            text: "wiki",
            link: "/wiki",
            dropdownItems: [
                {
                    text: "historie",
                    link: "/wiki/historie",
                },
                {
                    text: "fag",
                    link: "/fag",
                },
            ],
        },
    ]
</script>

<template>
    <!-- Show mobile header up until size small  -->
    <MobileHeader class="block s:hidden" :header-items="headerItems" />
    <!-- At greater sizes show desktop header -->
    <DesktopHeader
        class="hidden s:block"
        :header-items="headerItems"
        :quotes="quotes"
    />
</template>

<!-- Setting a global scope for desktop and mobile headers to see these -->
<i18n lang="yaml" global="true">
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
    kontakt: Kontakt
    arrangement: Arrangement
    bedpres: BedPres
    regelmessig: Regelmessige
    jobb: Jobbannonser
    eureka: Eureka
    wiki: Wiki
    historie: Historie
    fag: Emner
    logg-inn: "Logg inn"

en:
    om-nabla: About Nabla
    kalender: Calendar
    karriere: Career
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
    eureka: Eureka
    wiki: Wiki
    historie: History
    fag: Subjects
    logg-inn: "Log in"
</i18n>
