<script setup lang="ts">
    import { useTheme } from "@/composables/useTheme" // inits light mode/dark mode
    useTheme()

    import Header from "@/components/nabla-header.vue"
    import MainContent from "@/components/main-content.vue"
    import Footer from "@/components/nabla-footer.vue"

    import "@/style.css"
    import "@/assets/fonts/fonts.css"
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <Header />
        <main
            class="flex flex-1 bg-neutral transition duration-200 ease-in-out"
        >
            <MainContent>
                <RouterView />
            </MainContent>
        </main>
        <Footer />
    </div>
</template>
