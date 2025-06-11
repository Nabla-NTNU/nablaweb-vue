<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  const { locale } = useI18n()
  
  import { useAuth } from '@/composables/useAuth'
  import LoginCard from '@/components/general/login-card.vue';
  import ThemeToggler from '@/components/buttons/ThemeToggler.vue';

  
  const { isLoading, isAuthenticated, signOut } = useAuth()
  
  </script>

<template>
  <div style="margin: 40pt;" v-if="isLoading">
    Loading…
  </div>

  <div style="margin: 40pt;" v-else-if="isAuthenticated">
    <button
      class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary"
      @click="signOut"
    >
      Sign Out
    </button>
  </div>
  
  <div style="margin: 40pt;" v-else>
    <LoginCard/>
  </div>

  <div class="flex justify-center">
    <button
    class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary"
    @click="locale == 'nb' ? locale = 'en' : locale = 'nb'"
    >
      Switch language
    </button>
  </div>
  
  <div class="min-h-screen flex justify-center items-center">
    <ThemeToggler />
  </div>
</template>