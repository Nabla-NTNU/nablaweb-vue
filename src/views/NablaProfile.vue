<script setup lang="ts">
    import { useI18n } from "vue-i18n"
    const { locale } = useI18n()

    import { useAuth } from "@/composables/useAuth"
    import LoginCard from "@/components/general/LoginCard.vue"
    import ThemeToggler from "@/components/depricated/ThemeToggle.vue"
    import MobileProfile from "@/components/profile-components/MobileProfile.vue"

    const { isAuthenticated, signOut, username } = useAuth()
</script>

<template>
    <div v-if="isAuthenticated" style="margin: 40pt">
        <MobileProfile v-if="username" :username="username" />

        <button
            class="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="signOut"
        >
            Sign Out
        </button>
    </div>

    <div v-else style="margin: 40pt">
        <LoginCard />
    </div>

    <div class="flex justify-center">
        <button
            class="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="locale == 'nb' ? (locale = 'en') : (locale = 'nb')"
        >
            Switch language
        </button>
    </div>

    <div class="flex items-center justify-center">
        <ThemeToggler />
    </div>
</template>
