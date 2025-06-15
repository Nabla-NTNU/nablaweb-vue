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
                first_name,
                last_name,
                profile_picture,
                is_active,
                class,
                list_email,
                public_email,
                ntnu_email,
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
                user,
                group: nabla_groups(
                    id,
                    name,
                    kind,
                    logo,
                    mail_list,
                    leader_mail,
                    leader,
                    about,
                    group_photo,
                    date_began,
                    is_active
                ),
                is_active
            `,
            )
            .eq("user", username)
            .eq("is_active", true)
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
                firstName: userData.first_name,
                lastName: userData.last_name,
                profilePicture: userData.profile_picture
                    ? new URL(userData.profile_picture)
                    : undefined,
                isActive: userData.is_active,
                class: userData.class,
                memberOf: [],
                ntnuEmail: userData.ntnu_email,
                listEmail: userData.list_email,
                publicEmail: userData.public_email,
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
                    mailList: data.mail_list,
                    leader: { user: { username: data.leader! } },
                    about: data.about,
                    groupPhoto: new URL(data.group_photo),
                    date: new Date(data.date_began),
                    isActive: data.is_active,
                }
                return group
            })

            user.value.memberOf = groups
        } else {
            console.error("[NablaUser] User or membership data is not defined")
        }
        isLoading.value = false
    }

    return { user, isLoading, error, updateGroupMembership }
}
