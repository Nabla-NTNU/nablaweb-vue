<script setup lang="ts">
    const props = defineProps<{
        id: string 
        name?: string
        logo?: URL
    }>()

    // This is technically a not null in database, however if something goes wrong we want to have a good fallback. Might be nice to centralise fallbacks somehow
    const defaultGroupLogo = new URL("https://images.stockcake.com/public/a/2/3/a230f389-32a5-4c81-9395-98b766afe8d5_medium/otters-floating-together-stockcake.jpg")
    const image = props.logo ? props.logo : defaultGroupLogo
</script>

<template>
    <div style="padding: 20pt ">
    <RouterLink :to='`/for-komponenter/komiteer/${props.id}`' v-if="props.id">
        <div class = "text-center" >
            <img :src='image.href' class="square-aspect-ratio"style = 'margin-left: auto; margin-right: auto; height: 100pt;'>
            {{ props.name ? props.name : "Ukjent gruppe" }}
        </div>
    </RouterLink>
    </div>
</template>