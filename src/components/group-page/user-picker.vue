<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { NablaUser, GroupMember } from '@/lib/types/frontend.types'
    
    const props = defineProps<{
        current: GroupMember | undefined
        members: GroupMember[] | undefined
    }>()

    const emit = defineEmits<{
        saveChosenUsername: [chosenUsername: string]
    }>()

    const chosenUsername = ref('')
</script>

<template>
    <div class="md-4 flex">
        <input
            list="new-leader"
            v-model="chosenUsername"
            placeholder="Nytt valg:"
            class="border rounded p-2 w-full m-2"
        />
        <datalist id="new-leader" v-if="members" class="mx-4">
            <div v-for="member in members">
                <option v-if="member.user.username !== (current ? current.user.username : '')"
                    :value="member.user.username"
                    >
                        {{ member.user.firstName }} {{ member.user.lastName }},
                        {{ member.user.class }},
                        {{ member.role }}
                </option>
            </div>
        </datalist>
        <button
            class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary disabled:bg-gray"
            @click="$emit('saveChosenUsername', chosenUsername)"
            :disabled="!members?.some(member => member.user.username === chosenUsername)"
            >
                Velg
        </button>
    </div>
</template>
