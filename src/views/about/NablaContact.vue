<script setup lang="ts">
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { useGroups } from "@/composables/useNablaGroup"

    const { groups } = useGroups()
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
            {{ t("for-bedriftshenvendelser") }}
        </router-link>
    </div>

    <div class="mx-100 my-6">
        <h2 class="mb-3 text-title-4 font-semibold">
            {{ t("kontaktinfo-til-styret") }}
        </h2>
    </div>

    <div class="mx-100 my-6">
        <div v-for="group in groups" :key="group.id">
            <div v-if="group.leaderMail || group.mailList">
                <h2 class="mb-3 text-title-4 font-semibold">
                    <router-link
                        :to="`/undergrupper/${group.id}`"
                        class="text-primary hover:underline"
                    >
                        {{ group.name }}
                    </router-link>
                </h2>
                <div v-if="group.leaderMail">
                    {{ t("ledermail") }}:
                    {{ group.leaderMail }}
                </div>
                <div v-if="group.mailList">
                    {{ t("gruppemail") }}: {{ group.mailList }}
                </div>
                <div v-if="group.trustedMember">
                    {{ t("tillitsvalgt") }}:
                    {{ group.trustedMember?.user.firstName }}
                    {{ group.trustedMember?.user.lastName }} {{ t("mail") }}:
                    {{ group.trustedMember?.user.username }}@student.ntnu.no
                </div>
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
nb:
    kontakt: Kontakt
    for-bedriftshenvendelser: For bedriftshenvendelser
    gruppeleder: Gruppeleder
    mail: Mail
    ledermail: Ledermail
    gruppemail: Gruppemail
    tillitsvalgt: Tillitsvalgt
    kontaktinfo-til-styret: Kontaktinfo til styret
en:
    kontakt: Contact
    for-bedriftshenvendelser: For bedriftshenvendelser
    gruppeleder: Group leader
    mail: Mail
    ledermail: Leadermail
    gruppemail: Group mail
    tillitsvalgt: Trusted member
    kontaktinfo-til-styret: Contact info for the board
</i18n>
