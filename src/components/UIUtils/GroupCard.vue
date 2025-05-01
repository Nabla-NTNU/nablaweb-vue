<script setup>
    import { computed } from 'vue'
    
    const props = defineProps({
        groupMail: String, 
        groupKind: String, 
        groupName: String, 
        groupURL: String,  
        groupLogo: String
    })

    const link = computed(() => `/for-komponenter/komiteer/${props.groupURL}`)
</script>

<template>
    <div style="padding: 20pt ">
    <RouterLink :to='link'>
        <div class = "text-center" >
            <img :src='props.groupLogo' class="square-aspect-ratio"style = 'margin-left: auto; margin-right: auto; height: 100pt;'>
            {{ props.groupName }}
        </div>
    </RouterLink>
    </div>
</template>