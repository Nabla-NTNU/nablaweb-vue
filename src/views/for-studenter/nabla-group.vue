<script setup>
    import { onMounted } from 'vue';
    import { getGroupDetails } from '../../lib/db/db';
    import UserCard from './../../components/UIUtils/UserCard.vue';
    import { useRoute, useRouter } from 'vue-router';
    import { ref } from 'vue'

    const route = useRoute();
    const router = useRouter();
    const groupURL = route.params.id;

    const nablaGroup = ref({})
    const mailtoLink = ref("");

    onMounted(async () => {
        nablaGroup.value = await getGroupDetails(groupURL)
        if (nablaGroup.value == null) {
            console.log('hi')
            router.push('/404')
        }
        mailtoLink.value = `mailto:${nablaGroup.value.groupMail}`
    })
</script>

<template>
    <div class="flex w-full flex-grow flex-col">
        <img class = "object-fit: w-full object-cover" :src='nablaGroup.groupImage' alt="Flotte folk">
        <div class="mx-auto flex w-full px-4 sm:px-6 lg:px-8 max-w-[1200px] py-10">
            <div class="flex-1 pr-6">
                
                <h1 class="group flex items-center font-semibold tracking-tight text-title-2 mb-4">
                    {{ nablaGroup.groupName }}
                </h1>
                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    <a :href="mailtoLink"> {{ nablaGroup.groupMail }}</a>
                </h2>
                {{ nablaGroup.about }}

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