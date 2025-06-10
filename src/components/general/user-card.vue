<script setup lang="ts">
    const props = defineProps<{ 
        username: string,
        firstName?: string,           
        lastName?: string,
        profilePicture?: URL,
        memberRole?: string  
    }>()

    const image: URL = props.profilePicture ? props.profilePicture : new URL('')
</script>

<template>
    <div class = "text-center w-40">
        <img :src='image.href' class = 'rounded-xl'>
        {{ props.lastName }}, {{ props.firstName }}
        <br>
        <i> {{ props.memberRole }} </i>
    </div>
</template>