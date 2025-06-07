<script setup>
    import { useRoute, useRouter, RouterLink } from 'vue-router'
    import { computed } from 'vue'
    import markdownit from 'markdown-it'

    import { useGroup } from '@/composables/useNablaGroup'
    import { useAuth } from '@/composables/useAuth'
    import UserCard from '@/components/general/user-card.vue'

    const route = useRoute()
    const router = useRouter()
    const groupID = route.params.id
    const md = markdownit()
    
    const { group: nablaGroup, loading, error } = useGroup(groupID)
    const { user, username, isLoading, isAuthenticated } = useAuth()

    const userIsAdmin = computed(() => {
        if (nablaGroup.value.leader) {
            if (nablaGroup.value.leader === username.value) {
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
        <img class = "object-fit: w-full object-cover" :src='nablaGroup.image' alt="Flotte folk">
        <div class="mx-auto flex w-full px-4 sm:px-6 lg:px-8 max-w-[1200px] py-10">
            <div class="flex-1 pr-6">
                <div class="flex flex-row mb-4">
                    <h1 class="grow font-semibold tracking-tight text-title-2">
                        {{ nablaGroup.name }}
                    </h1>
                    <RouterLink :to="`/for-komponenter/komiteer/${groupID}/admin`" v-if="userIsAdmin" class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary text-center">
                        Hemmelige Saker <br> (Adminpanel)
                    </RouterLink>
                </div>
                <h2 class=" font-semibold tracking-tight text-subtitle-2 mb-4" v-if="nablaGroup.mailList">
                    <a :href="`mailto:${nablaGroup.mailList}`"> {{ nablaGroup.mailList }}</a>
                </h2>
                
                <article class="flex-1 reset-tailwind" v-html='md.render(nablaGroup.about)' v-if='nablaGroup.about'></article>

                <div v-if="nablaGroup.members">
                    <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                        Medlemmer:
                    </h2>
                    <div class="flex flex-wrap justify-center gap-6">
                        <UserCard
                            v-for="groupMember in nablaGroup.members"
                                :key="groupMember.username"
                                :userName="groupMember.username"
                                :firstName="groupMember.firstName"
                                :lastName="groupMember.lastName"
                                :profilePicture="groupMember.profilePicture"
                                :memberRole="groupMember.role"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>