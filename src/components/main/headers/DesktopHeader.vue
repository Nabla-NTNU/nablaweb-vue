<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue"
    import { useI18n } from "vue-i18n"
    import NablaLogo from "@/components/main/header-links/ReturnLink.vue"
    import NavigationLink from "@/components/main/header-links/NavigationLink.vue"
    import ProfileLink from "@/components/main/header-links/ProfileLink.vue"

    // Global scope to translate from NablaHeader.vue
    const { t } = useI18n({ useScope: "global" })

    type HeaderItem = {
        text: string
        link: string
        // Could be recursive, but multiple dropdown layers is bad UX
        dropdownItems?: {
            text: string
            link: string
        }[]
    }

    const props = defineProps<{
        headerItems: HeaderItem[]
        quotes: string[]
    }>()

    // Keep track of focused link by the URL it sends to, as this is unique
    const focusedLink = ref<string | null>(null)
    const currentQuote = ref("")
    const isTouch = ref(false)

    onMounted(() => {
        const randomIndex = Math.floor(Math.random() * props.quotes.length)
        currentQuote.value = props.quotes[randomIndex]

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
            class="flex flex-row items-center justify-between bg-primary transition duration-300 ease-in-out"
        >
            <!-- Tips & tricks -->
            <div
                class="absolute -bottom-6 left-14 hidden rounded-ee-xl rounded-es-xl rounded-se-xl border-2 border-primary-400 bg-primary-800 px-2 py-1 font-zilla text-s font-semibold tracking-[0.5px] s:flex"
            >
                {{ currentQuote }}
            </div>

            <!-- Logo -->
            <div class="mx-4 h-header w-screen content-center s:w-header">
                <router-link class="h-header w-header" to="/">
                    <NablaLogo
                        class="m-auto h-4/5 w-4/5 fill-secondary transition-all duration-200 hover:fill-secondary-dark"
                    />
                </router-link>
            </div>

            <!-- Links in header-->
            <nav class="hidden flex-row s:flex">
                <div v-for="item in headerItems" :key="item.link">
                    <NavigationLink
                        class="s:flex"
                        :link-text="t(item.text)"
                        :link-to="item.link"
                        :dropdown-items="
                            item.dropdownItems?.map((item) => {
                                return { text: t(item.text), link: item.link }
                            })
                        "
                        :is-focused="focusedLink === item.link"
                        @mouseenter="focusedLink = item.link"
                        @mouseleave="focusedLink = null"
                    />
                </div>
                <ProfileLink
                    class="h-header w-header"
                    :is-focused="focusedLink == '/profile'"
                    @mouseenter="focusedLink = '/profile'"
                    @mouseleave="focusedLink = null"
                />
            </nav>
        </div>
    </header>
</template>
