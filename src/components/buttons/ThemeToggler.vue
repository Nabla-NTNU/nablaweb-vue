<script lang="ts">
export default {
  data() {
    return {
      theme: 'classic', // Default theme
      mode: 'light',    // Default mode
    };
  },
  mounted() {
    this.loadThemeFromLocalStorage(); // Load theme when component mounts
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'classic' ? 'modern' : 'classic';
      this.applyTheme();
    },
    toggleMode() {
      this.mode = this.mode === 'light' ? 'dark' : 'light';
      this.applyTheme();
    },
    applyTheme() {
      // Apply the selected theme and mode to the <html> element
      document.documentElement.setAttribute('data-theme', this.theme);
      document.documentElement.setAttribute('data-mode', this.mode);
      
      // Save theme and mode to localStorage
      localStorage.setItem('theme', this.theme);
      localStorage.setItem('mode', this.mode);
    },
    loadThemeFromLocalStorage() {
      // Check if theme and mode exist in localStorage
      const savedTheme = localStorage.getItem('theme');
      const savedMode = localStorage.getItem('mode');

      // Use the saved values if they exist, otherwise use default values
      if (savedTheme) {
        this.theme = savedTheme;
      }
      if (savedMode) {
        this.mode = savedMode;
      }

      // Apply the loaded theme and mode
      this.applyTheme();
    },
  },
};
</script>

<template>
  <div class="flex flex-col space-y-4 p-4 items-center">
    <!-- Toggle Classic/Modern Button -->
    <button
      @click="toggleTheme"
      class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary"
    >
      {{ theme === 'classic' ? 'Switch to Modern' : 'Switch to Classic' }}
    </button>

    <!-- Toggle Lightmode/Darkmode Button -->
    <button
      @click="toggleMode"
      class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary"
    >
      {{ mode === 'light' ? 'Switch to Darkmode' : 'Switch to Lightmode' }}
    </button>
  </div>
</template>