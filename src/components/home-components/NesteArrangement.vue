<script setup lang="ts">
    // TODO
</script>

<template>
    <div class="flex items-center justify-between">
        <!-- Image -->
        <img
            class="ml-8 w-100"
            src="../../assets/images/Stock-people.jpg"
            alt="Image"
        />

        <!-- Text and buttons -->
        <div>
            <div class="w-140">
                <div class="font-lato text-subtitle-1 text-fg">
                    Neste fredag:
                </div>
                <div class="font-poppins text-title-1 text-fg">
                    Immatrikuleringsball
                </div>
                <div class="font-lato text-m text-fg">
                    Insert en beskrivelse av det neste arrangementet her. Insert
                    en beskrivelse av det neste arrangementet her. Insert en
                    beskrivelse av det neste arrangementet her. Insert en
                    beskrivelse av det neste arrangementet her.
                </div>
            </div>

            <div class="mt-8 flex w-120 justify-around">
                <router-link to="/" class="p-2 underline">Se flere</router-link>
                <router-link
                    to="/"
                    class="rounded-[4px] bg-primary-500 p-2 text-white"
                >
                    Meld deg på!
                </router-link>
            </div>
        </div>
    </div>
</template>
