import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import '@/style.css'
import App from './App.vue'
import router from '@/router/'

const app = createApp(App)

const i18n = createI18n({
    legacy: false,
    locale: 'nb',
    fallbackLocale: {
        no: ['no', 'nb', 'nn', 'en'],
        nb: ['nb', 'no', 'en'],
        nn: ['nn', 'no', 'en'],
        en: ['en', 'no']
    },
})

app.use(router)
app.use(i18n)
app.mount('#app')
