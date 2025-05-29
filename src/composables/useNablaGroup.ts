import { supabase } from "@/lib/supabaseClient";
import { Ref, ref, onMounted} from "vue"
import type { Database } from "@/lib/database.types";

type NablaUser = Database['nablaweb_vue']['Tables']['nabla_users']['Row']
type NablaGroup = Database['nablaweb_vue']['Tables']['nabla_groups']['Row']

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
    const group: Ref = ref()
    const loading: Ref = ref(true)
    const error: Ref = ref(false)
    
    onMounted(async () => {
        const {data: groupData, error: groupError}  = await getGroupWithoutMembers(groupID)
        const {data: memberData, error: memberError} = await getGroupMembers(groupID)
        if (groupError) {
            error.value = true
            console.log('Failed to fetch group "' + groupID + '"')
            console.error(groupError)
        }

        if (memberError) {
            error.value = true
            console.log('Failed to fetch group members for group "' + groupID + '"')
            console.error(memberError)
        }

        if  (groupData !== null) {
            const members = memberData?.map((member) => {
                const user = member.user
                return {
                    memberRole: member.memberRole,
                    dateJoined: member.dateJoined,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePicture: user.profilePicture,
                    class: user.class
                }
            })

            group.value = {
                mailList: groupData.mailList? groupData.mailList : null,
                kind: groupData.kind,
                name: groupData.name,
                id: groupData.id,
                logo: groupData.logo,
                about: groupData.about,
                image: groupData.groupImage,
                members: members
            }
        }
        loading.value = false
    })
    return {group, loading, error}
}

export function useGroups() {
    const groups: Ref = ref([])
    const loading: Ref<Boolean> = ref(true)
    const error: Ref<Boolean> = ref(false)

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

    return {groups, loading, error}
}