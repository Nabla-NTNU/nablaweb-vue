<script setup lang="ts">
    const props = defineProps<{
        text: string
        color?: string
        disableCondition?: boolean
    }>()

    defineEmits<{
        onClick
    }>()
    const generatedClass = `m-auto items-center text-nowrap px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${props.color ? props.color : "bg-primary"} disabled:bg-gray`
</script>

<template>
    <div class="flex">
        <button
            :class="generatedClass"
            :disabled="disableCondition"
            @click="$emit('onClick')"
        >
            {{ text }}
        </button>
    </div>
</template>
