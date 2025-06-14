<script setup lang="ts">
    import { computed } from "vue"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { useGroups } from "@/composables/useNablaGroup"
    import GroupCard from "@/components/group-page/group-card.vue"
    import { GroupKind } from "@/lib/types/frontend.types"

    // useGroups also has an error and a loading that can be used in frontend
    const { groups } = useGroups()
    const committees = computed(() =>
        groups.value.filter((group) => group.kind == GroupKind.Committee),
    )
    const interestGroups = computed(() =>
        groups.value.filter((group) => group.kind == GroupKind.InterestGroup),
    )
</script>

<template>
    <div class="flex w-full flex-grow flex-col" style="padding: 20pt">
        <h1>{{ t("komiteer") }}!</h1>
        <div class="flex flex-wrap justify-center gap-6">
            <GroupCard
                v-for="group in committees"
                :id="group.id"
                :key="group.id"
                :name="group.name"
                :logo="group.logo"
            />
        </div>
        <h1>{{ t("undergrupper") }}!</h1>
    </div>
    <div class="flex flex-wrap justify-center gap-6">
        <GroupCard
            v-for="group in interestGroups"
            :id="group.id"
            :key="group.id"
            :name="group.name"
            :logo="group.logo"
        />
    </div>
</template>

<i18n lang="yaml">
nb:
    komiteer: Komiteer
    undergrupper: Undergrupper
en:
    komiteer: Committees
    undergrupper: Interest Groups
</i18n>
