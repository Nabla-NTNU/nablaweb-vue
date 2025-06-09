<!-- Very temporary. Please make sure this doesn't end up in prod -->

<script setup>
    import { ref } from 'vue';
    import { useAuth } from '@/composables/useAuth';

    const { signIn} = useAuth()

    const username = ref("")
    const password = ref("")

    const errorMessage = ref(null)

    const hideMessage = () => showError.value = null

    async function handleLogin() {
        try {
            const _ = await signIn( username.value + "@stud.ntnu.no", password.value)
        }
        catch (error) {
            if (error.name == "AuthApiError") {
                errorMessage.value = "Vennligst oppgi korrekt brukernavn og passord.";
            }

            else {
                console.log(error)
            }
        }
    }
</script>

<template>
    <form @submit.prevent="handleLogin">
        <input class="w-full rounded-xl p-4 m-4" v-model="username" placeholder="NTNU Username" />
        <br/>
        <input class="w-full rounded-xl p-4 m-4" v-model="password" placeholder="Password" type="password"/>
        <br/>
        <button class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" type="submit" @click="handleLogin">
            Log in
        </button>
        <br/>
        <div v-if="errorMessage" class="border-error-300 bg-error-200 p-4 m-4 rounded-xl border-2 flex flex-row">
            <p class="basis-3/4">
                {{errorMessage}}
            </p>
            <div class="basis-1/4 place-content-center mr-5">
                <button class="text-error-500 hover:text-error-900 float-right" @click="hideMessage">
                    x
                </button>
            </div>
        </div>
    </form>
</template>
