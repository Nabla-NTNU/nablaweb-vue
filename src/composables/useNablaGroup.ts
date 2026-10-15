import { supabase } from "@/lib/supabaseClient"
import { Ref, ref, onMounted } from "vue"
import {
    NablaSubGroup,
    GroupMember,
    GroupKind,
} from "@/lib/types/frontend.types"

function makeURL(str: string): URL | undefined {
    try {
        return new URL(str)
    } catch (error) {
        console.log(`[useNablaGroups] Invalid URL: ${str}`, error)
        return undefined
    }
}

async function getSubGroupWithoutMembers(
    groupID: string,
): Promise<NablaSubGroup | undefined> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_groups")
            .select(
                `
                id,
                name,
                mailList: mail_list,
                dateBegan: date_began,
                isActive: is_active,
                subgroup: nabla_subgroups(
                    kind,
                    logo,
                    leaderMail: leader_mail,
                    leader,
                    about,
                    groupPhoto: group_photo
                )
                `,
            )
            .eq("id", groupID)
            .single()
        if (error) throw error
        // subgroup is null for groups that aren't subgroups (e.g. classes)
        const sub = data.subgroup
        const group: NablaSubGroup = {
            id: data.id,
            name: data.name,
            kind: Object.values(GroupKind).includes(sub?.kind as GroupKind)
                ? (sub?.kind as GroupKind)
                : undefined, // Will fail silently for unknown GroupKinds
            logo: sub?.logo ? makeURL(sub.logo) : undefined,
            mailList: data.mailList,
            leaderMail: sub?.leaderMail,
            leader: sub?.leader ? { username: sub.leader } : undefined,
            about: sub?.about,
            groupPhoto: sub?.groupPhoto ? makeURL(sub.groupPhoto) : undefined,
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
                    profilePicture: profile_picture
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

async function getSubGroups(): Promise<NablaSubGroup[]> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_groups")
            .select(
                `
                id,
                name,
                mailList: mail_list,
                dateBegan: date_began,
                isActive: is_active,
                subgroup: nabla_subgroups!inner(
                    kind,
                    logo,
                    leaderMail: leader_mail,
                    about,
                    groupPhoto: group_photo,
                    leader: nabla_users!nabla_subgroups_leader_fkey(
                        username,
                        firstName: first_name,
                        lastName: last_name
                    ),
                    trustedMember: nabla_users!nabla_subgroups_trusted_member_fkey(
                        username,
                        ntnuEmail: ntnu_email,
                        firstName: first_name,
                        lastName: last_name
                    )
                )
                `,
            )

        if (error) {
            throw error
        }
        const activeGroups: NablaSubGroup[] = data.map((group) => {
            const sub = group.subgroup
            return {
                id: group.id,
                name: group.name,
                kind: Object.values(GroupKind).includes(sub.kind as GroupKind)
                    ? (sub.kind as GroupKind)
                    : undefined,
                logo: makeURL(sub.logo),
                mailList: group.mailList,
                leader: sub.leader ?? undefined,
                leaderMail: sub.leaderMail ?? undefined,
                trustedMember: sub.trustedMember ?? undefined,
                about: sub.about,
                groupPhoto: makeURL(sub.groupPhoto),
                date: new Date(group.dateBegan),
                isActive: group.isActive,
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
            .from("nabla_subgroups")
            .select("leader")
            .eq("id", groupID)
            .maybeSingle()
        if (error) {
            throw error
        }
        return data?.leader == username
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
    const group: Ref<NablaSubGroup> = ref({ id: groupID })
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
        const groupData = await getSubGroupWithoutMembers(groupID)
        if (groupData) {
            group.value = groupData
            refreshGroupMembers()
        }
        loading.value = false
    })
    return { group, loading, error, refreshGroupMembers }
}

export function useGroups() {
    const groups: Ref<NablaSubGroup[]> = ref([])
    const loading: Ref<boolean> = ref(true)
    const error: Ref<boolean> = ref(false)

    async function refreshGroups() {
        loading.value = true
        const groupsResponse = await getSubGroups()
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
