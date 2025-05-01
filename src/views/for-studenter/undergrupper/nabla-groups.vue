<script setup>
    import { onMounted } from 'vue';
    import { get_groups } from '@/lib/db/db';
    import GroupCard from '@/components/UIUtils/GroupCard.vue';
    import { ref } from 'vue'
    
    const nablaGroups = ref([])
    const nablaCommittees = ref([])
    const nablaInterestGroups = ref([])
    onMounted(async () => {
        nablaGroups.value = await get_groups()
        nablaCommittees.value = nablaGroups.value.filter(groupKind => groupKind == "committee")
        nablaInterestGroups.value = nablaGroups.value.filter(groupKind => groupKind == "interest group")
        console.log(nablaCommittees.value)
    })
</script>

<template>
    <div class="flex w-full flex-grow flex-col" style="padding: 20pt">
        <h1>
            Komiteer!
        </h1>
        <div class="flex flex-wrap justify-center gap-6">
            <GroupCard
                v-for="nablaGroup in nablaGroups"
                :key="nablaGroup.group_mail"
                :groupMail="nablaGroup.group_mail"
                :groupKind="nablaGroup.group_kind"
                :groupName="nablaGroup.group_name"
                :groupURL="nablaGroup.group_url"
                :groupLogo="nablaGroup.logo"
            />
        </div>
        <h1>
        Undergrupper!
        </h1>
    </div>
</template>