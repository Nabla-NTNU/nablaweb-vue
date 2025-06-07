import { supabase } from '@/lib/supabaseClient'
import { QueryData } from '@supabase/supabase-js'
import { Ref, ref, onMounted} from 'vue'
import type { Database } from '@/lib/database.types'


async function getGroupWithoutMembers(groupID: String) {
    try {
        const groupsWithoutMembersQuery = supabase
            .schema('nablaweb_vue')
            .from('nabla_groups')
            .select(`
                id,
                name,
                kind,
                logo,
                mailList: mail_list,
                leader,
                about,
                groupImage: group_image,
                dateBegan: date_began,
                isActive: is_active
                `)
            .eq('id', groupID)
            .single();
        type GroupsWithoutMembers = QueryData<typeof groupsWithoutMembersQuery>
        const { data, error } = await groupsWithoutMembersQuery;
        if (error) throw error;
        const groupsWithoutMembers: GroupsWithoutMembers = data
        return groupsWithoutMembers
    }
    catch (error) {
        console.error(`[useNablaGroup] error: failed to get groups without members:`, error)
    }
    return null
}

type GroupMemberData = {
            memberRole:     string;
            dateJoined:     string;
            isActive:       boolean;
            user:           {
                username:       string;
                firstName:      string;
                lastName:       string;
                profilePicture: string;
                class:          string;
            }
        }

async function getGroupMembers(groupID: String): Promise<GroupMemberData[]> {
    try {
        const groupMemberQuery = supabase
            .schema('nablaweb_vue')
            .from('nabla_group_members')
            .select(`    
                memberRole: member_role,
                dateJoined: date_joined,
                isActive: is_active,
                user: nabla_users (
                    username,
                    firstName: first_name,
                    lastName: last_name,
                    profilePicture: profile_picture,
                    class
                    )
                `)
            .eq('group', groupID)
            .eq('is_active', true)
            .order('order', { ascending: true });
        type GroupMembers = QueryData<typeof groupMemberQuery>
        const { data, error } = await groupMemberQuery;
        if (error) { throw error }
        const groupMembers: GroupMembers = data
        return groupMembers
    }
    catch (error) {
        console.error(`[useNablaGroup] error: failed to get members of group ${groupID}`, error)
    }
    return []
}

async function getActiveGroups() {
    try {
        const activeGroupsQuery = supabase
            .schema('nablaweb_vue')
            .from('nabla_groups')
            .select(`
                id,
                name,
                kind,
                logo,
                mailList: mail_list,
                leader,
                about,
                groupImage: group_image,
                dateBegan: date_began
                `)
            .eq('is_active', true)
        type ActiveGroups = QueryData<typeof activeGroupsQuery>
        const { data, error } = await activeGroupsQuery;
        if (error) { throw error }
        const activeGroups: ActiveGroups = data
        return activeGroups
    }
    catch (error) {
        console.error(`[useNablaGroup] error: failed to get active groups`, error)
    }
    return []
}

export async function isUserGroupLeader(username: String, groupID: String) {
    try {
        const { data, error } = await supabase
        .schema('nablaweb_vue')
        .from('nabla_groups')
        .select('leader')
        .eq('id', groupID)
        .single()
        if (error) { throw error }
        
        const userIsGroupLeader = data.leader == username
        return userIsGroupLeader
    }
    catch (e) {
        console.error(`[useNablaGroup] Error fetching group leader: ${e}`)
    }
    return false
}

interface nablaUser {
    username: string,
    firstName: string, 
    lastName: string,
    profilePicture: string,
    isActive: boolean,
    class: string
}
interface group{
    mailList: string | null,
    kind: string,
    name: string,
    id: string,
    logo: string,
    about: string,
    image: string,
    leader: string,
    members: nablaUser[]
};

export function useGroup(groupID: string) {
    const group: Ref<group | undefined> = ref()
    const loading: Ref = ref(true)
    const error: Ref = ref(false)

    async function refreshGroupMembers() {
        if (group == undefined) {
            return false
        }
        loading.value = true

        const memberResponse = await getGroupMembers(groupID)
        const members = memberResponse?.map((member) => {
                const user = member.user
                return {
                    role: member.memberRole,
                    dateJoined: member.dateJoined,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePicture: user.profilePicture,
                    class: user.class,
                    isActive: member.isActive
                }
            }
        )
        group.value!.members = members!
        loading.value = false
    }
    
    onMounted(async () => {
        const groupData  = await getGroupWithoutMembers(groupID)
        if  (groupData !== null) {
            group.value = {
                mailList: groupData.mailList? groupData.mailList : null,
                kind: groupData.kind,
                name: groupData.name,
                id: groupData.id,
                logo: groupData.logo,
                about: groupData.about,
                image: groupData.groupImage,
                leader: groupData.leader!,
                members: []
            }
        }
        refreshGroupMembers()
        loading.value = false
    })
    return {group, loading, error, refreshGroupMembers}
}

export function useGroups() {
    const groups: Ref = ref([])
    const loading: Ref<Boolean> = ref(true)
    const error: Ref<Boolean> = ref(false)

    async function refreshGroups() {
        loading.value  = true
        const groupsResponse = await getActiveGroups()
        if (groupsResponse) {
            groups.value = groupsResponse
        }
        loading.value = false
    }

    onMounted(async () => {
        refreshGroups()
        loading.value = false
    })
    return {groups, loading, error, refreshGroups}
}