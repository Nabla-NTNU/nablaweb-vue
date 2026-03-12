<script setup lang="ts">
    import { computed } from "vue"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { useGroups } from "@/composables/useNablaGroup"
    import GroupCard from "@/components/group-page/GroupCard.vue"
    import { GroupKind } from "@/lib/types/frontend.types"

    // useGroups also has an error and a loading that can be used in frontend
    const { groups } = useGroups()
    const committees = computed(() =>
        groups.value.filter((group) => group.kind == GroupKind.Committee),
    )
    const interestGroups = computed(() =>
        groups.value.filter((group) => group.kind == GroupKind.InterestGroup),
    )

    const inactiveGroups = computed(() =>
        groups.value.filter(
            (group) => group.kind == GroupKind.InterestGroup && !group.isActive,
        ),
    )

    const activeGroups = computed(() =>
        groups.value.filter(
            (group) => group.kind == GroupKind.InterestGroup && group.isActive,
        ),
    )
</script>

<template>
    <div class="mx-12 my-4">
        <h1 class="grow text-title-3 font-semibold tracking-tight">
            Undergruppene <br class="s:hidden" />til nabla
        </h1>
        I nabla er vi heldige nok til å ha masse undergrupper. Disse inkluderer
        <b>komiteer</b>, som går inn i hvordan Nabla fungerer, og
        <b>interessegrupper</b>, som består av komponenter med felles
        interesser. Typisk er det to opptak hvert studieår, et i begynnelsen av
        hvert semester. Løp og søk!
    </div>
    <div class="flex w-full flex-grow flex-col" style="padding: 20pt">
        <h1 class="mx-12 text-subtitle-4 font-semibold tracking-tight">
            {{ t("komiteer") }}:
        </h1>
        <div class="flex flex-wrap justify-center gap-6">
            <GroupCard
                v-for="group in committees"
                :id="group.id"
                :key="group.id"
                :name="group.name"
                :logo="group.logo"
            />
        </div>

        <h1 class="mx-12 text-subtitle-4 font-semibold tracking-tight">
            {{ t("active-groups") }}
        </h1>

        <div class="flex flex-wrap justify-center gap-6">
            <GroupCard
                v-for="group in activeGroups"
                :id="group.id"
                :key="group.id"
                :name="group.name"
                :logo="group.logo"
            />
        </div>

        <details closed>
            <summary class="mx-12 text-subtitle-4 font-semibold tracking-tight">
                {{ t("inactive-groups") }}
            </summary>

            <div class="flex flex-wrap justify-center gap-6">
                <GroupCard
                    v-for="group in inactiveGroups"
                    :id="group.id"
                    :key="group.id"
                    :name="group.name"
                    :logo="group.logo"
                />
            </div>
        </details>
        <details closed>
            <summary class="mx-12 text-subtitle-4 font-semibold tracking-tight">
                {{ t("interesse-grupper") }}
            </summary>
            <div class="flex flex-wrap justify-center gap-6">
                <GroupCard
                    v-for="group in interestGroups"
                    :id="group.id"
                    :key="group.id"
                    :name="group.name"
                    :logo="group.logo"
                />
            </div>
        </details>
    </div>
</template>

<i18n lang="yaml">
nb:
    komiteer: Komiteer
    interesse-grupper: Alle interessegrupper
    inactive-groups: Inaktive interessegrupper
    active-groups: Aktive interessegrupper
en:
    komiteer: Committees
    interesse-grupper: All Interest Groups
    inactive-groups: Inactive Interest Groups
    active-groups: Active Interest Groups
</i18n>
