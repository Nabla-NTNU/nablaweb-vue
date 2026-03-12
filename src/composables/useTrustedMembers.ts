import { supabase } from "@/lib/supabaseClient"
import { Ref, ref, onMounted } from "vue"

interface TrustedAssignment {
    user: {
        username: string
        firstName: string
        lastName: string
        ntnuEmail: string
    }
    order: number
}

interface TrustedArea {
    id: string
    name: string
    areaMail: string | null
    order: number
    assignments: TrustedAssignment[]
}

interface TrustedCategory {
    id: string
    displayName: string
    order: number
    areas: TrustedArea[]
}

export function useTrustedMembers() {
    const categories: Ref<TrustedCategory[]> = ref([])
    const error: Ref<boolean> = ref(false)

    async function fetchAllTrustedMembers() {
        try {
            const { data, error: supabaseError } = await supabase
                .schema("nablaweb_vue")
                .from("trusted_member_categories")
                .select(
                    `
                    id,
                    displayName: display_name,
                    order,
                    areas: trusted_member_areas (
                        id,
                        name,
                        areaMail: area_mail,
                        order,
                        assignments: trusted_member_assignments (
                            order,
                            user: nabla_users (
                                username: username,
                                firstName: first_name,
                                lastName: last_name,
                                ntnuEmail: ntnu_email
                            )
                        )
                    )
                `,
                )
                .order("order", { ascending: true })
            console.log("Raw Data: ", data)
            console.log("Error: ", error)

            if (supabaseError) throw supabaseError

            categories.value = (data as TrustedCategory[]).map((cat) => ({
                ...cat,
                areas: cat.areas
                    .sort((a, b) => a.order - b.order)
                    .map((area) => ({
                        ...area,
                        assignments: area.assignments.sort(
                            (a, b) => a.order - b.order,
                        ),
                    })),
            }))
        } catch (e) {
            console.error("[useTrustedMembers] Error fetching:", e)
            error.value = true
        }
    }

    onMounted(() => {
        fetchAllTrustedMembers()
    })

    return { categories, error, refresh: fetchAllTrustedMembers }
}
