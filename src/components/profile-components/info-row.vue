<script setup lang="ts">
    const props = defineProps({
        label: {
            type: String,
            required: true,
        },
        show: {
            type: Boolean,
            default: false,
        },
    })
</script>

<template>
    <tr v-if="show" class="odd:bg-neutral even:bg-neutralish">
        <td class="p-4">
            {{ props.label }}
        </td>
        <td class="p-4">
            <slot />
        </td>
    </tr>
</template>
