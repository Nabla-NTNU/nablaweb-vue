<script setup>
    import { onMounted } from 'vue';
    import { get_groups } from '../../lib/db/db';
    import GroupCard from './../../components/UIUtils/GroupCard.vue';
    import { useRoute } from 'vue-router';
    import { ref } from 'vue'
    
    const nablaGroups = ref([])
    onMounted(async () => {
        nablaGroups.value = await get_groups()
    })
</script>

<template>
    <div class="flex w-full flex-grow flex-col">
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
    </div>
</template>