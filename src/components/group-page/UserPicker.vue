<script setup lang="ts">
    import { ref } from "vue"
    import { GroupMember } from "@/lib/types/frontend.types"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    defineProps<{
        current: GroupMember | undefined
        members: GroupMember[] | undefined
    }>()

    const emit = defineEmits<{
        saveChosenUsername: [chosenUsername: string]
    }>()

    const chosenUsername = ref("")
    function handleSaveMember() {
        emit("saveChosenUsername", chosenUsername.value)
        chosenUsername.value = ""
    }
</script>

<template>
    <div class="md-2 flex">
        <input
            v-model="chosenUsername"
            list="new-leader"
            :placeholder="t('nytt-valg')"
            class="border m-2 w-full rounded bg-neutralish p-6 text-fg"
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
            class="m-2 mx-auto rounded-lg bg-secondary px-4 font-semibold text-white transition-all duration-300 disabled:bg-gray"
            :disabled="
                !members?.some(
                    (member) => member.user.username === chosenUsername,
                )
            "
            @click="handleSaveMember()"
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
