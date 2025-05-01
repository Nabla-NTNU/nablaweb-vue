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
            password: password.value,
        })
        return null
    }
</script>

<template>
    <form @submit.prevent="handleLogin">
        <input v-model="username" placeholder="NTNU Username" />
        <br/>
        <input v-model="password" placeholder="Password" type="password"/>
        <br/>
        <button type="submit">
            Log in
        </button>
    </form>
</template>

<style scoped>
    input {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        border-radius: 5pt;
        box-sizing: border-box;
    }

    button {
        background-color: blue;
        border: none;
        border-radius: 5pt;
        padding: 5pt 8pt;
        color: white;
    }
</style>