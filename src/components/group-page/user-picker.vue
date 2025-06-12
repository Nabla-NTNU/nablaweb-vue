<script setup lang="ts">
    import { ref } from "vue"
    import { GroupMember } from "@/lib/types/frontend.types"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    defineProps<{
        current: GroupMember | undefined
        members: GroupMember[] | undefined
    }>()

    defineEmits<{
        saveChosenUsername: [chosenUsername: string]
    }>()

    const chosenUsername = ref("")
</script>

<template>
    <div class="md-4 flex">
        <input
            v-model="chosenUsername"
            list="new-leader"
            :placeholder="t('nytt-valg')"
            class="border m-2 w-full rounded bg-neutralish p-2 text-fg"
        />
        <datalist v-if="members" id="new-leader" class="mx-4">
            <div v-for="member in members" :key="member.user.username">
                <option
                    v-if="
                        member.user.username !==
                        (current ? current.user.username : '')
                    "
                    :value="member.user.username"
                >
                    {{ member.user.firstName }} {{ member.user.lastName }},
                    {{ member.user.class }},
                    {{ member.role }}
                </option>
            </div>
        </datalist>
        <button
            class="mt-auto rounded-lg bg-secondary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
            :disabled="
                !members?.some(
                    (member) => member.user.username === chosenUsername,
                )
            "
            @click="$emit('saveChosenUsername', chosenUsername)"
        >
            {{ t("velg") }}
        </button>
    </div>
</template>

<i18n lang="yaml">
nb:
    nytt-valg: Nytt valg
    velg: Velg
en:
    nytt-valg: New choice
    velg: Choose
</i18n>
