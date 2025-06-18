<script setup lang="ts">
    import { ref } from "vue"
    defineProps<{
        linkText: string
        linkTo: string
        dropdownItems?: {
            text: string
            link: string
        }[]
    }>()

    const dropdownIsVisible = ref(false)
</script>

<template>
    <div
        class="group: relative inline-block content-center text-center"
        @mouseenter="dropdownIsVisible = dropdownItems ? true : false"
    >
        <router-link
            class="my-2 rounded-full border-2 border-transparent px-4 py-2 transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
            :to="linkTo"
        >
            {{ linkText }}
        </router-link>
        <transition
            v-if="dropdownItems"
            enter-from-class="translate-y-[-150%] opacity-[0]"
            leave-to-class="translate-y-[-150%] opacity-[0]"
            enter-active-class="transition duration-300"
            leave-active-class="transition duration-300"
        >
            <div
                v-if="dropdownIsVisible"
                class="absolute left-1/2 top-[80%] -z-10 flex origin-top -translate-x-1/2 flex-col content-center bg-primary pt-4 text-fg"
                @mouseleave="dropdownIsVisible = false"
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
        </transition>
    </div>
</template>
