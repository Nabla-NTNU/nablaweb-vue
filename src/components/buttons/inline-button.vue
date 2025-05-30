<script setup lang="ts">
    const props = defineProps<{
        text: string,
        color?: string,
        disableCondition?: boolean
    }>()

    const emit = defineEmits([
        'action',
    ])
    const generatedClass = `mt-auto px-4 py-2 m-1 rounded-lg text-white font-semibold transition-all duration-300 ${props.color ? props.color : "bg-primary"} disabled:bg-gray`
</script>

<template>
    <button
    :class=generatedClass
    @click="$emit(action)"
    :disabled="disableCondition">
        {{ text }}
    </button>
</template>