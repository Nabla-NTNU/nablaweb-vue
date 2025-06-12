<script setup lang="ts">
    import { useTheme } from "@/composables/useTheme" // inits light mode/dark mode

    import Header from "@/components/Header.vue"
    import MainContent from "@/components/MainContent.vue"
    import Footer from "@/components/Footer.vue"

    import "@/style.css"
    import "@/assets/fonts/fonts.css"

    useTheme()
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <Header />
        <main class="flex-1 bg-light">
            <MainContent>
                <RouterView />
            </MainContent>
        </main>
        <Footer />
    </div>
</template>
