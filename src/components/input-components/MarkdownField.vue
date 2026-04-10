<script setup lang="ts">
    import { ref, watch } from "vue"

    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import markdownit from "markdown-it"
    const md = markdownit()

    const props = defineProps<{
        text: string
        placeholder: string
    }>()

    defineEmits<{
        saveText: [text: string]
    }>()

    const localText = ref(props.text)

    watch(
        () => props.text,
        (text) => {
            localText.value = text
        },
    )
</script>

<template>
    <div class="flex flex-row gap-4">
        <div class="flex flex-1 flex-col gap-4">
            <textarea
                v-model="localText"
                aria-label="Edit text"
                class="m-1 w-full grow resize-none rounded-xl bg-neutralish p-3 text-fg"
                :placeholder="placeholder"
            ></textarea>
        </div>
        <!-- Workaround for tailwind stripping all styling from normal html (smh) -->
        <article
            v-if="text"
            class="reset-tailwind flex-1"
            v-html="md.render(localText)"
        ></article>
    </div>
    <div class="mb-4 flex flex-row gap-2">
        <button
            class="mt-auto rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
            @click="localText = text"
        >
            {{ t("gå-tilbake") }}
        </button>
        <button
            class="mt-auto rounded-lg bg-secondary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
            :disabled="localText === text"
            @click="$emit('saveText', localText)"
        >
            {{ t("lagre-ny-tekst") }}
        </button>
    </div>
</template>

<i18n lang="yaml">
nb:
    gå-tilbake: Gå tilbake
    lagre-ny-tekst: Lagre ny tekst
en:
    gå-tilbake: Cancel
    lagre-ny-tekst: Save text

nn:
    gå-tilbake: Gå tilbake
    lagre-ny-tekst: Lagre ny tekst
</i18n>
