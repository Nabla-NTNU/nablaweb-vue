<script setup>
    import { onMounted } from 'vue';
    import { get_groups } from '../../lib/db/db';
    import GroupCard from './../../components/UIUtils/GroupCard.vue';
    import { useRoute } from 'vue-router';
    import { ref } from 'vue'
    
    const nablaGroups = ref([])
    onMounted(async () => {
        nablaGroups.value = await get_groups()
        console.log('hi')
    })
</script>

<template>
    <div class="flex w-full flex-grow flex-col">
        <div class="flex flex-wrap justify-center gap-6">
            <GroupCard
                v-for="nablaGroup in nablaGroups"
                    :key="nablaGroup.group_mail"
                    :group_mail="nablaGroup.group_mail"
                    :group_kind="nablaGroup.group_kind"
                    :group_name="nablaGroup.group_name"
                    :group_url="nablaGroup.group_url"
                    :group_logo="nablaGroup.logo"
            />
        </div>
    </div>
</template>