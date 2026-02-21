<script setup lang="ts">
    import { useAuth } from "@/composables/useAuth"
    import { useUser } from "@/composables/useNablaUser"
    import { useProfilePictureUpload } from "@/composables/useImageUpload"
    import router from "@/router"
    import ImagePicker from "@/components/group-page/ImagePicker.vue"
    import MarkdownField from "@/components/group-page/MarkdownField.vue"
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
            class="h-full w-full justify-end p-4"
            @submit.prevent="handleSubmit"
        >
            <h4>{{ t("biography") }}</h4>

            <div class="flex flex-row flex-wrap">
                <div>
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
                        class="m-4 rounded-xl bg-neutralish p-4 text-fg"
                        required
                    />
                </div>

                <div>
                    <label for="lastname" class="m-4 font-bold">
                        {{ t("lastname") }}
                    </label>
                    <br />

                    <input
                        v-model="lastname"
                        type="text"
                        name="lastname"
                        autocomplete="family-name"
                        class="m-4 rounded-xl bg-neutralish p-4 text-fg"
                        required
                    />
                </div>

                <div>
                    <label for="birthday" class="m-4 font-bold">{{
                        t("birthday")
                    }}</label>

                    <br />

                    <input
                        v-model="birthday"
                        type="date"
                        name="birthday"
                        autocomplete="bday"
                        class="m-4 rounded-xl bg-neutralish p-4 text-fg"
                    />
                </div>
            </div>

            <h2>{{ t("contact") }}</h2>

            <div class="flex flex-row flex-wrap">
                <div>
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

                <div>
                    <input
                        v-model="publicIsList"
                        type="checkbox"
                        name="publicIsList"
                    />
                    <label for="publicIsList">{{ t("publicIsList") }}</label>
                </div>

                <div v-if="!publicIsList">
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
            </div>

            <button type="submit">{{ t("save") }}</button>
        </form>

        <ImagePicker
            :image-url="user.profilePicture ? user.profilePicture.href : ''"
            :upload-image="upload"
            @save-image="handleSaveImage"
        />

        <MarkdownField
            :text="user.about ? user.about : ''"
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
</i18n>
