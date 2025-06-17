<script setup lang="ts">
    defineProps<{
        linkText: string
        linkTo: string
    }>()
</script>

<template>
    <router-link
        class="mx-2 my-2 rounded-full border-2 border-transparent px-4 py-2 transition-all duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light"
        :to="linkTo"
    >
        {{ linkText }}
    </router-link>
</template>
