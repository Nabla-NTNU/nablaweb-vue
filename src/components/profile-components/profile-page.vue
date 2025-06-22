<script setup lang="ts">
    const props = defineProps({
        username: {
            type: String,
            required: true,
        },
    })

    import { useUser } from "@/composables/useNablaUser"
    import InfoRow from "./info-row.vue"
    import { useI18n } from "vue-i18n"

    const { user } = useUser(props.username)
    const { t } = useI18n()
</script>

<template>
    <div class="border overflow-hidden rounded-lg border-black">
        <table class="border w-full table-auto">
            <tbody>
                <InfoRow :label="t('brukarnamn')" :show="!!user?.username">
                    {{ user?.username }}
                </InfoRow>
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
            </tbody>
        </table>
    </div>
</template>

<i18n lang="yaml">
nb:
    brukarnamn: Brukernavn
    epost: Epost
    heimeside: Hjemmeside
    medlemskap: Medlem av

nn:
    brukarnamn: Brukarnamn
    epost: Epost
    heimeside: Heimeside
    medlemskap: Medlem av

en:
    brukarnamn: username
    epost: Email
    heimeside: Homepage
    medlemskap: Member of
</i18n>
