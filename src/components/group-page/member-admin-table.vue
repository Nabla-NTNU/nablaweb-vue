<script setup lang="ts">
    import { ref, watch, computed } from "vue"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { GroupMember, NablaUser } from "@/lib/types/frontend.types"

    const props = defineProps<{
        members: GroupMember[]
        notRemovable: GroupMember[]
        foundUsers: NablaUser[]
    }>()

    const emit = defineEmits<{
        saveMemberTable: [localMemberTable: GroupMember[]]
        searchForUsers: [searchString: string]
        updateSearchString: [searchString: string]
    }>()

    const localMemberTable = ref(props.members)

    watch(
        () => props.members,
        () => {
            localMemberTable.value = JSON.parse(JSON.stringify(props.members))
        },
    )

    // Sorting logic
    const isSortedByDate = computed(() => {
        for (let i = 1; i < localMemberTable.value.length; i++) {
            if (
                localMemberTable.value[i - 1].date! >
                localMemberTable.value[i].date!
            ) {
                return false
            }
        }
        return true
    })

    function sortMembersByDate() {
        localMemberTable.value = [...localMemberTable.value].sort(
            (a, b) => a.date!.getTime() - b.date!.getTime(),
        )
        emit("saveMemberTable", localMemberTable.value)
    }

    // New member search logic
    const newRole = ref("")
    const newUser = ref("")
    const searchString = computed({
        get: () => newUser.value,
        set: (searchString) => {
            if (newUser.value != searchString) {
                emit("updateSearchString", searchString)
                emit("searchForUsers", searchString)
                newUser.value = searchString
            }
        },
    })

    const searchIsValid = computed(() =>
        props.foundUsers.some((user) => user.username == searchString.value),
    )

    function insertMember() {
        localMemberTable.value.push({
            user: {
                username: searchString.value,
            },
            role: newRole.value,
            isActive: true,
        })
        searchString.value = ""
        newRole.value = ""
        emit("saveMemberTable", localMemberTable.value)
    }

    // Order logic
    function incrementMember(index: number) {
        ;[localMemberTable.value[index], localMemberTable.value[index - 1]] = [
            localMemberTable.value[index - 1],
            localMemberTable.value[index],
        ]
        emit("saveMemberTable", localMemberTable.value)
    }

    function decrementMember(index: number) {
        if (index === localMemberTable.value.length - 1) return
        ;[localMemberTable.value[index], localMemberTable.value[index + 1]] = [
            localMemberTable.value[index + 1],
            localMemberTable.value[index],
        ]
        emit("saveMemberTable", localMemberTable.value)
    }

    function removeMember(index: number) {
        localMemberTable.value[index].isActive = false
        emit("saveMemberTable", localMemberTable.value)
    }
</script>

<template>
    <div>
        <table class="min-w-full mb-4 table-auto">
            <thead>
                <tr>
                    <th class="w-auto whitespace-nowrap px-2 text-left">
                        {{ t("navn") }}
                    </th>
                    <th class="whitespace-nowrap px-2">{{ t("kull") }}</th>
                    <th class="whitespace-nowrap">{{ t("rolle") }}</th>
                    <th class="w-auto whitespace-nowrap px-2">
                        {{ t("dato") }}
                    </th>
                    <th class="whitespace-nowrap px-2">{{ t("flytt") }}</th>
                    <th class="whitespace-nowrap px-2">
                        <!-- available action -->
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(member, index) in localMemberTable"
                    :key="member.user.username"
                >
                    <td
                        v-if="member.user.firstName && member.user.lastName"
                        class="px-2 text-left"
                    >
                        {{ member.user.firstName ? member.user.firstName : "" }}
                        {{ member.user.lastName ? member.user.lastName : "" }}
                    </td>
                    <td v-else />
                    <td>
                        {{ member.user.class ? member.user.class : "" }}
                    </td>
                    <td class="px-2">
                        <textarea
                            v-model="member.role"
                            class="border min-w-3xs h-[2.5rem] resize-none rounded bg-neutralish p-3 text-fg"
                            :placeholder="t('rolle-placeholder')"
                        />
                    </td>
                    <td>
                        {{
                            member.date
                                ? new Date(member.date).toDateString()
                                : ""
                        }}
                    </td>
                    <td class="justify-center">
                        <button
                            class="m-1 mt-auto rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
                            :disabled="index === 0"
                            @click="incrementMember(index)"
                        >
                            Δ
                        </button>
                        <button
                            class="m-1 mt-auto rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
                            :disabled="index === localMemberTable.length - 1"
                            @click="decrementMember(index)"
                        >
                            ∇
                        </button>
                    </td>
                    <td>
                        <button
                            v-if="member.role == props.members[index]?.role"
                            class="m-1 mt-auto rounded-lg bg-secondary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
                            :disabled="
                                notRemovable.some(
                                    (nonRemovableMember) =>
                                        nonRemovableMember.user.username ==
                                        member.user.username,
                                )
                            "
                            @click="removeMember(index)"
                        >
                            {{ t("slett") }}
                        </button>
                        <button
                            v-else
                            class="m-1 mt-auto rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
                            @click="$emit('saveMemberTable', localMemberTable)"
                        >
                            {{ t("lagre") }}
                        </button>
                    </td>
                </tr>
                <tr>
                    <td class="whitespace-nowrap px-2 text-left" colspan="2">
                        <input
                            v-model="searchString"
                            list="user-list"
                            :placeholder="t('søk-etter-ny-medlem')"
                            class="border w-full rounded bg-neutralish p-2 text-fg"
                        />
                        <datalist id="user-list">
                            <div
                                v-for="user in foundUsers"
                                :key="user.username"
                            >
                                <option
                                    :key="user.username"
                                    :value="user.username"
                                >
                                    {{ user.firstName }} {{ user.lastName }},
                                    {{ user.class }}
                                </option>
                            </div>
                        </datalist>
                    </td>
                    <td class="px-2">
                        <input
                            v-model="newRole"
                            :placeholder="t('den-nye-rollen')"
                            class="border w-full rounded bg-neutralish p-2 text-fg"
                        />
                    </td>
                    <td colspan="3">
                        <button
                            class="mt-auto rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
                            :disabled="!searchIsValid"
                            @click="insertMember()"
                        >
                            {{ t("legg-ny-medlem-inn") }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <button
        class="mt-auto rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300 disabled:bg-gray"
        :disabled="isSortedByDate"
        @click="sortMembersByDate()"
    >
        {{ t("sorter-etter-dato") }}
    </button>
</template>

<i18n lang="yaml">
nb:
    navn: Navn
    kull: Kull
    rolle: Rolle
    dato: Dato
    flytt: Flytt
    rolle-placeholder: Kuleste medlem!
    slett: Slett
    lagre: Lagre
    søk-etter-ny-medlem: Søk etter ny medlem
    den-nye-rollen: Den nye rollen
    legg-ny-medlem-inn: Legg ny medlem inn!
    sorter-etter-dato: Sorter etter dato
en:
    navn: Name
    kull: Class
    rolle: Role
    dato: Date
    flytt: Move
    rolle-placeholder: Coolest member!
    slett: Delete
    lagre: Save
    søk-etter-ny-medlem: Search for new member
    den-nye-rollen: The member's role
    legg-ny-medlem-inn: Add new member!
    sorter-etter-dato: Sort by date
</i18n>
