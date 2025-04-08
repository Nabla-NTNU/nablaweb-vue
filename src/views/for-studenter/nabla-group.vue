<script setup>
    import { onMounted } from 'vue';
    import { get_group_members } from '../../lib/db/db';
    import UserCard from './../../components/UIUtils/UserCard.vue';
    import { useRoute } from 'vue-router';
    import { ref } from 'vue'

    
    const route = useRoute();
    const committeeRouteName = route.params.id;

    const nablaGroupMembers = ref([])

    onMounted(async () => {
        nablaGroupMembers.value = await get_group_members("webkom@nabla.no")
    })
</script>

<template>
    <div class="flex w-full flex-grow flex-col">
        <img class = "object-fit: w-full object-cover" src="https://nabla.no/media/uploads/content/nabla_under_gruppe_foto-004.jpg" alt="Flotte folk">
        <div class="mx-auto flex w-full px-4 sm:px-6 lg:px-8 max-w-[1200px] py-10">
            <div class="flex-1 pr-6">
                <h1 class="group flex items-center font-semibold tracking-tight text-title-2 mb-4">
                    WebKom!
                </h1>
                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    <a href="mailto:webkom@nabla.no">webkom@nabla.no</a>
                </h2>
                Webkomitéen er ansvarlig for Nablas hjemmeside og servere. Denne hardtarbeidende, kjærlige og sosiale bedriften har ukentlige møter/kodekvelder. Oppdager du en feil eller skulle ønske det var en ny funksjon på nabla.no er det bare å ta kontakt med webkomitéen på webkom@nabla.no eller websjef@nabla.no om du kun ønsker websjefens oppmerksomhet.
                <h1 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Medlemmer:
                </h1>
                <div class="flex flex-wrap justify-center gap-6">
                    <UserCard
                        v-for="nablaUser in nablaGroupMembers"
                            :key="nablaUser.school_email"
                            :school_email="nablaUser.school_email"
                            :first_name="nablaUser.first_name"
                            :last_name="nablaUser.last_name"
                            :member_role="nablaUser.member_role"
                            :profile_picture="nablaUser.profile_picture"
                    />
                </div>
            </div>
        </div>
    </div>
</template>