<script setup lang="ts">
    import { ref, watch } from "vue"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import InlineButton from "@/components/buttons/inline-button.vue"

    const props = defineProps<{
        imageUrl: string
        uploadImage: (file: File) => Promise<string | null>
    }>()

    defineEmits<{
        saveImage: [localImageURL: string]
    }>()

    const localImageURL = ref(props.imageUrl)
    watch(
        () => props.imageUrl,
        (url) => {
            localImageURL.value = url
        },
    )

    // ChatGPT code tbh - pls do look over
    async function handleFileUpload(e: DragEvent | Event) {
        let files: FileList | null = null

        // 1) file-input change
        if (e instanceof Event && "target" in e) {
            const input = e.target as HTMLInputElement
            files = input.files
        }

        // 2) drag-and-drop
        if (e instanceof DragEvent && e.dataTransfer) {
            files = e.dataTransfer.files
        }

        if (!files?.length) return

        const file = files[0]
        // Optional: early MIME or size validation here
        const url = await props.uploadImage(file)
        if (url) {
            localImageURL.value = url // update preview in child
        }
    }
</script>

<template>
    <div
        class="m-2 flex gap-4 rounded-xl border-2 border-dashed border-gray-300 p-4"
        @dragover.prevent
        @drop.prevent="handleFileUpload"
    >
        <input
            v-model="localImageURL"
            class="w-full rounded-xl bg-neutralish px-4 text-fg"
            placeholder="https://nabla.no/det_kuleste_bildet"
        />

        <input
            type="file"
            id="fileInput"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
        />
        <label
            v-if="localImageURL === imageUrl"
            for="fileInput"
            class="m-auto cursor-pointer items-center text-nowrap rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
        >
            {{ t("last-opp") }}
        </label>

        <InlineButton
            v-if="localImageURL !== imageUrl"
            :text="t('avbryt')"
            @on-click="localImageURL = imageUrl"
        />

        <InlineButton
            :text="t('lagre-endring')"
            :color="'bg-secondary'"
            :disable-condition="localImageURL === imageUrl"
            @on-click="$emit('saveImage', localImageURL)"
        />
    </div>
    <div>
        <img
            :src="localImageURL"
            class="mt-4 w-full rounded-xl object-contain"
            :alt="t('alt-text')"
        />
    </div>
</template>

<i18n lang="yaml">
nb:
    last-opp: Last opp
    avbryt: Avbryt
    lagre-endring: Lagre endring
    alt-text: Bilde av gruppemedlemmene
en:
    last-opp: Upload
    avbryt: Cancel
    lagre-endring: Save change
    alt-text: Picture of the group members
</i18n>
