<!-- Very temporary. Please make sure this doesn't end up in prod -->

<script setup lang="ts">
    import { ref } from "vue"
    import { useAuth } from "@/composables/useAuth"
    import { AuthApiError } from "@supabase/supabase-js"

    const { signIn } = useAuth()

    const username = ref("")
    const password = ref("")

    const errorMessage = ref<null | string>(null)

    const hideMessage = () => (errorMessage.value = null)

    async function handleLogin() {
        try {
            await signIn(username.value + "@stud.ntnu.no", password.value)
        } catch (error: unknown) {
            if (error instanceof AuthApiError) {
                errorMessage.value =
                    "Vennligst oppgi korrekt brukernavn og passord."
            } else {
                errorMessage.value = "En ukjent feil oppsto"
                console.log(error)
            }
        }
    }
</script>

<template>
    <form @submit.prevent="handleLogin">
        <input
            v-model="username"
            class="m-4 w-full rounded-xl bg-neutralish p-4 text-fg"
            placeholder="NTNU Username"
        />
        <br />
        <input
            v-model="password"
            class="m-4 w-full rounded-xl bg-neutralish p-4 text-fg"
            placeholder="Password"
            type="password"
        />
        <br />
        <button
            class="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
            type="submit"
            @click="handleLogin"
        >
            Log in
        </button>
        <br />
        <div
            v-if="errorMessage"
            class="m-4 flex flex-row rounded-xl border-2 border-error-300 bg-error-200 p-4"
        >
            <p class="basis-3/4">
                {{ errorMessage }}
            </p>
            <div class="mr-5 basis-1/4 place-content-center">
                <button
                    class="float-right text-error-500 hover:text-error-900"
                    @click="hideMessage"
                >
                    x
                </button>
            </div>
        </div>
    </form>
</template>
