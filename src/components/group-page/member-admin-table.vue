<script setup lang="ts">
    import { ref, watch, computed } from 'vue'
    import { GroupMember, NablaUser } from '@/lib/types/frontend.types'

    const props = defineProps<{
        members: GroupMember[],
        notRemovable: GroupMember[],
        searchString: string,
        foundUsers: NablaUser[],
    }>()

    const emit = defineEmits<{
        saveMemberTable: [localMemberTable: GroupMember[]]
        searchForUsers: [searchString: string]
        updateSearchString: [searchString: string]
    }>()

    const localMemberTable = ref(props.members)
    
    watch(() => props.members, members => {
        localMemberTable.value = JSON.parse(JSON.stringify(props.members))
    })

    // Sorting logic
    const isSortedByDate = computed(() =>{
        for(let i = 1; i < localMemberTable.value.length; i++) {
            if (localMemberTable.value[i-1].date! > localMemberTable.value[i].date!) {
                return false
            }
        }
        return true
    })
    
    function sortMembersByDate() {
        localMemberTable.value = [...localMemberTable.value].sort((a, b) =>
            a.date!.getTime() - b.date!.getTime()
        )
        emit('saveMemberTable', localMemberTable.value)
    }

    // New member search logic
    const newRole = ref('')
    const searchString = computed({
        get: () => props.searchString,
        set:  searchString => {
            emit('updateSearchString', searchString)
            emit('searchForUsers', searchString)
        }
    })

    const searchIsValid = computed(() =>
        props.foundUsers.some(user => user.username == searchString.value)
    )

    function insertMember() {
        localMemberTable.value.push({
            user: {
                username: searchString.value
            },
            role: newRole.value,
            isActive: true
        })
        searchString.value = ''
        newRole.value = ''
        emit('saveMemberTable', localMemberTable.value)
    }
    
    // Order logic
    function incrementMember(index: number) {
        [localMemberTable.value[index], localMemberTable.value[index - 1]] = [localMemberTable.value[index - 1], localMemberTable.value[index]];
        emit('saveMemberTable', localMemberTable.value);
    }

    function decrementMember(index: number) {
        if (index === localMemberTable.value.length - 1) return;
        [localMemberTable.value[index], localMemberTable.value[index + 1]] = [localMemberTable.value[index + 1], localMemberTable.value[index]];
        emit('saveMemberTable', localMemberTable.value);
    }

    function removeMember(index: number) {
        localMemberTable.value[index].isActive = false
        emit('saveMemberTable', localMemberTable.value);
    }
</script>

<template>
    <div>
    <table class="min-w-full table-auto mb-4">
        <thead>
            <tr>
                <th class="w-auto whitespace-nowrap text-left px-2">Navn</th>
                <th class="whitespace-nowrap px-2">Kull</th>
                <th class="whitespace-nowrap">Rolle</th>
                <th class="w-auto whitespace-nowrap px-2">Dato</th>
                <th class="whitespace-nowrap px-2">Flytt</th>
                <th class="whitespace-nowrap px-2"><!-- available action --></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(member, index) in localMemberTable">
                <td class="text-left px-2" v-if="member.user.firstName && member.user.lastName">
                    {{  member.user.firstName ? member.user.firstName : '' }} {{ member.user.lastName ? member.user.lastName : ''}} 
                </td>
                <td v-else />
                <td>
                    {{ member.user.class ? member.user.class : '' }}
                </td>
                <td class="px-2">
                    <textarea class="border rounded p-3 resize-none h-[2.5rem] min-w-3xs" placeholder="Kuleste medlem!" v-model="member.role"/>
                </td>
                <td>
                    {{ member.date? new Date(member.date).toDateString(): '' }}
                </td> 
                <td>
                    <button class="mt-auto px-4 py-2 m-1 rounded-lg text-white font-semibold transition-all duration-300 bg-primary disabled:bg-gray" @click="incrementMember(index)" :disabled="index === 0">
                        Δ
                    </button>
                    <button class="mt-auto px-4 py-2 m-1 rounded-lg text-white font-semibold transition-all duration-300 bg-primary disabled:bg-gray" @click="decrementMember(index)" :disabled="index === localMemberTable.length - 1">
                        ∇
                    </button>
                </td>
                <td>
                    <button class="mt-auto px-4 py-2 m-1 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary disabled:bg-gray"
                            v-if="member.role == props.members[index]?.role"
                            @click="removeMember(index)":disabled="notRemovable.some(nonRemovableMember => nonRemovableMember.user.username == member.user.username)">
                        Slett
                    </button>
                    <button class="mt-auto px-4 py-2 m-1 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" v-else @click="$emit('saveMemberTable', localMemberTable)">
                        Lagre
                    </button>
                </td>
            </tr>
            <tr>
                <td class="text-left whitespace-nowrap px-2" colspan="2">
                    <input
                        list="user-list"
                        v-model="searchString"
                        placeholder="Søk etter ny medlem"
                        class="border rounded p-2 w-full"
                    />
                    <datalist id="user-list" >
                        <div v-for="user in foundUsers">
                            <option
                                :key="user.username"
                                :value="user.username"
                            >
                                {{ user.firstName }} {{ user.lastName }}, {{ user.class }}
                            </option>
                        </div>
                    </datalist>
                </td>
                <td class="px-2">
                    <input v-model='newRole' placeholder="Den nye rollen" class="border rounded p-2 w-full"/>
                </td>
                <td colspan="3">
                    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary disabled:bg-gray" @click="insertMember()" :disabled="!searchIsValid">
                        Legg ny medlem inn! 
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary disabled:bg-gray" @click="sortMembersByDate()" :disabled="isSortedByDate">
        Sorter etter dato
    </button>
</template>