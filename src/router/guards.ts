import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import { doesGroupExist } from '@/composables/useNablaGroup'
import { isUserGroupLeader } from '@/composables/useNablaGroup'

const { username, isUserAdmin } = useAuth()

export async function groupPageGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext) {
        const groupID = to.params.id as string
        const groupExists = await doesGroupExist(groupID)
        if (groupExists) return next(true) 
        else return next({ path: `/for-komponenter/komiteer/` })
}

export async function groupAdminPageGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext) {
        // Allow access to group leaders
        const groupID = to.params.id as string
        if (username?.value && groupID) {
            const userIsGroupLeader = await isUserGroupLeader(username.value, groupID)
            if (userIsGroupLeader) {
                return next(true)
            }
        }
        
        // Allow access to admins
        const userIsAdmin = await isUserAdmin()
        if ( userIsAdmin ) {
            return next(true)
        }
        
        // Send to group page if guard fails
        return next({ path: `/for-komponenter/komiteer/${groupID}` })
}



