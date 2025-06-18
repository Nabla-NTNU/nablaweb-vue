<script setup lang="ts">
    import { ref } from "vue"
    import LoginCard from "@/components/general/LoginCard.vue"
    import { useAuth } from "@/composables/useAuth"

    const { isAuthenticated } = useAuth()

    const isVisible = ref(false)
</script>

<template>
    <div class="relative">
        <div class="h-header w-header content-center" @click="isVisible = true">
            <div
                class="flex h-4/5 w-4/5 overflow-hidden rounded-full border-2 border-primary bg-primary-dark fill-white transition duration-200 hover:border-primary-light hover:fill-secondary"
                @click="isVisible = !isVisible"
            >
                <svg
                    v-if="!isAuthenticated"
                    class="h-header w-header content-center align-middle"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill-rule="evenodd"
                        d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                        clip-rule="evenodd"
                    />
                </svg>
            </div>
        </div>

        <transition
            enter-from-class="translate-y-[-120%]"
            leave-to-class="translate-y-[-120%]"
            enter-active-class="transition duration-300"
            leave-active-class="transition duration-300"
            leave-from-class="translate-y-0"
            enter-to-class="translate-y-0"
        >
            <div
                v-if="isVisible"
                class="absolute right-4 top-20 -z-10 w-[512px] origin-top-right rounded-[10px] border-2 border-primary-light bg-neutralish p-4"
                @mouseleave="isVisible = false"
            >
                <LoginCard v-if="!isAuthenticated" class="w-full" />
                <div v-else class="text-fg">
                    <router-link :to="'/profil'"> Profil </router-link>
                </div>
            </div>
        </transition>
    </div>

    <!-- If logged in -->
    <!-- If not logged in () -->
    <!-- Both (loan) -->
</template>
