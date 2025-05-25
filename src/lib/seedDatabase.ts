import { createClient } from '@supabase/supabase-js'
import type { Database } from "./database.types.ts";
import { base, nb_NO, sv, en, Faker } from '@faker-js/faker';


// Not pretty - workaround of using different runtimes for running the website and this seeder VITE_SUPABASE_ANON_KEY and VITE_SUPABASE_URL
const supabaseUrl = "http://127.0.0.1:54321"
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
export const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey)

type NablaUser = Database['nablaweb_vue']['Tables']['nabla_users']['Insert']
type NablaGroup = Database['nablaweb_vue']['Tables']['nabla_groups']['Insert']

const faker = new Faker({
    locale: [nb_NO, sv, en, base] // Faker doesn't support nynorsk atm :((
})

async function makeRandomUsers(nUsers: number) {
    const users:NablaUser[] = []
    for (let i = 0; i < nUsers; i++) {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const username = firstName.slice(0,2) + lastName

        const { data, error } = await supabase.auth.signUp({
            email: username + '@stud.ntnu.com',
            password: username,
        })
        if (error) {
            console.error("Error generating random user: " + error )
        }

        if (!error) {
            const nablaKomponent: NablaUser = {
                username: username,
                supabase_id: data.user!.id,
                ntnu_email: data.user!.email!,
                list_email: data.user!.email!,
                first_name: firstName,
                last_name: lastName,
                class: 'kull20'
            }
            users.push(nablaKomponent)
        }
    }
    return users
}

async function makeAdminUser() {
    const { data, error } = await supabase.auth.signUp({
        email: 'admin@stud.ntnu.com',
        password: 'nabla_admin',
    })
    if (error) {
        console.error("Error making admin user: " + error)
        return
    }

    return {
        username: 'admin',
        supabase_id: data.user!.id,
        ntnu_email: data.user!.email!,
        list_email: data.user!.email!,
        first_name: 'Admin',
        last_name: 'Adminsdatter',
        class: 'kull20'
    }
}

async function makeUserUser() {
    const { data, error } = await supabase.auth.signUp({
        email: 'user@stud.ntnu.com',
        password: 'nabla_user',
    })
    if (error) {
        console.error("Error making user user: " + error)
        return
    }

    return {
        username: 'user',
        supabase_id: data.user!.id,
        ntnu_email: data.user!.email!,
        list_email: data.user!.email!,
        first_name: 'User',
        last_name: 'Userssønn',
        class: 'kull20'
    }
}

const { data: { users }, error } = await supabase.auth.admin.listUsers()
if (error) {
    throw new Error('Error getting existing users: ' + error);
}

if (users.length > 0) {
    throw new Error("Cannot seed users - users already exist!");
}

if (users.length === 0) {
    const nablaUsers: NablaUser[] = await makeRandomUsers(2_000)
    const admin = await makeAdminUser()
    if (admin) {nablaUsers.push(admin)}

    console.log("Making users...")
    const user = await makeUserUser()
    if (user) {nablaUsers.push(user)}

    console.log("Populating nablauser table...")
    const { error } = await supabase
        .schema('nablaweb_vue')
        .from('nabla_users')
        .insert(nablaUsers)

    console.log("Making groups...")
    const nablaGroups: NablaGroup[] = [
        {
            id: 'webkom',
            name: 'WebKom',
            kind: 'Committee',
            logo: '',
            mail_list: 'webkom@nabla.no',
            about: faker.lorem.text(),
            group_image: '',
            leader: 'admin'
        },
        {
            id: 'kultkom',
            name: 'Kultkom',
            kind: 'Interest group',
            logo: '',
            about: faker.lorem.text(),
            group_image: '',
            leader: 'user'
        }
    ]
    const { errors } = await supabase
        .schema('nablaweb_vue')
        .from('nabla_groups')
        .insert(nablaGroups)

    console.log("Filling groups with members...")
}
    