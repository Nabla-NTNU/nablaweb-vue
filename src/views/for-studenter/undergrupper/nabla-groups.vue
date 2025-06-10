<script setup lang="ts">
    import { computed } from 'vue'
    import { useGroups } from '@/composables/useNablaGroup'
    import GroupCard from '@/components/group-page/group-card.vue'
    
    const  {groups: nablaGroups, loading, error} = useGroups()
    const nablaCommittees = computed(() =>
        nablaGroups.value.filter(group => group.kind == 'Committee')
    )
    const nablaInterestGroups = computed(() =>
        nablaGroups.value.filter(group => group.kind == 'Interest group')
    )
</script>

<template>
    <div class="flex w-full flex-grow flex-col" style="padding: 20pt">
        <h1>
            Komiteer!
        </h1>
        <div class="flex flex-wrap justify-center gap-6">
            <GroupCard
                v-for="nablaGroup in nablaCommittees"
                :key="nablaGroup.id"
                :id="nablaGroup.id"
                :name="nablaGroup.name"
                :logo="nablaGroup.logo"
            />
        </div>
        <h1>
        Undergrupper!
        </h1>
    </div>
        <div class="flex flex-wrap justify-center gap-6">
            <GroupCard
                v-for="nablaGroup in nablaInterestGroups"
                :key="nablaGroup.id"
                :id="nablaGroup.id"
                :name="nablaGroup.name"
                :logo="nablaGroup.logo"
            />
        </div>
</template>