<script setup lang="ts">
    import { useAuth } from "@/composables/useAuth"
    import { useUser } from "@/composables/useNablaUser"
    import { useProfilePictureUpload } from "@/composables/useImageUpload"
    import router from "@/router"
    import ImagePicker from "@/components/group-page/ImagePicker.vue"
    // import MarkdownField from "@/components/group-page/MarkdownField.vue"
    import { onUpdated, watch } from "vue"

    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    const { isAuthenticated, username } = useAuth()

    if (!isAuthenticated.value) {
        router.push("/forbidden")
    }

    // const usernameString = computed(() => username.value ?? "")

    const { user, getUserSetters } = useUser(username.value ?? "")

    const {
        setFirstName,
        setLastName,
        setProfilePicture,
        //     setIsActive,
        setPublicEmail,
        setListEmail,
        //     setAbout,
        setBirthday,
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
    const publicNotList = defineModel<boolean>("publicNotList")
    const listEmail = defineModel<string>("listEmail")
    const birthday = defineModel<string>("birthday")

    firstname.value = "test"

    const handleSubmit = () => {
        setFirstName(firstname.value)
        setLastName(lastname.value)
        setPublicEmail(publicEmail.value)
        if (publicNotList.value) {
            setListEmail(listEmail.value)
        } else {
            setListEmail(publicEmail.value)
        }
        setBirthday(birthday.value)
    }

    // The HTML input tag requires dates of the form YYYY-MM-DD
    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0]
    }

    // Filling in default values
    watch(user, () => {
        firstname.value = user.value?.firstName
        lastname.value = user.value?.lastName
        publicEmail.value = user.value?.publicEmail
        publicNotList.value = user.value?.listEmail != user.value?.publicEmail
        if (publicNotList.value) {
            listEmail.value = user.value?.listEmail
        }
        birthday.value = user.value?.birthday
            ? formatDate(user.value.birthday)
            : undefined
    })
</script>

<template>
    <div v-if="isAuthenticated && !!user" class="p-20">
        <div>{{ user.firstName }}</div>

        <form class="h-full w-full p-4" @submit.prevent="handleSubmit">
            <div class="relative">
                <input
                    id="firstname"
                    v-model="firstname"
                    type="text"
                    name="firstname"
                    autocomplete="given-name"
                    required
                    placeholder=" "
                    class="peer w-full rounded-xl bg-neutral p-4 pt-6 text-fg"
                />

                <label
                    for="firstname"
                    class="peer-[:not(:placeholder-shown)]:top-0 absolute left-4 align-text-top opacity-40 transition-all duration-200 peer-placeholder-shown:top-1/2"
                >
                    {{ t("firstname") }}
                </label>
            </div>

            <div class="relative">
                <input
                    id="firstname"
                    v-model="firstname"
                    type="text"
                    name="firstname"
                    autocomplete="given-name"
                    required
                    placeholder=" "
                    class="peer w-full rounded-xl bg-neutral p-4 pt-6 text-fg"
                />

                <label
                    for="firstname"
                    class="peer-not-placeholder-shown:top-0 transition-transform: translate absolute left-4 opacity-40 transition-all ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2"
                >
                    {{ t("firstname") }}
                </label>
            </div>

            <div class="flex flex-col s:flex-row s:items-center">
                <input
                    v-model="firstname"
                    type="text"
                    name="firstname"
                    autocomplete="given-name"
                    class="mb-2 mt-2 w-full rounded-xl bg-neutral p-4 text-fg"
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
            </div>

            <input
                v-model="publicEmail"
                type="email"
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
                type="email"
                name="listEmail"
                autocomplete="email"
                class="m-4 w-full rounded-xl bg-neutral p-4 text-fg"
                :placeholder="t('email')"
                required
            />
            <input
                v-model="birthday"
                type="date"
                name="birthday"
                autocomplete="bday"
                class="m-4 rounded-xl bg-neutral p-4 text-fg"
                value="10/09/2004"
                required
            />

            <button type="submit">{{ t("save") }}</button>
        </form>

        <ImagePicker
            :image-url="user.profilePicture ? user.profilePicture.href : ''"
            :upload-image="upload"
            @save-image="handleSaveImage"
        />
    </div>

    <div v-else></div>
</template>

<i18n lang="yaml">
nb:
    firstname: Fornavn
    lastname: Etternavn
    email: E-post
    birthday: Bursdag
    save: Lagre
en:
    firstname: First name
    lastname: Surname
    email: Email
    birthday: Birthday
    save: Save
nn:
    firstname: Fornamn
    lastname: Etternamn
    email: E-post
    birthday: Bursdag
    save: Lagre
</i18n>
