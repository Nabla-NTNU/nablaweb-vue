<script setup lang="ts">
    import { useAuth } from "@/composables/useAuth"
    import { useUser } from "@/composables/useNablaUser"
    import { useProfilePictureUpload } from "@/composables/useImageUpload"
    import router from "@/router"
    import ImagePicker from "@/components/input-components/ImagePicker.vue"
    import MarkdownField from "@/components/input-components/MarkdownField.vue"
    import { onUpdated, watch } from "vue"

    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    const { isAuthenticated, username } = useAuth()

    if (!isAuthenticated.value) {
        router.push("/forbidden")
    }

    const { user, getUserSetters } = useUser(username.value ?? "")

    const {
        setFirstName,
        setLastName,
        setProfilePicture,
        //     setIsActive,
        setPublicEmail,
        setListEmail,
        setAbout,
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
    const publicIsList = defineModel<boolean>("publicNotList")
    const listEmail = defineModel<string>("listEmail")
    const birthday = defineModel<string>("birthday")

    const handleSubmit = () => {
        setFirstName(firstname.value)
        setLastName(lastname.value)
        setPublicEmail(publicEmail.value)
        if (publicIsList.value) {
            setListEmail(publicEmail.value)
        } else {
            setListEmail(listEmail.value)
        }
        setBirthday(birthday.value == "" ? null : birthday.value)
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
        publicIsList.value = user.value?.listEmail == user.value?.publicEmail
        if (!publicIsList.value) {
            listEmail.value = user.value?.listEmail
        }
        birthday.value = user.value?.birthday
            ? formatDate(user.value.birthday)
            : undefined
    })
</script>

<template>
    <div v-if="isAuthenticated && !!user" class="p-20">
        <form
            class="grid h-full w-full grid-cols-1 justify-end gap-6 p-4 m:grid-cols-5"
            @submit.prevent="handleSubmit"
        >
            <div class="col-span-2">
                <label for="firstname" class="m-4 font-bold">
                    {{ t("firstname") }}
                </label>
                <br />

                <input
                    id="firstname"
                    v-model="firstname"
                    type="text"
                    name="firstname"
                    autocomplete="given-name"
                    class="m-4 w-full rounded-xl bg-neutralish p-4 text-fg"
                    required
                />
            </div>

            <div class="col-span-2">
                <label for="lastname" class="m-4 font-bold">
                    {{ t("lastname") }}
                </label>
                <br />

                <input
                    v-model="lastname"
                    type="text"
                    name="lastname"
                    autocomplete="family-name"
                    class="m-4 w-full rounded-xl bg-neutralish p-4 text-fg"
                    required
                />
            </div>

            <div class="col-span-1">
                <label for="birthday" class="m-4 font-bold">{{
                    t("birthday")
                }}</label>

                <br />

                <input
                    v-model="birthday"
                    type="date"
                    name="birthday"
                    autocomplete="bday"
                    class="m-4 w-full rounded-xl bg-neutralish p-4 text-fg"
                />
            </div>

            <div class="col-span-3">
                <label for="publicemail" class="m-4 font-bold">{{
                    t("email")
                }}</label>

                <br />

                <input
                    v-model="publicEmail"
                    type="email"
                    name="publicEmail"
                    autocomplete="email"
                    class="m-4 w-full rounded-xl bg-neutralish p-4 text-fg"
                    :placeholder="t('email')"
                    required
                />
            </div>

            <div class="col-span-2">
                <input
                    v-model="publicIsList"
                    type="checkbox"
                    name="publicIsList"
                />
                <label for="publicIsList">{{ t("publicIsList") }}</label>
            </div>

            <div v-if="!publicIsList" class="col-span-3">
                <label for="listEmail" class="m-4 font-bold"
                    >{{ t("listEmail") }}
                </label>
                <input
                    v-model="listEmail"
                    type="email"
                    name="listEmail"
                    autocomplete="email"
                    class="m-4 w-full rounded-xl bg-neutralish p-4 text-fg"
                    :placeholder="t('email')"
                    required
                />
            </div>

            <div v-if="!publicIsList" class="col-span-2"></div>

            <button
                type="submit"
                class="m-auto items-center text-nowrap rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
            >
                {{ t("save") }}
            </button>
        </form>

        <ImagePicker
            :image-url="user.profilePicture ? user.profilePicture.href : ''"
            :upload-image="upload"
            alt-text="t('profileImageAlt')"
            @save-image="handleSaveImage"
        />

        <MarkdownField
            :text="user.about ? user.about : ''"
            :placeholder="t('bio_placeholder')"
            @save-text="setAbout"
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
    biography: Biografisk informasjon
    contact: Kontaktinformasjon
    publicIsList: Kontakt meg med denne e-posten
    listEmail: Kontaktepost
    about: Om deg
    bio_placeholder: Skriv litt om deg selv!
    profileImageAlt: Profilbildet ditt
en:
    firstname: First name
    lastname: Surname
    email: Email
    birthday: Birthday
    save: Save
    biography: Biographical information
    contact: Contact information
    publicIsList: Contact me with this email
    listEmail: Contact email
    about: About you
    bio_placeholder: Write something about yourself!
    profileImageAlt: Your profile picture
nn:
    firstname: Fornamn
    lastname: Etternamn
    email: E-post
    birthday: Bursdag
    save: Lagre
    biography: Biografisk informasjon
    contact: Kontaktinformasjon
    publicIsList: Kontakt meg med denne e-posten
    listEmail: Kontaktepost
    bio_placeholder: Skriv litt om deg sjølv!
    profileImageAlt: Profilbiletet ditt
</i18n>
