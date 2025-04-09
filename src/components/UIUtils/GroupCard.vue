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
    <RouterLink :to='link'>
        <div class = "text-center w-40">
            <img :src='props.groupLogo' class = 'rounded-xl'>
            {{ props.groupName }}
        </div>
    </RouterLink>
</template>