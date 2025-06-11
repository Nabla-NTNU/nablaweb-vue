import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        vue(),
        vueI18n({
            module: 'petite-vue-i18n',  // Slightly smaller module than the entire i18n. Still like 5kb :((
            // include: path.resolve(__dirname, 'src/**/*.{vue,js,ts}') //We can avoid importing i18n e
        })
    ],
    build: {
        // Show uncompiled .vue and .ts to browser dev tools instead of just y'know
        sourcemap: mode === 'development',
    },

    // Fix prettier import root folder
    resolve: {
        alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
}))
