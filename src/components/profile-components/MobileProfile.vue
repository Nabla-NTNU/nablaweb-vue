<script setup lang="ts">
    import InfoTable from "@/components/profile-components/info-table.vue"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    const props = defineProps({
        username: {
            type: String,
            required: true,
        },
    })

    import { useUser } from "@/composables/useNablaUser"
    const { user } = useUser(props.username)

    import markdownit from "markdown-it"
    const md = markdownit()
</script>

<template>
    <div v-if="user">
        <div class="flex h-20 items-center gap-4">
            <div
                class="border-bg-primary flex h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 bg-primary-dark fill-white"
            >
                <img
                    v-if="user.profilePicture"
                    :src="String(user.profilePicture)"
                />
            </div>
            <h1 class="text-title-5 font-bold">
                {{ user.firstName }}
                {{ user.lastName }}
            </h1>
        </div>

        <hr class="m-4 bg-primary-25" />

        <details>
            <summary>{{ t("information") }}</summary>

            <InfoTable :user="user" />
        </details>

        <article
            v-if="user.about"
            class="reset-tailwind flex-1"
            v-html="md.render(user.about)"
        ></article>
    </div>
</template>

<i18n lang="yaml">
nb:
    information: Om komponenten

nn:
    information: Om komponenten

en:
    information: About the component
</i18n>
