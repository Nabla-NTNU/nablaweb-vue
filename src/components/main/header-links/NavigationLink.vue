<script setup lang="ts">
    defineProps<{
        linkText: string
        linkTo: string
        dropdownItems?: {
            text: string
            link: string
        }[]
        isFocused: boolean
    }>()
</script>

<template>
    <div class="group relative h-header items-center">
        <router-link
            class="box h-4/5 content-center rounded-full border-2 border-transparent px-4 transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
            :to="linkTo"
            :disabled="!isFocused"
        >
            {{ linkText }}
        </router-link>
        <Transition
            enter-from-class="-translate-y-full"
            enter-to-class=""
            leave-from-class=""
            leave-to-class="-translate-y-full"
        >
            <div
                v-if="dropdownItems && isFocused"
                class="absolute left-1/2 top-[80%] -z-10 flex origin-top -translate-x-1/2 flex-col content-center items-center rounded-b-[30px] bg-primary p-2 pt-4 text-fg transition-all duration-200"
            >
                <router-link
                    v-for="item in dropdownItems"
                    :key="item.text"
                    :to="item.link"
                    class="text-nowrap rounded-full border-2 border-transparent bg-primary px-4 py-2 text-white shadow-[20px] transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
                >
                    {{ item.text }}
                </router-link>
            </div>
        </Transition>
    </div>
</template>
