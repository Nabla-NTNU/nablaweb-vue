<script setup>
    import { ref, watch } from 'vue'
    
    const props = defineProps({
        current: "",
        members: [{}]
    })

    const chosenUsername = ref('')
    const emit = defineEmits([
        'saveChosenUsername'
    ])
</script>

<template>
    <div class="md-4 flex">
        <input
            list="new-leader"
            v-model="chosenUsername"
            placeholder="Ny leder?"
            class="border rounded p-2 w-full m-2"
        />
        <datalist id="new-leader" v-if="members" class="mx-4">
            <div v-for="member in members">
                <option v-if="member.username !== chosenUsername" :value="member.username">
                    {{ member.firstName }} {{ member.lastName }}, {{ member.class }}, {{ member.role }}
                </option>
            </div>
        </datalist>
        <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary disabled:bg-gray" @click="$emit('saveChosenUsername', chosenUsername)" :disabled="!members.some(member => member.username === chosenUsername)">
            Velg
        </button>
    </div>
</template>
