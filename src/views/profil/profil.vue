<script setup>
  import '@/style.css'
  import '@/assets/fonts/fonts.css';
  
  import { useAuth } from '@/composables/useAuth'
  import LoginCard from '@/components/UIUtils/LoginCard.vue';
  import ThemeToggler from '@/components/buttons/ThemeToggler.vue';

  
  const { currentUser, isLoading, isAuthenticated } = useAuth()
  
  </script>

<template>
  <div style="margin: 40pt;" v-if="isLoading">
    Loading…
  </div>

  <div style="margin: 40pt;" v-else-if="isAuthenticated">
    <button @click="signCurrentUserOut"> Sign Out </button>
  </div>
  
  <div style="margin: 40pt;" v-else>
    <LoginCard/>
  </div>

  <div class="min-h-screen flex justify-center items-center">
    <ThemeToggler />
  </div>
</template>


<!-- Identical to the one in LoginCard - why don't we have global styles for kiunds of buttons? -->
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