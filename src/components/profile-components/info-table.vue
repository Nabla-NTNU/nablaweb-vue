<script setup lang="ts">
    import type { NablaUser } from "@/lib/types/frontend.types"
    import { useI18n } from "vue-i18n"

    import NablaTable from "../general/NablaTable.vue"

    const { t, d } = useI18n()

    defineProps<{
        user: NablaUser
    }>()
</script>

<template>
    <div class="border overflow-hidden rounded-lg border-black">
        <NablaTable>
            <tr v-if="!!user?.publicEmail">
                <td>{{ t("epost") }}</td>
                <td>
                    <a
                        class="text-primary hover:text-primary-500"
                        :href="'mailto:' + user?.publicEmail"
                    >
                        {{ user?.publicEmail }}
                    </a>
                </td>
            </tr>

            <tr v-if="!!user?.website">
                <td>{{ t("heimeside") }}</td>
                <td>
                    <a
                        class="text-primary hover:text-primary-500"
                        :href="user?.website?.toString()"
                    >
                        {{ user?.website }}
                    </a>
                </td>
            </tr>

            <tr v-if="!!user?.birthday">
                <td>{{ t("bursdag") }}</td>
                <td>
                    {{ d(user?.birthday) }}
                </td>
            </tr>

            <tr v-if="!!user?.memberOf">
                <td>{{ t("medlemskap") }}</td>
                <td>
                    <ul>
                        <li
                            v-for="(group, index) in user?.memberOf"
                            :key="index"
                        >
                            {{ group.name }}
                        </li>
                    </ul>
                </td>
            </tr>

            <tr v-if="!!user?.pastMemberOf && user.pastMemberOf.length > 0">
                <td>{{ t("tidelegareMedlemskap") }}</td>
                <td>
                    <ul>
                        <li
                            v-for="(group, index) in user?.pastMemberOf"
                            :key="index"
                        >
                            {{ group.name }}
                        </li>
                    </ul>
                </td>
            </tr>
        </NablaTable>
    </div>
</template>

<i18n lang="yaml">
nb:
    brukarnamn: Brukernavn
    bursdag: Bursdag
    epost: Epost
    heimeside: Hjemmeside
    medlemskap: Medlem av
    tidelegareMedlemskap: Har vært i

nn:
    brukarnamn: Brukarnamn
    bursdag: Bursdag
    epost: Epost
    heimeside: Heimeside
    medlemskap: Medlem av
    tidlegareMedlemskap: Har vore i

en:
    brukarnamn: Username
    bursdag: Birthday
    epost: Email
    heimeside: Homepage
    medlemskap: Member of
    tidelegareMedlemskap: Has been in
</i18n>
