<script setup lang="ts">
    // import { useI18n } from "vue-i18n"
    // const { locale } = useI18n()
    import InfoTable from "@/components/profile-components/info-table.vue"

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

        <hr class="m-4 bg-primary-25" />
        <div class="grid grid-cols-2 gap-4">
            <div>
                <article
                    v-if="user.about"
                    class="reset-tailwind flex-1"
                    v-html="md.render(user.about)"
                ></article>
            </div>
            <InfoTable :user="user" />
        </div>
    </div>
    <div v-else>
        You did something so extraordinarily wrong, I don't even know how it
        happened.
    </div>
</template>
