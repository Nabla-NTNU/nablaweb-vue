<script setup lang='ts'>
    // TODO
</script>

<template>
    <div class="flex items-center justify-between">
        
        <!-- Image -->
        <img class="w-100 ml-8" src="../../assets/images/Stock-people.jpg" alt="Image">
        
        <!-- Text and buttons -->
        <div>
            <div class="w-140">
                <div class="text-dark font-lato text-subtitle-1">Neste fredag:</div>
                <div class="text-dark font-poppins text-title-1">Immatrikuleringsball</div>
                <div class="text-dark font-lato text-m">Insert en beskrivelse av det neste arrangementet her. Insert en beskrivelse av det neste arrangementet her. Insert en beskrivelse av det neste arrangementet her. Insert en beskrivelse av det neste arrangementet her.</div>
            </div>
            
            <div class="flex justify-around w-120 mt-8">
                <router-link to="/" class="underline p-2">Se flere</router-link>
                <router-link to="/" class="bg-primary-500 text-white p-2 rounded-[4px]">Meld deg på!</router-link>

            </div>
        </div>

        
    </div>
</template>