import { supabase } from "@/lib/supabaseClient";
import { Ref, ref, onMounted} from "vue"
import type { Database } from "@/lib/database.types";

// Not the prettiest solution - way to follow Supabase / JS/TS conventions
type NablaUser = Database['nablaweb_vue']['Tables']['nabla_users']['Row']
interface nablaUser {
    username: string,
    firstName: string, 
    lastName: string,
    profilePicture: string,
    isActive: boolean,
    class: string
}

type NablaGroup = Database['nablaweb_vue']['Tables']['nabla_groups']['Row']
interface group{
    mailList: string | null,
    kind: string,
    name: string,
    id: string,
    logo: string,
    about: string,
    image: string,
    leader: string,
    members: {}[]
}

// format of what's returned to frontend
type NablaGroupMember = Database['nablaweb_vue']['Tables']['nabla_group_members']['Row']
interface databaseGroupMember{
    memberRole: string,
    dateJoined: Date,
    isActive: boolean,
    user: nablaUser
}
interface groupMember{
    memberRole: string,
    dateJoined: Date,
    username: string,
    firstName: string,
    lastName: string,
    profilePicture: string,
    isActive: boolean,
    class: string
}

async function getGroupWithoutMembers(groupID: String) {
    const {data, error} = await supabase
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
    return {data, error}
}



async function getGroupMembers(groupID: String) {
    const {data, error} = await supabase
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
    return {data, error}
}

async function getActiveGroups() {
    const {data, error} = await supabase
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
    return {data, error}
}

export function useGroup(groupID: string) {
    const group: Ref<group | undefined> = ref()
    const loading: Ref = ref(true)
    const error: Ref = ref(false)

    async function refreshGroupMembers() {
        if (group == undefined) {
            return false
        }
        loading.value = true

        const {data: memberData, error: memberError} = await getGroupMembers(groupID)
        if (memberError) {
            error.value = true
            console.log('Failed to fetch group members for group "' + groupID + '"')
            console.error(memberError)
        }
        const members = memberData?.map((member) => {
                const user: nablaUser = member.user
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
        group.value.members = members
        loading.value = false
    }
    
    onMounted(async () => {
        const {data: groupData, error: groupError}  = await getGroupWithoutMembers(groupID)
        if (groupError) {
            error.value = true
            console.log('Failed to fetch group "' + groupID + '"')
            console.error(groupError)
        }

        if  (groupData !== null) {
            group.value = {
                mailList: groupData.mailList? groupData.mailList : null,
                kind: groupData.kind,
                name: groupData.name,
                id: groupData.id,
                logo: groupData.logo,
                about: groupData.about,
                image: groupData.groupImage,
                leader: groupData.leader,
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
        const {data: groupsData, error: groupsError} = await getActiveGroups()
        if (groupsError) {
            error.value = true
            console.error('Failed to fetch groups')
            console.error(groupsError)
        }
        if (groupsData) {
            groups.value = groupsData
        }
        loading.value = false
    }

    onMounted(async () => {
        const {data: groupsData, error: groupsError} = await getActiveGroups()
        if (groupsError) {
            error.value = true
            console.error('Failed to fetch groups')
            console.error(groupsError)
        }
        if (groupsData) {
            groups.value = groupsData
        }
        loading.value = false
    })
    return {groups, loading, error, refreshGroups}
}