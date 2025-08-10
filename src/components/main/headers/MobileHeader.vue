<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue"
    import { useI18n } from "vue-i18n"
    import NablaLogo from "@/components/main/header-links/ReturnLink.vue"
    import ProfileLink from "@/components/main/header-links/ProfileLink.vue"
    const { t } = useI18n()

    const mobileNavVisible = ref(false)

    defineProps<{
        headerItems: HeaderItem[]
    }>()

    type HeaderItem = {
        text: string
        link: string
        // Could be recursive, but multiple dropdown layers is bad UX
        dropdownItems?: {
            text: string
            link: string
        }[]
    }

    // Keep track of link by the URL it sends to, as this is unique
    const focusedLink = ref<string | null>(null)
    const isTouch = ref(false)

    onMounted(() => {
        // Logic to detect presses to close all dropdowns. AI-GENERATED
        isTouch.value = window.matchMedia("(hover: none)").matches
        const handleClickOutside = (e: MouseEvent) => {
            if (!isTouch.value || !focusedLink.value) return

            const target = e.target as HTMLElement
            // Skip if click happened inside any dropdown or navigation
            if (target.closest(".navigation-link")) return

            // Otherwise, click was outside — reset
            focusedLink.value = null
        }

        document.addEventListener("click", handleClickOutside)
        onBeforeUnmount(() => {
            document.removeEventListener("click", handleClickOutside)
        })
    })
</script>

<template>
    <header
        class="top-0 h-max-header sticky z-10 h-header grid-rows-1 content-center font-poppins text-title-6 text-gray-25"
    >
        <div
            class="reltive flex w-screen items-center transition duration-300 ease-in-out"
        >
            <!-- Toggle for stuff -->
            <button
                class="mx-2 h-header w-header px-4 hover:text-secondary"
                @click="mobileNavVisible = !mobileNavVisible"
            >
                <svg
                    class="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        d="M1 1h15M1 7h15M1 13h15"
                    />
                </svg>
            </button>
            <!-- Logo -->
            <div class="h-header w-header flex-grow content-center">
                <router-link class="h-header w-header" to="/">
                    <NablaLogo
                        class="m-auto h-4/5 w-4/5 fill-secondary transition-all duration-200 hover:fill-secondary-dark"
                    />
                </router-link>
            </div>
            <div class="mx-2 w-header">
                <ProfileLink
                    class="h-header w-header"
                    :is-focused="false"
                    @mouseenter="focusedLink = '/profile'"
                    @mouseleave="focusedLink = null"
                />
            </div>
        </div>
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
                class="flex w-full flex-col bg-primary-dark pt-[1px] text-center font-poppins text-title-6 text-gray-25"
            >
                <div v-for="item in headerItems" :key="item.link" class="">
                    <div
                        class="w-fill h-fill my-[1px] flex bg-primary transition duration-300 hover:bg-primary-dark hover:text-secondary"
                    >
                        <router-link
                            :to="item.link"
                            class="h-full w-full py-2"
                            @click="mobileNavVisible = false"
                        >
                            {{ t(item.text) }}
                        </router-link>
                    </div>
                </div>
                <div
                    class="w-fill h-fill my-[1px] flex bg-primary py-2 transition duration-300 hover:bg-primary-dark hover:text-secondary"
                >
                    <router-link
                        to="/login"
                        class="h-full w-full"
                        @click="mobileNavVisible = false"
                    >
                        {{ t("logg-inn") }}
                    </router-link>
                </div>
            </nav>
        </Transition>
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
    nabladet: Nabladet
    skråttcast: Skråttcast
    kjelleren: Kjelleren
    kontakt: Kontakt og varsling
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
