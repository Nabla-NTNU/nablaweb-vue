<script setup>
    const props = defineProps({
        groupURL: String,  
        groupName: String,
        groupLogo: String
    })
</script>

<template>
    <div style="padding: 20pt ">
    <RouterLink :to='`/for-komponenter/komiteer/${props.groupURL}`' v-if="props.groupURL">
        <div class = "text-center" >
            <img :src='props.groupLogo' class="square-aspect-ratio"style = 'margin-left: auto; margin-right: auto; height: 100pt;'>
            {{ props.groupName }}
        </div>
    </RouterLink>
    </div>
</template>