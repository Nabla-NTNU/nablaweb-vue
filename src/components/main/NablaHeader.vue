<script setup lang="ts">
    import { ref, onMounted } from "vue"
    // import { useI18n } from "vue-i18n"
    import NablaLogo from "./NablaLogo.vue"
    import NablaNavLink from "./NablaNavLink.vue"
    import NablaProfileLink from "./NablaProfileLink.vue"
    // const { t } = useI18n()

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

    const currentQuote = ref("")

    onMounted(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length)
        currentQuote.value = quotes[randomIndex]
    })
</script>

<template>
    <header
        class="top-0 h-max-header sticky h-header grid-rows-1 content-center bg-primary font-poppins text-title-6 text-gray-25 transition duration-300 ease-in-out"
    >
        <div class="flex flex-row items-center justify-between pl-4 pr-6">
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
            <nav v-if="!mobileNavVisible" class="hidden flex-row m:flex">
                <NablaNavLink link-text="Om nabla" link-to="/om-nabla" />
                <NablaNavLink link-text="Kalender" link-to="/kalender" />
                <NablaNavLink link-text="Karriere" link-to="/karriere" />
                <NablaNavLink link-text="Wiki" link-to="/wiki" />
                <NablaNavLink
                    link-text="For Bedrifter"
                    link-to="/for-bedrifter"
                />
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
    for-komponenter: For Komponenter
    for-bedrifter: For Bedrifter
    ny-student: Ny student?
    profil: Profil/pålogging
    undergrupper: Undergrupper
en:
    om-nabla: About Nabla
    for-komponenter: For Members
    for-bedrifter: For Businesses
    ny-student: New student?
    profil: Profile/login
    undergrupper: Subgroups
</i18n>
