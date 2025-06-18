<script setup lang="ts">
    import { ref } from "vue"
    const props = defineProps<{
        linkText: string
        linkTo: string
        dropdownItems?: {
            text: string
            link: string
        }[]
    }>()

    const dropdownIsVisible = ref(false)
    console.log(props)
</script>

<template>
    <div class="relative content-center text-center">
        <router-link
            class="mx-2 my-2 rounded-full border-2 border-transparent px-4 py-2 transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
            :to="linkTo"
            @mouseenter="dropdownIsVisible = dropdownItems ? true : false"
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
                class="absolute left-1/2 top-[80%] -z-10 origin-top -translate-x-1/2 content-center p-4 text-fg"
                @mouseleave="dropdownIsVisible = false"
            >
                <div
                    v-for="item in dropdownItems"
                    :key="item.text"
                    class="mx-2 my-2 rounded-full border-2 border-transparent bg-primary px-4 py-2 text-white shadow-[20px] transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
                >
                    <router-link :to="item.link"> {{ item.text }} </router-link>
                </div>
            </div>
        </transition>
    </div>
</template>
