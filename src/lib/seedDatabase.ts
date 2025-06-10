import { createClient } from '@supabase/supabase-js'
import type { Database } from "./types/database.types.js";
import { base, nb_NO, sv, en, Faker } from '@faker-js/faker';


// Not pretty - workaround of using different runtimes for running the website and this seeder VITE_SUPABASE_ANON_KEY and VITE_SUPABASE_URL
const supabaseUrl = "http://127.0.0.1:54321"
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
export const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey)

type NablaUser = Database['nablaweb_vue']['Tables']['nabla_users']['Insert']
type NablaGroup = Database['nablaweb_vue']['Tables']['nabla_groups']['Insert']
type ClassEnum = Database['nablaweb_vue']['Enums']['class']

const faker = new Faker({
    locale: [nb_NO, sv, en, base] // Faker doesn't support nynorsk atm :((
})

async function makeRandomUsers(nUsers: number) {
    const users = []
    for (let i = 0; i < nUsers; i++) {
        faker.seed(i);
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const username = faker.internet.username({firstName, lastName})
        const email = username + '@stud.ntnu.no'

        const { data, error } = await supabase.auth.admin.createUser({
            email: username + '@stud.ntnu.no',
            password: 'user',
            email_confirm: true
        })
        if (error) {
            console.log("Error making random user: " + error)
        }
        if (data.user) {
            const nablaKomponent: NablaUser = {
                username: username,
                supabase_id: data.user!.id,
                ntnu_email: email,
                list_email: email,
                first_name: firstName,
                last_name: lastName,
                profile_picture: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg',
                class: 'kull20' as ClassEnum
            }
            users.push(nablaKomponent)
        }
    }
    return users
}

async function makeAdminUser() {
    const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin@stud.ntnu.no',
        password: 'admin',
        email_confirm: true
    })
    if (error) {
        console.log("Error making admin user: " + error)
        return
    }

    return {
        username: 'admin',
        supabase_id: data.user!.id,
        ntnu_email: data.user!.email!,
        list_email: data.user!.email!,
        first_name: 'Admin',
        last_name: 'Adminsdatter',
        profile_picture: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg',
        class: 'kull20' as ClassEnum
    }
}

async function makeUserUser() {
    const { data, error } = await supabase.auth.admin.createUser({
        email: 'user@stud.ntnu.no',
        password: 'user',
        email_confirm: true
    })
    if (error) {
        console.log("Error making user user: " + error)
        return
    }

    return {
        username: 'user',
        supabase_id: data.user!.id,
        ntnu_email: data.user!.email!,
        list_email: data.user!.email!,
        first_name: 'User',
        last_name: 'Userssønn',
        profile_picture: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg',
        class: 'kull20' as ClassEnum
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
    const nablaUsers = []
    console.log("Making random users...")
    const random = await makeRandomUsers(500)
    if (random) {nablaUsers.push(...random)}

    console.log("Making admin user...")
    const admin = await makeAdminUser()
    if (admin) {nablaUsers.push(admin)}

    console.log("Making user user...")
    const user = await makeUserUser()
    if (user) {nablaUsers!.push(user)}

    console.log("Populating nablauser table...")
    const { error: error0 } = await supabase
        .schema('nablaweb_vue')
        .from('nabla_users')
        .insert(nablaUsers)

    console.log("Making admin admin an admin...")
    const { error: error1 } = await supabase
        .schema('nablaweb_vue')
        .from('nabladmins')
        .insert({
            user: "admin",
            reason: "Administration"
        })

    console.log("Making groups...")
    const nablaGroups: NablaGroup[] = [
        {
            id: 'webkom',
            name: 'WebKom',
            kind: 'Committee',
            logo: 'https://nabla.no/media/thumbnails/uploads/news_pictures/webkom-logo_cd43LtI.png.250x250_q85_crop-smart.png',
            mail_list: 'webkom@nabla.no',
            about: faker.lorem.text(),
            group_photo: 'https://nabla.no/media/uploads/content/nabla_under_gruppe_foto-004.jpg',
            leader: 'admin'
        },
        {
            id: 'kultkom',
            name: 'Kultkom',
            kind: 'Interest group',
            logo: 'https://nabla.no/media/thumbnails/uploads/com_pictures/Kultkom.png.250x250_q85_crop-smart.png',
            about: faker.lorem.text(),
            group_photo: 'https://nabla.no/media/uploads/content/nabla_under_gruppe_kultkom.jpg',
            leader: 'user'
        },
        {
            id: 'prokom',
            name: 'ProKom',
            kind: 'Committee',
            logo: 'https://nabla.no/media/thumbnails/uploads/com_pictures/Prokom-ikon-monokrom.jpg.250x250_q85_crop-smart.jpg',
            about: faker.lorem.text(),
            group_photo: 'https://nabla.no/media/uploads/com_pictures/HU5A9317.jpeg',
            leader: 'user'
        },
        {
            id: 'redaksjonen',
            name: 'Redaksjonen',
            kind: 'Committee',
            logo: 'https://nabla.no/media/thumbnails/uploads/com_pictures/redaksjonen_logo.jpg.250x250_q85_crop-smart.jpg',
            about: faker.lorem.text(),
            group_photo: 'https://nabla.no/media/uploads/content/Nabladet_logo_bla.JPG',
            leader: 'user'
        },
        {
            name: 'Styret',
            id: 'styret',
            kind: 'Committee',
            logo: 'https://nabla.no/media/thumbnails/uploads/com_pictures/styret.jpeg.250x250_q85_crop-smart.jpg',
            about: faker.lorem.text(),
            group_photo: 'https://nabla.no/media/uploads/com_pictures/HU5A1682.jpg',
            leader: 'user'
        }
    ]
    const { error: error2 } = await supabase
        .schema('nablaweb_vue')
        .from('nabla_groups')
        .insert(nablaGroups)

    console.log("Filling groups with members...")
    // const { error: error3 } = await supabase.storage.createBucket('images', {
    //     public: true,
    //     allowedMimeTypes: ['image/*'],
    //     // fileSizeLimit: '10MB',
    // })
}
