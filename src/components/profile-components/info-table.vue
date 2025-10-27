<script setup lang="ts">
    import type { NablaUser } from "@/lib/types/frontend.types"
    import InfoRow from "./info-row.vue"
    import { useI18n } from "vue-i18n"

    const { t } = useI18n()

    defineProps<{
        user: NablaUser
    }>()
</script>

<template>
    <div class="border overflow-hidden rounded-lg border-black">
        <table class="border w-full table-auto">
            <tbody>
                <InfoRow :label="t('epost')" :show="!!user?.publicEmail">
                    <a
                        class="text-primary hover:text-primary-500"
                        :href="'mailto:' + user?.publicEmail"
                    >
                        {{ user?.publicEmail }}
                    </a>
                </InfoRow>

                <InfoRow :label="t('heimeside')" :show="!!user?.website">
                    <a
                        class="text-primary hover:text-primary-500"
                        :href="user?.website?.toString()"
                    >
                        {{ user?.website }}
                    </a>
                </InfoRow>

                <InfoRow :label="t('bursdag')" :show="!!user?.birthday">
                    {{ user?.birthday }}
                </InfoRow>

                <InfoRow :label="t('medlemskap')" :show="!!user?.memberOf">
                    <ul>
                        <li
                            v-for="(group, index) in user?.memberOf"
                            :key="index"
                        >
                            {{ group.name }}
                        </li>
                    </ul>
                </InfoRow>

                <InfoRow
                    :label="t('tidelegareMedlemskap')"
                    :show="!!user?.pastMemberOf"
                >
                    <ul>
                        <li
                            v-for="(group, index) in user?.pastMemberOf"
                            :key="index"
                        >
                            {{ group.name }}
                        </li>
                    </ul>
                </InfoRow>
            </tbody>
        </table>
    </div>
</template>

<i18n lang="yaml">
nb:
    brukarnamn: Brukernavn
    bursdag: Bursdag
    epost: Epost
    heimeside: Hjemmeside
    medlemskap: Medlem av
    tidelegareMedlemskap: Var i

nn:
    brukarnamn: Brukarnamn
    bursdag: Bursdag
    epost: Epost
    heimeside: Heimeside
    medlemskap: Medlem av
    tidlegareMedlemskap: Var i

en:
    brukarnamn: Username
    bursdag: Birthday
    epost: Email
    heimeside: Homepage
    medlemskap: Member of
    tidelegareMedlemskap: Was in
</i18n>
