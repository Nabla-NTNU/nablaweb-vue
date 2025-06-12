<!-- We have a bug where the page loaded on a phone looks horrible, wider than the screen. Might be tailwind error here -->
<script setup lang="ts">
    // No special logic
</script>

<template>
    <div class="mx-auto max-w-280 font-poppins text-m text-fg">
        <slot></slot>
    </div>
</template>
