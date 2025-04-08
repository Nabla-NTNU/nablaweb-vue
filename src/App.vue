<script setup>
import './style.css'
import './assets/fonts/fonts.css';

import Header from './components/Header.vue';
import MainContent from './components/MainContent.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 bg-light">
      <MainContent><router-view /></MainContent>
    </main>
    <Footer />
  </div>
</template>

<script>
export default {
  mounted() {
    this.loadThemeFromLocalStorage(); // Apply the theme when the app loads
  },
  methods: {
    applyTheme(theme, mode) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-mode', mode);
    },
    loadThemeFromLocalStorage() {
      // Load theme and mode from localStorage if available, or use defaults
      const savedTheme = localStorage.getItem('theme') || 'classic'; // Default to 'classic'
      const savedMode = localStorage.getItem('mode') || 'light'; // Default to 'light'

      // Apply the theme and mode globally
      this.applyTheme(savedTheme, savedMode);
    },
  },
};
</script>