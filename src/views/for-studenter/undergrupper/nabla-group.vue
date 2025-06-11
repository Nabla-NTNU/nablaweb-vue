<script setup lang="ts">
    import { useRoute, useRouter, RouterLink } from 'vue-router'
    import { computed, onMounted } from 'vue'
    import markdownit from 'markdown-it'
    import { useI18n } from 'vue-i18n'
    const { t } = useI18n()

    import { useGroup } from '@/composables/useNablaGroup'
    import { useAuth } from '@/composables/useAuth'
    import UserCard from '@/components/general/user-card.vue'

    const route = useRoute()
    const router = useRouter()
    const groupID = route.params.id as string
    const md = markdownit()
    
    const { group, loading, error } = useGroup(groupID)
    const { user, username, isLoading, isAuthenticated } = useAuth()

    const userIsAdmin = computed(() => {
        if (group.value.leader) {
            if (group.value.leader.user.username === username.value) {
                return true
            }
        }
        if (username.value === 'admin') {
            return true
        }
    })
</script>

<template>
    <div class="flex w-full flex-grow flex-col" v-if="!loading">
        <img class = "object-fit: w-full object-cover" :src='group.groupPhoto?.href' alt="Flotte folk">
        <div class="mx-auto flex w-full px-4 sm:px-6 lg:px-8 max-w-[1200px] py-10">
            <div class="flex-1 pr-6">
                <div class="flex flex-row mb-4">
                    <h1 class="grow font-semibold tracking-tight text-title-2">
                        {{ group.name }}
                    </h1>
                    <RouterLink :to="`/for-komponenter/komiteer/${groupID}/admin`" v-if="userIsAdmin" class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary text-center" style="white-space: pre-line;">
                        {{ t('adminpanel') }}
                    </RouterLink>
                </div>
                <h2 class=" font-semibold tracking-tight text-subtitle-2 mb-4" v-if="group.mailList">
                    <a :href="`mailto:${group.mailList}`"> {{ group.mailList }}</a>
                </h2>
                
                <article class="flex-1 reset-tailwind" v-html='md.render(group.about)' v-if='group.about'></article>

                <div v-if="group.members">
                    <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                        {{ t('medlemmer') }}:
                    </h2>
                    <div class="flex flex-wrap justify-center gap-6">
                        <UserCard
                            v-for="groupMember in group.members"
                                :key="groupMember.user.username"
                                :username="groupMember.user.username"
                                :firstName="groupMember.user.firstName"
                                :lastName="groupMember.user.lastName"
                                :profilePicture="groupMember.user.profilePicture"
                                :memberRole="groupMember.role"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
    nb:
        adminpanel : "Hemmelige Saker \n (Adminpanel)"
        medlemmer: Medlemmer
    en:
        adminpanel: "Secret Button \n (Admin page)"
        medlemmer: Members
</i18n>
