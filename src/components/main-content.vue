<!-- We have a bug where the page loaded on a phone looks horrible, wider than the screen. Might be tailwind error here -->
<script setup lang="ts">
    // No special logic
</script>

<template>
    <div class="mx-auto flex-1 overflow-auto font-poppins text-m text-fg">
        <slot></slot>
    </div>
</template>
