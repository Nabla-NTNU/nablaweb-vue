import { supabase } from "@/lib/supabaseClient"
import { Ref, ref, onMounted } from "vue"
import { NablaGroup, GroupKind } from "@/lib/types/frontend.types"

function makeURL(str: string): URL | undefined {
    try {
        return new URL(str)
    } catch (error) {
        console.log(`[useNablaGroups] Invalid URL: ${str}`, error)
        return undefined
    }
}

async function getGroupWithoutMembers(
    groupID: string,
): Promise<NablaGroup | undefined> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_groups")
            .select(
                `
                id,
                name,
                kind,
                logo,
                mailList: mail_list,
                leader,
                about,
                groupPhoto: group_photo,
                dateBegan: date_began,
                isActive: is_active
                `,
            )
            .eq("id", groupID)
            .single()
        if (error) throw error
        const group: NablaGroup = {
            id: data.id,
            name: data.name,
            kind: data.kind in GroupKind ? (data.kind as GroupKind) : undefined, // Will fail silently for unknown GroupKinds
            logo: makeURL(data.logo),
            mailList: data.mailList,
            leader: { user: { username: data.leader! } },
            about: data.about,
            groupPhoto: makeURL(data.groupPhoto),
            date: new Date(data.dateBegan),
            isActive: data.isActive,
        }
        return group
    } catch (error) {
        console.error(
            `[useNablaGroup] error: failed to get groups without members:`,
            error,
        )
    }
}

async function getGroupMembers(groupID: string): Promise<GroupMember[]> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_group_members")
            .select(
                `    
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
                `,
            )
            .eq("group", groupID)
            .eq("is_active", true)
            .order("order", { ascending: true })
        if (error) {
            throw error
        }

        const groupMembers: GroupMember[] = data.map((member) => {
            return {
                role: member.memberRole,
                date: new Date(member.dateJoined),
                isActive: member.isActive,
                user: {
                    username: member.user.username,
                    firstName: member.user.firstName,
                    lastName: member.user.lastName,
                    profilePicture: makeURL(member.user.profilePicture),
                    class: member.user.class,
                },
            }
        })
        return groupMembers
    } catch (error) {
        console.error(
            `[useNablaGroup] error: failed to get members of group ${groupID}`,
            error,
        )
    }
    return []
}

async function getActiveGroups(): Promise<NablaGroup[]> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_groups")
            .select(
                `
                id,
                name,
                kind,
                logo,
                mailList: mail_list,
                leader,
                about,
                groupPhoto: group_photo,
                dateBegan: date_began
                `,
            )
            .eq("is_active", true)
        if (error) {
            throw error
        }
        const activeGroups: NablaGroup[] = data.map((group) => {
            return {
                id: group.id,
                name: group.name,
                kind: Object.values(GroupKind).includes(group.kind as GroupKind)
                    ? (group.kind as GroupKind)
                    : undefined,
                logo: makeURL(group.logo),
                mailList: group.mailList,
                leader: group.leader
                    ? { user: { username: group.leader } }
                    : undefined,
                about: group.about,
                groupPhoto: makeURL(group.groupPhoto),
                dateBegan: new Date(group.dateBegan),
            }
        })
        return activeGroups
    } catch (error) {
        console.error(
            `[useNablaGroup] error: failed to get active groups`,
            error,
        )
    }
    return []
}

export async function isUserGroupLeader(
    username: string,
    groupID: string,
): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_groups")
            .select("leader")
            .eq("id", groupID)
            .single()
        if (error) {
            throw error
        }
        return data.leader == username
    } catch (e) {
        console.error(`[useNablaGroup] Error fetching group leader: ${e}`)
    }
    return false
}

export async function doesGroupExist(groupID: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_groups")
            .select("id")
            .eq("id", groupID)
        if (error) {
            throw error
        }
        return data.length > 0
    } catch (e) {
        console.error(`[useNablaGroup] Error fetching group leader: ${e}`)
    }
    return false
}

export function useGroup(groupID: string) {
    const group: Ref<NablaGroup> = ref({ id: groupID })
    const loading: Ref<boolean> = ref(true)
    const error: Ref<boolean> = ref(false)

    async function refreshGroupMembers() {
        if (group.value == undefined) {
            return false
        }
        loading.value = true

        const groupMembers = await getGroupMembers(groupID)
        group.value.members = groupMembers
        loading.value = false
    }

    onMounted(async () => {
        const groupData = await getGroupWithoutMembers(groupID)
        if (groupData) {
            group.value = groupData
            refreshGroupMembers()
        }
        loading.value = false
    })
    return { group, loading, error, refreshGroupMembers }
}

export function useGroups() {
    const groups: Ref<NablaGroup[]> = ref([])
    const loading: Ref<boolean> = ref(true)
    const error: Ref<boolean> = ref(false)

    async function refreshGroups() {
        loading.value = true
        const groupsResponse = await getActiveGroups()
        if (groupsResponse) {
            groups.value = groupsResponse
        }
        loading.value = false
    }

    onMounted(async () => {
        refreshGroups()
    })

    return { groups, loading, error, refreshGroups }
}
