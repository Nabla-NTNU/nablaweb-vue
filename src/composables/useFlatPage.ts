import { supabase } from "@/lib/supabaseClient"
import { Ref, ref, onMounted } from "vue"
import { FlatPage } from "@/lib/types/frontend.types"

async function getFlatPage(slug: string): Promise<FlatPage | undefined> {
    try {
        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("flat_pages")
            .select(
                `
                slug,
                content
                `,
            )
            .eq("slug", slug)
            .maybeSingle()

        if (error) throw error
        if (!data) return undefined
        const page: FlatPage = {
            slug: data.slug,
            content: data.content,
        }
        return page
    } catch (error) {
        console.error(`[getFlatPage] error: failed to get flatpage:`, error)
        return undefined
    }
}

export function useFlatPage(slug: string) {
    const page: Ref<FlatPage | undefined> = ref(undefined)
    const loading: Ref<boolean> = ref(true)
    const error: Ref<boolean> = ref(false)

    async function refreshPage() {
        loading.value = true
        const pageResponse = await getFlatPage(slug)
        if (pageResponse) {
            page.value = pageResponse
        }
        loading.value = false
    }

    onMounted(async () => {
        refreshPage()
    })
    return { page, loading, error }
}
