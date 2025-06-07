import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  build: {
    // Show uncompiled .vue and .ts to browser dev tools instead of just
    sourcemap: mode === 'development',
  },

  // Fix prettier import root folder
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}))
