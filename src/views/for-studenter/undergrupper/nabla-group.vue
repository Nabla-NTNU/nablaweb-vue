<script setup lang="ts">
    import { useRoute, RouterLink } from "vue-router"
    import { computed } from "vue"
    import markdownit from "markdown-it"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { useGroup, useGroups } from "@/composables/useNablaGroup"
    import { useAuth } from "@/composables/useAuth"
    import UserCard from "@/components/general/user-card.vue"
    // import GroupCard from '@/components/group-page/group-card.vue' // implement for big screens

    const route = useRoute()
    const groupID = route.params.id as string
    const md = markdownit()

    // Both useGroup and useAuth have loading and error refs that can be presented to user
    const { group, loading } = useGroup(groupID)
    const { groups } = useGroups()

    const { username } = useAuth()

    const userIsAdmin = computed(() => {
        if (group.value.leader) {
            if (group.value.leader.user.username === username.value) {
                return true
            }
        }
        if (username.value === "admin") {
            return true
        }
        return false
    })

    // const photoLoaded = ref(false)
</script>

<template>
    <!-- Photos take a while to load. Would be nice to show a pulsating svg while photoLoaded is false.-->
    <div class="mx-auto 2xl:flex">
        <div v-if="!loading" class="flex max-w-[1440px] flex-grow flex-col">
            <img
                onload="//photoLoaded = true"
                :src="group.groupPhoto?.href"
                alt="Bilde av medlemmene i gruppen"
            />
            <div
                class="sm:px-6 lg:px-8 mx-auto flex w-full max-w-[1440px] px-4 py-10"
            >
                <div class="flex-1 pr-6">
                    <div class="mb-4 flex flex-row">
                        <h1
                            class="grow text-title-2 font-semibold tracking-tight"
                        >
                            {{ group.name }}
                        </h1>
                        <RouterLink
                            v-if="userIsAdmin"
                            aria-label="Adminpanel"
                            :to="`/for-komponenter/komiteer/${groupID}/admin`"
                            class="rounded-lg bg-primary px-4 py-2 text-center font-semibold text-white transition-all duration-300"
                            style="white-space: pre-line"
                        >
                            {{ t("adminpanel") }}
                        </RouterLink>
                    </div>
                    <h2
                        v-if="group.mailList"
                        class="mb-4 text-subtitle-2 font-semibold tracking-tight"
                    >
                        <a :href="`mailto:${group.mailList}`">
                            {{ group.mailList }}</a
                        >
                    </h2>

                    <article
                        v-if="group.about"
                        class="reset-tailwind flex-1"
                        v-html="md.render(group.about)"
                    ></article>

                    <div v-if="group.members">
                        <h2
                            class="group mb-4 flex items-center text-subtitle-2 font-semibold tracking-tight"
                        >
                            {{ t("medlemmer") }}:
                        </h2>
                        <div class="flex flex-wrap justify-center gap-6">
                            <UserCard
                                v-for="groupMember in group.members"
                                :key="groupMember.user.username"
                                :username="groupMember.user.username"
                                :first-name="groupMember.user.firstName"
                                :last-name="groupMember.user.lastName"
                                :profile-picture="
                                    groupMember.user.profilePicture
                                "
                                :member-role="groupMember.role"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="max-w-5 m-8">
            <h1 class="text-subtitle-4 font-semibold tracking-tight">
                Komiteer:
            </h1>
            <h1 class="text-subtitle-4 font-semibold tracking-tight">
                Undergrupper:
            </h1>
            <!-- Not complete cause it's past midnight now -->
            <div class="flex flex-wrap justify-center gap-6">
                <ul>
                    <li v-for="groupListed in groups" :key="groupListed.id">
                        <RouterLink
                            v-if="groupListed.id"
                            :to="`/for-komponenter/komiteer/${groupListed.id}`"
                        >
                            {{ groupListed.name }}
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
nb:
    adminpanel: "Hemmelige Saker \n (Adminpanel)"
    medlemmer: Medlemmer
en:
    adminpanel: "Secret Button \n (Admin page)"
    medlemmer: Members
</i18n>
