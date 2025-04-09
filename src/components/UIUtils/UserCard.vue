<script setup>
    const props = defineProps({ 
        userName: String,
        firstName: String,           
        lastName: String,
        profilePicture: String,
        memberRole: String  
    })
</script>

<template>
    <div class = "text-center w-40">
        <img :src='props.profilePicture' class = 'rounded-xl'>
        {{ props.lastName }}, {{ props.firstName }}
        <br>
        <i> {{  props.memberRole || "."  }} </i>
    </div>
</template>