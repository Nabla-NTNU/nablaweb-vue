<script setup lang="ts">
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    //import { useGroup, useGroups } from "@/composables/useNablaGroup"
</script>

<template>
    <div class="mx-12 my-6">
        <h1 class="text-title-3 font-semibold">
            {{ t("kontakt") }}
        </h1>
    </div>
    <div class="mx-12 my-4">
        <router-link
            class="rounded-full border-2 border-transparent bg-primary px-3 duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
            to="/for-bedrifter"
        >
            {{ t("kontakt-for-bedrifter") }}
        </router-link>
    </div>
</template>

<i18n lang="yaml">
nb:
    kontakt: Kontakt
    kontakt-for-bedrifter: Kontakt for bedrifter
en:
    kontakt: Contact
    kontakt-for-bedrifter: Contact for buisnesses
</i18n>
