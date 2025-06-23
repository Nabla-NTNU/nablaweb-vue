<script setup lang="ts">
    import { ref, onMounted } from "vue"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    const mobileNavVisible = ref(false)

    document.addEventListener("DOMContentLoaded", () => {
        const dropdownBox = document.getElementById("dropdown-box")
        const headerItems = document.querySelectorAll("nav .group")
        let isDropdownActive = false // Track if dropdown is visible
        let previousItem = null // Track the previously hovered item

        const dropdownData = {
            om: [
                {
                    to: "/om/nabla",
                    text: "Om Oss",
                    description: "Hva er Nabla?",
                },
                { to: "/om/fond", text: "Nablas fond", description: "Fond?" },
                { to: "/om/forretningsorden", text: "Om forretningsorden" },
                {
                    to: "/om/lover-og-forskrifter",
                    text: "Nablas lover",
                    description: "Våre lover og forskrifter",
                },
                { to: "/om/retningslinjer", text: "Våre retningslinjer" },
                {
                    to: "/om/stillingsbeskrivelser",
                    text: "Stillingsbeskrivelser",
                    description: "Om styrestillinger",
                },
                { to: "/om/tillitsvalgte", text: "Tillitsvalgte" },
            ],
            "for-komponenter": [
                { to: "/for-komponenter/arrangementer", text: "Arrangementer" },
                { to: "/for-komponenter/blogg", text: "Blogg" },
                {
                    to: "/for-komponenter/faglig-innhold",
                    text: "Faglig innhold",
                },
                {
                    to: "/for-komponenter/interessegrupper",
                    text: "Interessegrupper",
                },
                { to: "/for-komponenter/kjellern", text: "Kjellern" },
                { to: "/for-komponenter/komiteer", text: "Komiteer" },
                { to: "/for-komponenter/kontakt", text: "Kontakt" },
                { to: "/for-komponenter/motereferater", text: "Møtereferater" },
                {
                    to: "/for-komponenter/okonomisk-stotte",
                    text: "Økonomisk støtte",
                },
                {
                    to: "/for-komponenter/stillingsannonser",
                    text: "Stillingsannonser",
                },
                { to: "/for-komponenter/styret", text: "Styret" },
                { to: "/for-komponenter/tjenester", text: "Våre tjenester" },
                { to: "/for-komponenter/utleggsskjema", text: "Utleggsskjema" },
                { to: "/for-komponenter/varsling", text: "Varsling" },
            ],
            "for-bedrifter": [
                { to: "/for-bedrifter/bedriftsbesok", text: "Bedriftsbesok" },
                {
                    to: "/for-bedrifter/bedriftspresentasjon",
                    text: "Bedriftspresentasjon",
                },
                { to: "/for-bedrifter/eureka", text: "Eureka" },
                { to: "/for-bedrifter/kurs", text: "Kurs" },
                {
                    to: "/for-bedrifter/screeningintervju",
                    text: "Screeningintervju",
                },
                {
                    to: "/for-bedrifter/stillingsannonse",
                    text: "Stillingsannonse",
                },
            ],
        }

        headerItems.forEach((item) => {
            const contentKey = item.dataset.dropdownContent
            dropdownBox.style.opacity = "0"
            dropdownBox.style.visibility = "hidden"

            item.addEventListener("mouseenter", () => {
                const boundingRect = item.getBoundingClientRect()
                const links = dropdownData[contentKey] || []
                const grid = dropdownBox.querySelector(".grid")
                grid.innerHTML = "" // Clear any existing content

                links.forEach((link) => {
                    const routerLink = document.createElement("router-link") // Create router-link element
                    routerLink.setAttribute("to", link.to) // Set the 'to' attribute
                    routerLink.className =
                        "p-2 transition ease-in-out duration-200 text-gray-darker font-semibold hover:text-primary-600 cursor-pointer" // Add classes and pointer cursor

                    routerLink.textContent = link.text // Set the link text

                    // If there's a description, create a paragraph element
                    if (link.description) {
                        const description = document.createElement("p")
                        description.className = "text-gray-dark font-normal"
                        description.textContent = link.description
                        routerLink.appendChild(description) // Append the description to the link
                    }

                    grid.appendChild(routerLink) // Append the link to the grid
                })

                dropdownBox.style.display = "none" // Hide to measure width
                dropdownBox.style.display = "" // Show again to measure

                const dropdownWidth = 560

                if (previousItem !== null) {
                    const previousRect = previousItem.getBoundingClientRect()

                    dropdownBox.style.left = `${dropdownBox.offsetLeft + boundingRect.left + boundingRect.width / 2 - previousRect.left - previousRect.width / 2}px` // Update left position
                    dropdownBox.style.width = `${dropdownWidth}px` // Update width
                    dropdownBox.style.transition =
                        "left 0.3s ease, width 0.3s ease" // Add transition for smooth movement
                } else {
                    dropdownBox.style.left = `${boundingRect.left + boundingRect.width / 2 - dropdownWidth / 2}px`
                    dropdownBox.style.width = `${dropdownWidth}px`
                    dropdownBox.style.opacity = "1"
                    dropdownBox.style.visibility = "visible"
                    dropdownBox.style.transition =
                        "opacity 0.5s ease, visibility 0.5s ease"
                }

                // Update the previous hovered item
                previousItem = item
                isDropdownActive = true
            })

            item.addEventListener("mouseleave", () => {
                isDropdownActive = false
                checkDropdownVisibility()
            })
        })

        dropdownBox.addEventListener("mouseenter", () => {
            isDropdownActive = true // Keep the dropdown active
        })

        dropdownBox.addEventListener("mouseleave", () => {
            isDropdownActive = false // Will check visibility
            checkDropdownVisibility()
        })

        function checkDropdownVisibility() {
            setTimeout(() => {
                if (!isDropdownActive) {
                    dropdownBox.style.opacity = "0"
                    dropdownBox.style.visibility = "hidden"
                    previousItem = null // Reset previous item on hide
                }
            }, 300) // Delay to give smooth transition effect
        }
    })

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

    function generateQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length)
        currentQuote.value = quotes[randomIndex]
    }

    onMounted(() => {
        generateQuote()
    })
</script>

<template>
    <header
        class="top-0 sticky h-header grid-rows-1 content-center bg-primary font-poppins text-title-6 text-gray-25 transition duration-300 ease-in-out"
    >
        <div class="flex items-center justify-between pl-4 pr-6">
            <!-- Tips & tricks -->
            <div
                v-if="!mobileNavVisible"
                class="absolute -bottom-6 left-14 rounded-ee-xl rounded-es-xl rounded-se-xl border-2 border-primary-400 bg-primary-800 px-2 py-1 font-zilla text-s font-semibold tracking-[0.5px]"
            >
                {{ currentQuote }}
            </div>

            <!-- Logo -->
            <router-link to="/">
                <img
                    class="h-12 w-12"
                    src="../assets/images/nabla.svg"
                    alt="logo"
                />
            </router-link>

            <!-- Links in header: desktop -->
            <nav class="hidden items-center m:flex">
                <div class="group" data-dropdown-content="om">
                    <router-link to="/om" class="content-center pr-4">
                        {{ t("om-nabla") }}
                    </router-link>
                </div>
                <div class="group" data-dropdown-content="for-komponenter">
                    <router-link
                        to="/for-komponenter"
                        class="content-center px-4"
                    >
                        {{ t("for-komponenter") }}
                    </router-link>
                </div>
                <div class="group" data-dropdown-content="for-bedrifter">
                    <router-link
                        to="/for-bedrifter"
                        class="content-center px-4"
                    >
                        {{ t("for-bedrifter") }}
                    </router-link>
                </div>
                <router-link to="/ny-student" class="content-center pl-4 pr-3">
                    {{ t("ny-student") }}
                </router-link>
                <router-link to="/profil">
                    <img
                        class="h-8 w-8"
                        src="../assets/images/profile.svg"
                        alt="profil"
                    />
                </router-link>
            </nav>
            <button
                class="hover:text-secondary m:hidden"
                @click="mobileNavVisible = !mobileNavVisible"
            >
                nav
            </button>
        </div>
        <div
            id="dropdown-box"
            class="z-1 invisible absolute top-full w-full opacity-0 transition-all duration-300 ease-in-out"
        >
            <div
                class="relative grid grid-cols-2 gap-4 rounded-[8px] bg-neutralish p-6 font-poppins text-m"
            >
                <!-- Content dynamically populated -->
            </div>
        </div>

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
