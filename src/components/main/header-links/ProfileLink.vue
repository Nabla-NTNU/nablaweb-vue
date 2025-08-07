<script setup lang="ts">
    import LoginCard from "@/components/general/LoginCard.vue"

    import { ref } from "vue"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { useAuth } from "@/composables/useAuth"
    const { isAuthenticated, signOut, profilePicture, isAdmin } = useAuth()
    const dropdownIsVisible = ref(false)

    async function handleSignOut() {
        dropdownIsVisible.value = false
        await signOut()
    }
</script>

<template>
    <div
        class="relative mx-2"
        @mouseenter="
            () => {
                if (isAuthenticated && !dropdownIsVisible) {
                    dropdownIsVisible = true
                }
            }
        "
    >
        <div
            class="mx-2 h-header w-header content-center"
            @click="dropdownIsVisible = true"
        >
            <div
                class="flex h-4/5 w-4/5 overflow-hidden rounded-full border-2 border-white bg-primary-dark fill-white transition duration-200 hover:border-primary-light hover:fill-secondary"
                @click="() => (dropdownIsVisible = !dropdownIsVisible)"
            >
                <svg
                    v-if="!isAuthenticated"
                    class="h-[65px]"
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
                <img v-else :src="profilePicture?.href" />
            </div>
        </div>

        <!-- Unauthenticated -->
        <transition
            v-if="!isAuthenticated"
            enter-from-class="translate-y-[-120%]"
            leave-to-class="translate-y-[-120%]"
            enter-active-class="transition duration-300"
            leave-active-class="transition duration-300"
        >
            <div
                v-if="dropdownIsVisible"
                class="absolute right-4 top-20 -z-10 w-[512px] origin-top-right rounded-[10px] border-2 border-primary-light bg-neutralish p-4"
                @mouseleave="dropdownIsVisible = false"
            >
                <LoginCard class="w-full" />
            </div>
        </transition>

        <!-- User menu -->
        <transition
            v-if="isAuthenticated"
            enter-from-class="translate-y-[-150%] opacity-[0]"
            leave-to-class="translate-y-[-150%] opacity-[0]"
            enter-active-class="transition duration-300"
            leave-active-class="transition duration-300"
        >
            <div
                v-if="dropdownIsVisible"
                class="absolute -right-2 top-[100%] -z-10 flex flex-col content-center rounded-b-[30px] bg-primary px-2 pb-2 text-center text-fg"
                @mouseleave="dropdownIsVisible = false"
            >
                <router-link
                    to="/profil"
                    class="whitespace-nowrap rounded-full border-2 border-transparent bg-primary px-4 py-2 text-white shadow-[20px] transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
                >
                    {{ t("profil") }}
                </router-link>

                <router-link
                    to="/golf"
                    class="whitespace-nowrap rounded-full border-2 border-transparent bg-primary px-4 py-2 text-white shadow-[20px] transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
                >
                    {{ t("kodegolf") }}
                </router-link>

                <!-- Those who have the right to request funding should see it here -->
                <router-link
                    v-if="isAdmin == true"
                    to="/refusjon"
                    class="whitespace-nowrap rounded-full border-2 border-transparent px-4 py-2 text-white shadow-[20px] transition-all duration-200 hover:border-green-light hover:bg-green-dark hover:text-secondary-light"
                >
                    {{ t("refusjon") }}
                </router-link>

                <!-- User admin. Every other kind of admin should be *on their respective pages* -->
                <router-link
                    v-if="isAdmin == true"
                    to="/admin"
                    class="whitespace-nowrap rounded-full border-2 border-transparent px-4 py-2 text-white shadow-[20px] transition-all duration-200 hover:border-warning-light hover:bg-warning-dark hover:text-secondary-light"
                >
                    {{ t("admin") }}
                </router-link>

                <!-- Would be nice to have a *privacy-preserving* dashboard to see health of Hemmer, supabase, etc -->
                <router-link
                    v-if="isAdmin == true"
                    to="/dashboard"
                    class="whitespace-nowrap rounded-full border-2 border-transparent px-4 py-2 text-white shadow-[20px] transition-all duration-200 hover:border-warning-light hover:bg-warning-dark hover:text-secondary-light"
                >
                    Dashboard
                </router-link>
                <!-- Some others to consider: We need a place to put the fadderuke control panel, and the votes. This could be a good spot! -->

                <hr class="bg-primary-darker my-2" />

                <!-- And an easy-to-reach logout button -->
                <button
                    class="whitespace-nowrap rounded-full border-2 border-transparent bg-red px-4 py-2 text-white shadow-[20px] transition-all duration-200 hover:border-red-light hover:bg-red-dark hover:text-secondary-light"
                    @click="handleSignOut"
                >
                    {{ t("logg-ut") }}
                </button>
            </div>
        </transition>
    </div>
</template>

<i18n lang="yaml">
nb:
    profil: "Profil"
    kodegolf: "Kodegolf"
    refusjon: "Refusjon"
    admin: "Adminpanel"
    logg-ut: "Logg ut"
en:
    profil: "Profile"
    kodegolf: "Code golf"
    refusjon: "Reimbursements"
    admin: "User Admin"
    logg-ut: "Sign out"
</i18n>
