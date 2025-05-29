<!-- Very temporary. Please make sure this doesn't end up in prod -->

<script setup>
    import { ref } from 'vue';
    import { supabase } from '@/lib/supabaseClient'


    const username = ref("")
    const password = ref("")

    // Supabase only allows email + password, not username + password We
    //  therefore add an "@stud.ntnu.no" to avoid any awkward clashes.
    async function handleLogin() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: username.value + "@stud.ntnu.no",
            password: password.value
        })

        if (error) {
            console.log(error)
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
    </form>
</template>