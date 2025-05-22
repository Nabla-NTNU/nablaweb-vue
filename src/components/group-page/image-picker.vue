<script setup lang="ts">
    import { ref, watch } from 'vue'

    const props = defineProps<{
        imageURL: string
        uploadImage: (file: File) => Promise<string | null>
    }>()

    const emit = defineEmits<{
        (e: 'saveImageURL', url: string): void
    }>()

    const localImageURL = ref(props.imageURL)
    watch(() => props.imageURL, url => {
        localImageURL.value = url
    })

    // ChatGPT code tbh - pls do look over
    async function handleFileUpload(e: DragEvent | Event) {
        let files: FileList | null = null

        // 1) file-input change
        if (e instanceof Event && 'target' in e) {
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
        console.log(url)
        if (url) {
            localImageURL.value = url       // update preview in child
        }
    }
</script>

<template>
    <div
        class="flex gap-4 m-2 p-4 border-2 border-dashed rounded-xl border-gray-300"
        @dragover.prevent
        @drop.prevent="handleFileUpload"
    >
        <input
            class="w-full rounded-xl px-4"
            v-model="localImageURL"
            placeholder="https://nabla.no/det_kuleste_bildet"
        />

        <input
            type="file"
            accept="image/*"
            class="hidden"
            id="fileInput"
            @change="handleFileUpload"
        />
        <label
            for="fileInput"
            class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary cursor-pointer"
            v-if="localImageURL === imageURL"
        >
            Last opp lokalt
        </label>
        <button
            class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary cursor-pointer"
            @click="localImageURL = imageURL"
            v-if="localImageURL !== imageURL"
        >
            Gå tilbake
        </button>


        <button
            type="button"
            class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary disabled:bg-gray"
            @click="$emit('saveImageURL', localImageURL)"
            :disabled="localImageURL === imageURL"
        >
            Lagre nytt bilde
        </button>
    </div>
    <div v-if="localImageURL !== imageURL">
        <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
            Preview:
        </h2>
        <img
        :src="localImageURL"
        class="w-full object-contain mt-4 rounded-xl"
        alt="Flotte folk"
        />
    </div>
</template>
