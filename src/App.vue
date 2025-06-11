<script setup lang="ts">
    import { onMounted } from 'vue'

    import Header from '@/components/Header.vue';
    import MainContent from '@/components/MainContent.vue';
    import Footer from '@/components/Footer.vue';

    import '@/style.css'
    import '@/assets/fonts/fonts.css';
    
    // Set colour theme
    function applyTheme(theme: string, mode: string) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-mode', mode);   
    }

    function loadThemeFromLocalStorage() {
        const savedTheme = localStorage.getItem('theme') || 'classic';
        const savedMode = localStorage.getItem('mode') || 'light';
        
        applyTheme(savedTheme, savedMode);
    }


    onMounted(() => {
        loadThemeFromLocalStorage()
    })
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <Header />
        <main class="flex-1 bg-light">
        <MainContent><RouterView /></MainContent>
        </main>
        <Footer />
    </div>
</template>