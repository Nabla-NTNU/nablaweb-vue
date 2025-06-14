<script setup lang="ts">
    import { useRoute, RouterLink } from "vue-router"
    import { computed } from "vue"
    import markdownit from "markdown-it"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { useGroup } from "@/composables/useNablaGroup"
    import { useAuth } from "@/composables/useAuth"
    import UserCard from "@/components/general/user-card.vue"

    const route = useRoute()
    const groupID = route.params.id as string
    const md = markdownit()

    // Both useGroup and useAuth have loading and error refs that can be presented to user
    const { group, loading } = useGroup(groupID)
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
</script>

<template>
    <div v-if="!loading" class="flex w-full flex-grow flex-col">
        <img
            class="object-fit: w-full object-cover"
            :src="group.groupPhoto?.href"
            alt="Flotte folk"
        />
        <div
            class="sm:px-6 lg:px-8 mx-auto flex w-full max-w-[1200px] px-4 py-10"
        >
            <div class="flex-1 pr-6">
                <div class="mb-4 flex flex-row">
                    <h1 class="grow text-title-2 font-semibold tracking-tight">
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
                            :profile-picture="groupMember.user.profilePicture"
                            :member-role="groupMember.role"
                        />
                    </div>
                </div>
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
