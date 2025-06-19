<script setup lang="ts">
    import { ref } from "vue"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()
    import { useAuth } from "@/composables/useAuth"
    const { signIn } = useAuth()

    const username = ref("")
    const password = ref("")

    async function handleLogin() {
        const email = username.value + "@stud.ntnu.no"
        await signIn(email, password.value)
    }
</script>

<template>
    <form class="h-full w-full p-4" @submit.prevent="handleLogin">
        <input
            id="username"
            v-model="username"
            type="text"
            name="username"
            class="m-4 w-full rounded-xl bg-neutral p-4 text-fg"
            :placeholder="t('NTNU-brukernavn')"
            required
        />
        <br />
        <input
            v-model="password"
            type="password"
            name="password"
            class="m-4 w-full rounded-xl bg-neutral p-4 text-fg"
            :placeholder="t('passord')"
            required
        />
        <br />
        <button
            class="m-4 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
            type="submit"
            name="log in"
            @click="handleLogin"
        >
            {{ t("logg-in") }}
        </button>
    </form>
</template>

<i18n lang="yaml">
nb:
    NTNU-brukernavn: NTNU Brukernavn
    passord: Passord
    logg-in: Logg inn
en:
    NTNU-brukernavn: NTNU Username
    passord: Password
    logg-in: Sign in
</i18n>
