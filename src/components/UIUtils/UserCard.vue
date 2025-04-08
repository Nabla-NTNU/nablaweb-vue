<script setup>
    const props = defineProps({ 
        school_email: String,
        first_name: String,           
        last_name: String,
        profile_picture: String,
        member_role: String  
    })
</script>

<template>
    <div class = "text-center w-40">
        <img :src='props.profile_picture' class = 'rounded-xl'>
        {{ props.last_name }}, {{ props.first_name }}
        <br>
        <i> {{  props.member_role || "."  }} </i>
    </div>
</template>