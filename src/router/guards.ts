import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router"

import { useAuth } from "@/composables/useAuth"
const { username, isUserAdmin } = useAuth()

import { doesGroupExist } from "@/composables/useNablaGroup"
import { isUserGroupLeader } from "@/composables/useNablaGroup"

// Makes sure group page exists before sending folks away.
// In the future it'd be nice to show in frontend.
export async function groupPageGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    const groupID = to.params.id as string
    const groupExists = await doesGroupExist(groupID)
    if (groupExists) {
        return next(true)
    } else {
        console.error(`[guards] groupID '${groupID}' does not exist`)
        return next({ path: `/for-komponenter/komiteer/` })
    }
}

export async function groupAdminPageGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) {
    // Allow access to admins (also refreshes username)
    const userIsAdmin = await isUserAdmin()
    if (userIsAdmin) {
        return next(true)
    }

    // Allow access to group leaders
    const groupID = to.params.id as string

    if (username?.value && groupID) {
        const userIsGroupLeader = await isUserGroupLeader(
            username.value,
            groupID,
        )
        if (userIsGroupLeader) {
            return next(true)
        }
    }

    // Send to group page if guard fails
    console.error(
        `[guards] User '${username?.value}' not found to have access to group '${groupID}'`,
    )
    return next({ path: `/for-komponenter/komiteer/${groupID}` })
}
