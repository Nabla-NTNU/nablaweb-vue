<script setup lang="ts">
    import { ref } from "vue"
    import { supabase } from "@/lib/supabaseClient"

    const username = ref("")
    const password = ref("")

    // Supabase only allows email + password, not username + password We
    //  therefore add an "@stud.ntnu.no" to avoid any awkward clashes.
    //  Unsure of what the final solution here should be.
    async function handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({
            email: username.value + "@stud.ntnu.no",
            password: password.value,
        })
        if (error) {
            console.error(error)
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
    </form>
</template>
