<script setup>
    import { ref, watch } from 'vue'

    const props = defineProps({
        imageURL: String
    })
    
    const localImageURL = ref(props.imageURL)

    watch(localImageURL, (v) => {
        emit('update:imageURL', v)
    })

    function saveURL() {
        throw "TODO: Implement"
    }

    function uploadImage() {
        throw "TODO: Implement"
    }
    
</script>

<template>
    <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
        Endre gruppebilde
    </h2>
    Disse kan enten peke mot et bilde ute på nettet, eller lastes opp. Dersom dere laster opp - vi fastsetter maks ____ Mb per bilde. Det er ingen fast størrelse på bildet. Gjerne sjekk at det ser presentabelt på alle størrelser skjermer, fra mobiltelefon til storskjerm.
    <div class="flex gap-4">
        <input class="w-full" v-model="localImageURL" placeholder="https://nabla.no/det_kuleste_bildet">
        <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" @click="saveURL()">
            Lagre annen URL
        </button>
        <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary" @click="uploadImage()">
            Last opp nytt
            <!-- TODO!!! -->
        </button>
    </div>
</template>