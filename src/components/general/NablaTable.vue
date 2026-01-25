<script setup lang="ts">
    defineProps<{
        columnTitles?: string[]
    }>()
</script>

<template>
    <div class="border overflow-scroll rounded-lg border-black">
        <table class="border min-w-max w-full table-auto">
            <thead v-if="columnTitles">
                <tr>
                    <th
                        v-for="(colTitle, index) in columnTitles"
                        :key="colTitle"
                        :class="{
                            'left-0 sticky z-10 bg-neutral': index === 0,
                        }"
                    >
                        {{ colTitle }}
                    </th>
                </tr>
            </thead>

            <!-- TODO Change colour after hovering. Should be as simple as adding [&>tr:hover]:!bg-[colour] to the class underneath -->
            <tbody
                class="text-center [&>tr:nth-child(evem)]:bg-neutral [&>tr:nth-child(odd)]:bg-neutralish [&>tr>td]:p-4"
            >
                <slot />
            </tbody>
        </table>
    </div>
</template>
