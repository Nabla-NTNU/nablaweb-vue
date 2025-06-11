<script setup lang="ts">
    import { ref, watch } from 'vue'

    import { useI18n } from 'vue-i18n'
    const { t } = useI18n()

    import markdownit from 'markdown-it'
    const md = markdownit()


    const props = defineProps<{
        text: string
    }>()

    const emit = defineEmits<{
        saveText: [text: string]
    }>()

    const localText = ref(props.text)

    watch(() => props.text, text => {
        localText.value = text
    })
</script>

<template>
    <div class="flex flex-row gap-4">
        <div class="flex flex-col flex-1 gap-4">
            <textarea class="w-full grow resize-none p-3 m-1 rounded-xl" v-model="localText" :placeholder="t('placeholder')"></textarea>
        </div>
        <!-- Workaround for tailwind stripping all styling from normal html (smh) -->
        <article class="flex-1 reset-tailwind" v-html='md.render(localText)' v-if='text'></article>
    </div>
    <div class="flex flex-row gap-2 mb-4">
        <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" @click="localText=text">
            {{ t('gå-tilbake') }}
        </button>
        <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary disabled:bg-gray" @click="$emit('saveText', localText)" :disabled="localText===text">
            {{ t('lagre-ny-tekst') }}
        </button>
    </div>
</template>

<i18n lang="yaml">
nb:
    placeholder: NablaKom er hele nablas nabla-komite!
    gå-tilbake: Gå tilbake
    lagre-ny-tekst: Large ny tekst
en:
    placeholder: NablaKom is all of nabla's nabla-committee!
    gå-tilbake: Cancel
    lagre-ny-tekst: Save text
</i18n>