<script setup>
import { computed } from 'vue'
    const props = defineProps({
        group_mail: String, 
        group_kind: String, 
        group_name: String, 
        group_url: String,  
        group_logo: String
    })

    const link = computed(() => `/for-komponenter/komiteer/${props.group_mail}`)
</script>

<template>
    <RouterLink :to='link'>
        <div class = "text-center w-40">
            <img :src='props.group_logo' class = 'rounded-xl'>
            {{ props.group_name }}
        </div>
    </RouterLink>
</template>