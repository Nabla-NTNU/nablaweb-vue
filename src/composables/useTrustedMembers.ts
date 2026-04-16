import { supabase } from "@/lib/supabaseClient"
import { TrustedCategory } from "@/lib/types/frontend.types"
import { Ref, ref, onMounted } from "vue"

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
                        display_name,
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
