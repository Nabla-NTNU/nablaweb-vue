<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from "vue"
    import { useI18n } from "vue-i18n"
    import NablaLogo from "@/components/main/header-links/ReturnLink.vue"
    import ProfileLink from "@/components/main/header-links/ProfileLink.vue"

    // Global scope to translate from NablaHeader.vue
    const { t } = useI18n({ useScope: "global" })

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

    onMounted(() => {
        // Logic to detect presses to close all dropdowns. AI-GENERATED
        const handleClickOutside = (e: MouseEvent) => {
            if (!mobileNavVisible.value) return

            const target = e.target as HTMLElement
            // Skip if click happened inside any dropdown or navigation
            if (target.closest(".router-link") || target.closest("button"))
                return

            // Otherwise, click was outside — reset
            focusedLink.value = null
            mobileNavVisible.value = false
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
            class="reltive flex h-header w-screen items-center transition duration-300 ease-in-out"
        >
            <!-- Toggle for stuff -->
            <button
                class="mx-2 h-4/5 w-header rounded-full px-4 duration-300 hover:bg-primary-dark hover:text-secondary"
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
                <ProfileLink class="h-header w-header" :is-focused="false" />
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
