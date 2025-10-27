<script setup lang="ts">
    // import { useI18n } from "vue-i18n"
    // const { locale } = useI18n()
    import InfoTable from "@/components/profile-components/info-table.vue"
    import NablaTable from "@/components/general/NablaTable.vue"

    const props = defineProps({
        username: {
            type: String,
            required: true,
        },
    })

    import { useUser } from "@/composables/useNablaUser"
    const { user } = useUser(props.username)
</script>

<template>
    <div v-if="user">
        <div class="flex h-20 items-center gap-4">
            <div
                class="border-bg-primary flex h-20 w-20 overflow-hidden rounded-full border-2 bg-primary-dark fill-white"
            >
                <img
                    v-if="user.profilePicture"
                    :src="String(user.profilePicture)"
                />
            </div>
            <h1 class="text-title-3 font-bold">
                {{ user.firstName }}
                {{ user.lastName }}
            </h1>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <NablaTable test="Hello!"> </NablaTable>
            </div>
            <InfoTable :user="user" />
        </div>
    </div>
    <div v-else>
        You did something so extraordinarily wrong, I don't even know how it
        happened.
    </div>
</template>
