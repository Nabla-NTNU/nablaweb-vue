<script setup lang="ts">
    import { computed } from 'vue'
    import { useGroups } from '@/composables/useNablaGroup'
    import GroupCard from '@/components/group-page/group-card.vue'
    import { GroupKind } from '@/lib/types/frontend.types'
    
    const  {groups, loading: groupsLoading, error: groupsError} = useGroups()
    const committees = computed(() =>
        groups.value.filter(group => group.kind == GroupKind.Committee)
    )
    const interestGroups = computed(() =>
        groups.value.filter(group => group.kind == GroupKind.InterestGroup)
    )
</script>

<template>
    <div class="flex w-full flex-grow flex-col" style="padding: 20pt">
        <h1>
            Komiteer!
        </h1>
        <div class="flex flex-wrap justify-center gap-6">
            <GroupCard
                v-for="group in committees"
                :key="group.id"
                :id="group.id"
                :name="group.name"
                :logo="group.logo"
            />
        </div>
        <h1>
        Undergrupper!
        </h1>
    </div>
        <div class="flex flex-wrap justify-center gap-6">
            <GroupCard
                v-for="group in interestGroups"
                :key="group.id"
                :id="group.id"
                :name="group.name"
                :logo="group.logo"
            />
        </div>
</template>