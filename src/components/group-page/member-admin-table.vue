<script setup>
    import { ref, watch, computed } from 'vue'

    const props = defineProps({
        members: [{}],
        notRemovable: [{}],
        searchString: "",
        foundUsers: [{}],
    })

    const emit = defineEmits([
        'searchForUsers',
        'saveMemberTable',
        'update:searchString'
    ])

    const localMemberTable = ref(props.members)
    
    watch(() => props.members, members => {
        localMemberTable.value = JSON.parse(JSON.stringify(props.members))
    })

    const sortedMemberTable = computed(() => 
        [...localMemberTable.value].sort((a, b) =>
            new Date(a.dateJoined) - new Date(b.dateJoined)
        )
    )

    const isSorted = computed(() =>
        JSON.stringify(localMemberTable.value) === JSON.stringify(sortedMemberTable.value)
    )

    const searchString = computed({
        get: () => props.searchString,
        set:  searchString => {
            emit('update:searchString', searchString)
            emit('searchForUsers', searchString)
        }
    })
    const searchIsValid = computed(() =>
        props.foundUsers.some(user => user.username === searchString.value)
    )
    const newRole = ref('')

    function sortMembers() {
        localMemberTable.value = sortedMemberTable.value
        emit('saveMemberTable', localMemberTable.value)
    }

    function incrementMember(index) {
        [localMemberTable.value[index], localMemberTable.value[index - 1]] = [localMemberTable.value[index - 1], localMemberTable.value[index]];
        emit('saveMemberTable', localMemberTable.value);
    }

    function decrementMember(index) {
        if (index === localMemberTable.value.length - 1) return;
        [localMemberTable.value[index], localMemberTable.value[index + 1]] = [localMemberTable.value[index + 1], localMemberTable.value[index]];
        emit('saveMemberTable', localMemberTable.value);
    }

    function removeMember(index) {
        localMemberTable.value[index].isActive = false
        emit('saveMemberTable', localMemberTable.value);
    }

    function insertMember() {
        localMemberTable.value.push({
            username: searchString.value,
            role: newRole.value? newRole.value : '',
            isActive: true
        })
        searchString.value = ''
        newRole.value = ''
        emit('saveMemberTable', localMemberTable.value)
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
                <td class="text-left px-2" v-if="member.firstName && member.lastName">
                    {{  member.firstName ? member.firstName : '' }} {{ member.lastName ? member.lastName : ''}} 
                </td>
                <td v-else />
                <td>
                    {{ member.class ? member.class : '' }}
                </td>
                <td class="px-2">
                    <textarea class="border rounded p-3 resize-none h-[2.5rem] min-w-3xs" placeholder="Kuleste medlem!" v-model="member.role"/>
                </td>
                <td>
                    {{ member.dateJoined? new Date(member.dateJoined).toDateString(): '' }}
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
                    <button class="mt-auto px-4 py-2 m-1 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary disabled:bg-gray" v-if="member.role == props.members[index]?.role" @click="removeMember(index)" :disabled="notRemovable.includes(member.username)">
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
                        <div v-for="nablaUser in foundUsers">
                            <option
                                :key="nablaUser.username"
                                :value="nablaUser.username"
                            >
                                {{ nablaUser.first_name }} {{ nablaUser.last_name }}, {{ nablaUser.class }}
                            </option>
                        </div>
                    </datalist>
                </td>
                <td class="px-2">
                    <input v-model='newRole' placeholder="Den nye rollen" class="border rounded p-2 w-full"/>
                </td>
                <td colspan="3">
                    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary disabled:bg-gray" @click="insertMember(searchString, newRole)" :disabled="!searchIsValid">
                        Legg ny medlem inn! 
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary disabled:bg-gray" @click="sortMembers" :disabled="isSorted">
        Sorter etter dato
    </button>
</template>