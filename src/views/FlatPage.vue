<script setup lang="ts">
    import { useFlatPage } from "@/composables/useFlatPage"
    import UnderKontruksjon from "@/views/error/UnderKontruksjon.vue"

    const props = defineProps({
        slug: String,
    })

    const { page, loading } = useFlatPage(props.slug)
    console.log(props.slug)

    console.log(page)
</script>

<template>
    efsdyfyugi

    <div class="mx-auto flex-1 overflow-auto font-poppins text-m text-fg">
        {{ props.slug }}
        <div v-if="loading">Loading</div>

        <div v-else>
            <div v-if="page">
                test
                {{ page.content }}
                {{ page.slug }}
            </div>

            <div v-else>
                <UnderKontruksjon />
            </div>
        </div>
    </div>
</template>
