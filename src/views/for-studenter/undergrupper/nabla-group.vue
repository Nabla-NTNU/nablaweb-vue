<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter, RouterLink } from 'vue-router';
    import markdownit from 'markdown-it'

    import { getGroupDetails } from '@/lib/db/db';
    import { useAuth } from '@/composables/useAuth';
    import UserCard from '@/components/UIUtils/UserCard.vue';


    const route = useRoute();
    const router = useRouter();
    const groupURL = route.params.id;

    const nablaGroup = ref({})
    const mailtoLink = ref("");
    const md = markdownit()

    onMounted(async () => {
        nablaGroup.value = await getGroupDetails(groupURL)
        if (nablaGroup.value == null) {
            router.push('/404')
        }
        mailtoLink.value = `mailto:${nablaGroup.value.groupMail}`
    })
  const { user, isLoading, isAuthenticated } = useAuth()
</script>

<template>
    <div class="flex w-full flex-grow flex-col">
        <img class = "object-fit: w-full object-cover" :src='nablaGroup.groupImage' alt="Flotte folk">
        <div class="mx-auto flex w-full px-4 sm:px-6 lg:px-8 max-w-[1200px] py-10">
            <div class="flex-1 pr-6">
                <div class="flex flex-row mb-4">
                    <h1 class="grow font-semibold tracking-tight text-title-2">
                        {{ nablaGroup.groupName }}    
                    </h1>
                    <RouterLink :to="`${groupURL}/admin`" v-if="isAuthenticated" class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary text-center">
                        Hemmelige Saker <br> (Adminpanel)
                    </RouterLink>
                </div>
                <h2 class=" font-semibold tracking-tight text-subtitle-2 mb-4">
                    <a :href="mailtoLink"> {{ nablaGroup.groupMail }}</a>
                </h2>
                
                <article class="flex-1 reset-tailwind" v-html='md.render(nablaGroup.about)' v-if='nablaGroup.about'></article>

                <div v-if="nablaGroup.members">
                    <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                        Medlemmer:
                    </h2>
                    <div class="flex flex-wrap justify-center gap-6">
                        <UserCard
                            v-for="nablaUser in nablaGroup.members"
                                :key="nablaUser.username"
                                :userName="nablaUser.username"
                                :firstName="nablaUser.firstName"
                                :lastName="nablaUser.lastName"
                                :profilePicture="nablaUser.profilePicture"
                                :memberRole="nablaUser.memberRole"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>