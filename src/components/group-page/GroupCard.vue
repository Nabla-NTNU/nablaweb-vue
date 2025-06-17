<script setup lang="ts">
    import { defaultGroupLogo } from "@/lib/defaultImages.ts"

    const props = defineProps<{
        id: string
        name?: string
        logo?: URL
    }>()

    const image = props.logo ? props.logo : defaultGroupLogo
</script>

<template>
    <div style="padding: 20pt">
        <RouterLink
            v-if="props.id"
            :to="`/for-komponenter/komiteer/${props.id}`"
        >
            <div class="text-center">
                <img
                    :src="image.href"
                    class="square-aspect-ratio"
                    style="margin-left: auto; margin-right: auto; height: 100pt"
                />
                {{ props.name ? props.name : "Ukjent gruppe" }}
            </div>
        </RouterLink>
    </div>
</template>
