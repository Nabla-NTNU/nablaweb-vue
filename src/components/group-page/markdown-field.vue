<script setup lang="ts">
    import { ref, watch } from 'vue'

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
            <textarea class="w-full grow resize-none p-3 m-1 rounded-xl" v-model="localText" placeholder="NablaKom er hele nablas nabla-komite!"></textarea>
        </div>
        <!-- Workaround for tailwind stripping all styling from normal html (smh) -->
        <article class="flex-1 reset-tailwind" v-html='md.render(localText)' v-if='text'></article>
    </div>
    <div class="flex flex-row gap-2 mb-4">
        <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" @click="localText=text">
            Gå tilbake
        </button>
        <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary disabled:bg-gray" @click="$emit('saveText', localText)" :disabled="localText===text">
            Lagre ny tekst
        </button>
    </div>
</template>