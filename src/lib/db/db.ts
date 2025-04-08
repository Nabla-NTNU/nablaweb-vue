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

export async function get_groups() {
    const { data, error } = await supabase
        .from("nabla_groups")
        .select(`
            group_mail,
            group_kind,
            group_name,
            group_url,
            logo
        `);

    if (error) {
        console.error("Error fetching users in group with roles:", error);
        return [];
    }

    return data;
}