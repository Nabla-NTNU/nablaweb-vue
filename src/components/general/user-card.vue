<script setup lang="ts">
    const props = defineProps<{ 
        username: string,
        firstName?: string,           
        lastName?: string,
        profilePicture?: URL,
        memberRole?: string  
    }>()
    const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg'
    const image: URL = props.profilePicture ? props.profilePicture : new URL(defaultImage)
</script>

<template>
    <div class = "text-center w-40">
        <img :src='image.href' class = 'rounded-xl'>
        {{ props.lastName }}, {{ props.firstName }}
        <br>
        <i> {{ props.memberRole }} </i>
    </div>
</template>