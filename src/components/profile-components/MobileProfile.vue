<script setup lang="ts">
    // import { useI18n } from "vue-i18n"
    // const { locale } = useI18n()
    import InfoTable from "@/components/profile-components/info-table.vue"
    import { ref } from "vue"

    const props = defineProps({
        username: {
            type: String,
            required: true,
        },
    })

    const tableShown = ref(false)
</script>

<template>
    <button class="bg-gray-400" @click="tableShown = !tableShown">test!</button>

    <div class="bg-fg">
        <InfoTable v-if="tableShown" :username="props.username" />
    </div>
</template>
