import { supabase } from "@/lib/supabaseClient"
import { QueryData } from "@supabase/supabase-js"
import { Ref, ref, onMounted } from "vue"
import { NablaUser, NablaGroup, GroupKind } from "@/lib/types/frontend.types"

async function getUserData(username: string) {
    try {
        const userQuery = supabase
            .schema("nablaweb_vue")
            .from("nabla_users")
            .select(
                `
                username,
                firstName: first_name,
                lastName: last_name,
                profilePicture: profile_picture,
                isActive: is_active,
                class,
                listEmail: list_email,
                publicEmail: public_email,
                ntnuEmail: ntnu_email,
                about,
                website,
                birthday
            `,
            )
            .eq("username", username)
            .single()

        type userData = QueryData<typeof userQuery>
        const { data, error } = await userQuery
        if (error) throw error
        const queryResult: userData = data
        return queryResult
    } catch (error) {
        console.error(`[useNablaUser] error: failed to get user data:`, error)
    }
    return null
}

async function getMembershipData(username: string) {
    try {
        const membershipQuery = supabase
            .schema("nablaweb_vue")
            .from("nabla_group_members")
            .select(
                `
                isActive: is_active,
                group: nabla_groups(
                    id,
                    name,
                    kind,
                    logo,
                    mailList: mail_list,
                    leaderMail: leader_mail,
                    leader,
                    about,
                    groupPhoto: group_photo,
                    dateBegan: date_began,
                    isActive: is_active
                )
            `,
            )
            .eq("user", username)
        type userData = QueryData<typeof membershipQuery>
        const { data, error } = await membershipQuery
        if (error) throw error
        const queryResult: userData = data
        return queryResult
    } catch (error) {
        console.error(
            `[useNablaUser] error: failed to get group membership data:`,
            error,
        )
    }
}

export function useUser(username: string) {
    const user: Ref<NablaUser | undefined> = ref()
    const isLoading: Ref<boolean> = ref(true)
    const error: Ref<boolean> = ref(false)

    onMounted(async () => {
        const userData = await getUserData(username)
        if (userData != null) {
            user.value = {
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                profilePicture: userData.profilePicture
                    ? new URL(userData.profilePicture)
                    : undefined,
                isActive: userData.isActive,
                class: userData.class,
                memberOf: [],
                ntnuEmail: userData.ntnuEmail,
                listEmail: userData.listEmail,
                publicEmail: userData.publicEmail,
                about: userData.about,
                birthday: userData.birthday
                    ? new Date(userData.birthday)
                    : null,
                website: userData.website
                    ? new URL(userData.website)
                    : undefined,
            }
        }
        await updateGroupMembership()
        isLoading.value = false
    })

    async function updateGroupMembership() {
        isLoading.value = true
        const memberData = await getMembershipData(username)

        if (user.value && memberData) {
            if (memberData.length == 0) {
                user.value.memberOf = []
            }
            const groups: NablaGroup[] = memberData?.map((membership) => {
                const data = membership.group
                const group: NablaGroup = {
                    id: data.id,
                    name: data.name,
                    kind:
                        data.kind in GroupKind
                            ? (data.kind as GroupKind)
                            : undefined, // Will fail silently for unknown GroupKinds
                    logo: new URL(data.logo),
                    mailList: data.mailList,
                    leader: { user: { username: data.leader! } },
                    about: data.about,
                    groupPhoto: new URL(data.groupPhoto),
                    date: new Date(data.dateBegan),
                    isActive: data.isActive,
                }
                return group
            })

            const activeGroupIds = memberData
                .filter((m) => m.isActive)
                .map((m) => m.group.id)

            const activeGroups = groups.filter((group) =>
                activeGroupIds.includes(group.id),
            )

            const inactiveGroups = groups.filter((group) => {
                return activeGroups.indexOf(group) == -1
            })

            user.value.memberOf = activeGroups
            user.value.pastMemberOf = inactiveGroups
        } else {
            console.error("[NablaUser] User or membership data is not defined")
        }

        isLoading.value = false
    }

    return { user, isLoading, error }
}
