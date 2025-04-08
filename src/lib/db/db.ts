import { createClient } from '@supabase/supabase-js'
import { getAnonKey } from './SECRETS.js'

const supabase = createClient('https://db.testing.nabla.no', getAnonKey(), {
    db : { schema: 'nablaweb_vue'}
})

export async function get_group_members(nablaGroupEmail: string) {
    const { data, error } = await supabase
        .from("nabla_group_members")
        .select(`
            nabla_users(school_email, first_name, last_name, profile_picture),
            member_role
        `)
        .eq("group", nablaGroupEmail);

    if (error) {
        console.error("Error fetching users in group with roles:", error);
        return [];
    }

    return data.map(entry => ({
        ...entry.nabla_users, 
        member_role: entry.member_role
    }));
}


// TODO: 
//  - Design user Model: what does a full NablaUser model look like?
//  - What should database return? Do you get all public data at once?
//  - Do you request one user at a time or many?