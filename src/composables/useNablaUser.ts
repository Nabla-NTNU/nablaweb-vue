import { supabase } from '@/lib/supabaseClient'
import { QueryData } from '@supabase/supabase-js'
import { Ref, ref, onMounted} from 'vue'
import { nablaUser, nablaGroup, groupMember } from '@/lib/types/frontend.types'
import { useGroups } from './useNablaGroup' 

let { groups } = useGroups()


async function getUserData (username: string) {
    try {
        const userQuery = supabase.schema("nablaweb_vue").from("nabla_users")
            .select(`
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
            `).eq("username", username)
            .single()
        
        type userData = QueryData<typeof userQuery>
        const { data, error } = await userQuery;
        if (error) throw error
        const queryResult: userData = data
        return queryResult
    }
    catch (error) {
        console.error(`[useNablaGroup] error: failed to get user data:`, error)
    }
    return null
}



export function useUser (username: string){
    const user:    Ref<nablaUser | undefined> = ref()
    const loading: Ref<boolean> = ref(true)
    const error:   Ref<boolean> = ref(false)

    onMounted(async() => {
        const userData = await getUserData(username)
        if (userData != null) {
           user.value = {
                username: userData.username,
                firstName: userData.first_name,
                lastName: userData.last_name,
                profilePicture: userData.profile_picture,
                isActive: userData.is_active,
                class: userData.class,
                memberOf: [],
                ntnuEmail: userData.ntnu_email,
                listEmail: userData.list_email,
                publicEmail: userData.public_email,
                about: userData.about,
                birthday: userData.birthday,
                website: userData.website
            }
        }
        updateGroupMembership()
        loading.value = false
    })


    async function updateGroupMembership () {
        if (user.value) {
            let memberships: nablaGroup[] = []

            loading.value = true

            memberships = groups.value.filter((group: nablaGroup) => {
                if (group && group.members){
                    const memberNames = group.members.map((member) => member.user.username)
                    return memberNames.includes(username)
                }
            })

        loading.value = false
        } else {
            console.error("User is undefined")
            return false
        }

    }

    return {user, loading, error, updateGroupMembership}
}
