<script setup>
    import { onMounted } from 'vue';
    import { get_groups } from '../../lib/db/db';
    import GroupCard from './../../components/UIUtils/GroupCard.vue';
    import { ref } from 'vue'
    import {  }
    
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
    
</template>