<script setup lang="ts">
    import { useAuth } from "@/composables/useAuth"
    import { useUser } from "@/composables/useNablaUser"
    import { useProfilePictureUpload } from "@/composables/useImageUpload"
    import router from "@/router"
    import ImagePicker from "@/components/group-page/ImagePicker.vue"
    // import MarkdownField from "@/components/group-page/MarkdownField.vue"

    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { onUpdated } from "vue"

    const { isAuthenticated, username } = useAuth()

    if (!isAuthenticated.value) {
        router.push("/forbidden")
    }

    // const usernameString = computed(() => username.value ?? "")

    const { user, getUserSetters } = useUser(username.value ?? "")

    const {
        //     setFirstName,
        //     setLastName,
        setProfilePicture,
        //     setIsActive,
        //     setNTNUEmail,
        //     setListEmail,
        //     setAbout,
        //     setBirthday,
        //     setWebsite,
    } = getUserSetters()

    const handleSaveImage = (newValue: string) => {
        setProfilePicture(newValue)
    }

    const { upload } = useProfilePictureUpload(username.value ?? "")

    onUpdated(() => {
        if (!isAuthenticated.value) {
            router.push("/forbidden")
        }
    })

    const firstname = defineModel<string>("firstname")
    const lastname = defineModel<string>("lastname")
    const publicEmail = defineModel<string>("publicEmail")
    const publicNotList = defineModel<string>("publicNotList")
    const listEmail = defineModel<string>("listEmail")
</script>

<template>
    <div v-if="isAuthenticated && !!user" class="p-20">
        <div>Test!</div>

        <form class="h-full w-full p-4">
            <input
                v-model="firstname"
                type="text"
                name="firstname"
                autocomplete="given-name"
                class="m-4 w-full rounded-xl bg-neutral p-4 text-fg"
                :placeholder="t('firstname')"
                required
            />

            <input
                v-model="lastname"
                type="text"
                name="lastname"
                autocomplete="family-name"
                class="m-4 w-full rounded-xl bg-neutral p-4 text-fg"
                :placeholder="t('lastname')"
                required
            />
            <input
                v-model="publicEmail"
                type="text"
                name="publicEmail"
                autocomplete="email"
                class="m-4 w-full rounded-xl bg-neutral p-4 text-fg"
                :placeholder="t('email')"
                required
            />

            <input v-model="publicNotList" type="checkbox" />

            <input
                v-if="publicNotList"
                v-model="listEmail"
                type="text"
                name="listEmail"
                autocomplete="email"
                class="m-4 w-full rounded-xl bg-neutral p-4 text-fg"
                :placeholder="t('email')"
                required
            />
            <input
                type="date"
                name="birthday"
                autocomplete="bday"
                class="m-4 rounded-xl bg-neutral p-4 text-fg"
                :placeholder="t('email')"
                required
            />
        </form>

        <ImagePicker
            :image-url="user.profilePicture ? user.profilePicture.href : ''"
            :upload-image="upload"
            @save-image="handleSaveImage"
        />
    </div>

    <div v-else></div>
</template>
