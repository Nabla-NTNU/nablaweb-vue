<script setup lang="ts">
    const props = defineProps({
        username: {
            type: String,
            required: true,
        },
    })

    import { useUser } from "@/composables/useNablaUser"
    import InfoRow from "./info-row.vue"
    const { user } = useUser(props.username)
</script>

<template>
    <div class="overflow-hidden rounded-lg border-black">
        <table class="border w-full table-auto">
            <tbody>
                <InfoRow label="Brukarnamn" :show="!!user?.username">
                    {{ user?.username }}
                </InfoRow>
                <InfoRow label="Epost" :show="!!user?.publicEmail">
                    <a
                        class="text-primary hover:text-primary-500"
                        :href="'mailto:' + user?.publicEmail"
                    >
                        {{ user?.publicEmail }}
                    </a>
                </InfoRow>
                <InfoRow label="Hjemmeside" :show="!!user?.website">
                    <a
                        class="text-primary hover:text-primary-500"
                        :href="user?.website?.toString()"
                    >
                        {{ user?.website }}
                    </a>
                </InfoRow>
                <InfoRow label="Medlem av" :show="!!user?.memberOf">
                    <!-- <ul>
                        <li v-for="group in user?.memberOf">
                            {{ group.name }}
                        </li>
                    </ul> -->
                </InfoRow>
            </tbody>
        </table>
    </div>
</template>
