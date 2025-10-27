<script setup lang="ts">
    defineProps<{
        showColumnTitles?: boolean
        columnTitles?: string[]
    }>()
</script>

<template>
    <div class="border overflow-hidden rounded-lg border-black">
        <table class="border w-full table-auto">
            <thead>
                <tr v-for="colTitle in columnTitles" :key="colTitle">
                    <th>
                        {{ colTitle }}
                    </th>
                </tr>
            </thead>

            <tbody
                class="[&>tr:hover]:!bg-primary-25 [&>tr:nth-child(even)]:bg-neutralish [&>tr:nth-child(odd)]:bg-neutral [&>tr>td]:p-4"
            >
                <slot />
            </tbody>
        </table>
    </div>
</template>
