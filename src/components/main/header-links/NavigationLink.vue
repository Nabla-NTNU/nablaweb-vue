<script setup lang="ts">
    defineProps<{
        linkText: string
        linkTo: string
        dropdownItems?: {
            text: string
            link: string
        }[]
    }>()
</script>

<template>
    <div class="group relative inline-block content-center text-center">
        <router-link
            class="my-2 rounded-full border-2 border-transparent px-4 py-2 transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
            :to="linkTo"
        >
            {{ linkText }}
        </router-link>
        <!-- The tailwind below is a bit horrible,
         and not 100% reliable. If anyone wants to
         redo, you're very welcome. Is doable via
         DOM listeners, I'm just not confident in
         using such things yet.-->
        <div
            class="absolute left-1/2 top-[80%] -z-10 flex origin-top -translate-x-1/2 -translate-y-full flex-col content-center bg-primary pt-4 text-fg opacity-0 transition-all duration-200 group-hover:-translate-y-[0px] group-hover:opacity-100"
        >
            <router-link
                v-for="item in dropdownItems"
                :key="item.text"
                :to="item.link"
                class="rounded-full border-2 border-transparent bg-primary px-4 py-2 text-white shadow-[20px] transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
            >
                {{ item.text }}
            </router-link>
        </div>
    </div>
</template>
