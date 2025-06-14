import { createClient, UserResponse } from "@supabase/supabase-js"
import type { Database } from "../src/lib/types/database.types.js"
import { base, nb_NO, sv, en, Faker } from "@faker-js/faker"
import pLimit from "p-limit"

type NablaUser = Database["nablaweb_vue"]["Tables"]["nabla_users"]["Insert"]
type NablaGroup = Database["nablaweb_vue"]["Tables"]["nabla_groups"]["Insert"]
type NablaGroupMember =
    Database["nablaweb_vue"]["Tables"]["nabla_group_members"]["Insert"]
type ClassEnum = Database["nablaweb_vue"]["Enums"]["class"]
type NablaUserDict = { [username: string]: NablaUser }
type NablaGroupDict = { [id: string]: NablaGroup }

// Need service key - this is standard for local instances
const supabase = createClient<Database>(
    "http://127.0.0.1:54321",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU",
)

const faker = new Faker({
    locale: [nb_NO, sv, en, base], // Faker doesn't support nynorsk atm :((
})

function makeUser(
    firstName: string,
    lastName: string,
    username: string,
): NablaUser {
    const email = username + "@stud.ntnu.no"

    const user: NablaUser = {
        username: username,
        supabase_id: crypto.randomUUID(),
        ntnu_email: email,
        list_email: email,
        first_name: firstName,
        last_name: lastName,
        profile_picture:
            "https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg",
        class: "kull20" as ClassEnum,
    }
    return user
}

function makeRandomUsers(n: number): NablaUserDict {
    const users: NablaUserDict = {}

    const profiles = Array.from({ length: n }).map(() => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    }))

    for (const { firstName, lastName } of profiles) {
        const username = faker.internet
            .username({ firstName, lastName })
            .toLowerCase()
        users[username] = makeUser(firstName, lastName, username)
    }

    return users // no de-duping, but I don't care, shouldn't be an issue
}

async function addUsersToSupabase(users: NablaUserDict) {
    const throttle = pLimit(100) // Sending a lot of requests here drowns postgres a bit

    const tasks = Object.values(users).map((user) =>
        throttle(() =>
            supabase.auth.admin.createUser({
                email: user.ntnu_email,
                password: user.username,
                email_confirm: true,
            }),
        ),
    )
    const responses: UserResponse[] = await Promise.all(tasks)
    console.log(
        `Created ${responses.filter((response) => response.error == null).length} users in supabase`,
    )
    for (const response of responses) {
        if (response.data.user) {
            const email = response.data.user.email!
            const username = email.substring(0, email.length - 13)
            users[username].supabase_id = response.data.user?.id
        }
    }
    return users
}

async function addUsersToDB(users: NablaUserDict) {
    const { data, error } = await supabase
        .schema("nablaweb_vue")
        .from("nabla_users")
        .upsert(Object.values(users))
        .select("username")
    console.log(`Inserted ${data?.length} users into nabla_users`)
    if (error) console.log("Error inserting users to nabla_users")
    if (error) console.log(error)
}

function getRandomElement(array: string[]) {
    const index = Math.floor(Math.random() * array.length)
    return array[index]
}

console.log("Making users...")
const nUsers = 500
const usersLocal = makeRandomUsers(nUsers - 2)

const admin = makeUser("Admin", "Adminsdotter", "admin")
const user = makeUser("User", "Userssønn", "user")
usersLocal[admin.username] = admin
usersLocal[user.username] = user

const users = await addUsersToSupabase(usersLocal)
await addUsersToDB(users)

console.log("Making admin an admin...")
await supabase.schema("nablaweb_vue").from("nabladmins").insert({
    user: "admin",
    reason: "Administration",
})

console.log("Making groups...")
const groups: NablaGroupDict = {
    webkom: {
        id: "webkom",
        name: "WebKom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/news_pictures/webkom-logo_cd43LtI.png.250x250_q85_crop-smart.png",
        mail_list: "webkom@nabla.no",
        about: faker.lorem.text(),
        group_photo:
            "https://nabla.no/media/uploads/content/nabla_under_gruppe_foto-004.jpg",
        leader: "admin",
    },
    kultkom: {
        id: "kultkom",
        name: "Kultkom",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Kultkom.png.250x250_q85_crop-smart.png",
        about: faker.lorem.text(),
        group_photo:
            "https://nabla.no/media/uploads/content/nabla_under_gruppe_kultkom.jpg",
        leader: "user",
    },
    prokom: {
        id: "prokom",
        name: "ProKom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Prokom-ikon-monokrom.jpg.250x250_q85_crop-smart.jpg",
        about: faker.lorem.text(),
        group_photo:
            "https://nabla.no/media/uploads/com_pictures/HU5A9317.jpeg",
        leader: "user",
    },
    redaksjonen: {
        id: "redaksjonen",
        name: "Redaksjonen",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/redaksjonen_logo.jpg.250x250_q85_crop-smart.jpg",
        about: faker.lorem.text(),
        group_photo:
            "https://nabla.no/media/uploads/content/Nabladet_logo_bla.JPG",
        leader: "user",
    },
    styret: {
        name: "Styret",
        id: "styret",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/styret.jpeg.250x250_q85_crop-smart.jpg",
        about: faker.lorem.text(),
        group_photo: "https://nabla.no/media/uploads/com_pictures/HU5A1682.jpg",
        leader: "user",
    },
}

const { error: error1 } = await supabase
    .schema("nablaweb_vue")
    .from("nabla_groups")
    .upsert(Object.values(groups))
if (error1) {
    console.log(error1)
}

console.log("Populating groups with members...")
const memberships: NablaGroupMember[] = []
const usedPairs = new Set<string>()
while (memberships.length < Object.keys(groups).length * 15) {
    const user = getRandomElement(Object.keys(users))
    const group = getRandomElement(Object.keys(groups))
    if (usedPairs.has(`${user}:${group}`)) {
        continue
    }
    usedPairs.add(`${user}:${group}`)

    const membership: NablaGroupMember = {
        user: user,
        group: group,
        member_role: faker.company.catchPhrase(),
        is_active: true,
        order: memberships.length,
    }
    memberships.push(membership)
}

const { error } = await supabase
    .schema("nablaweb_vue")
    .from("nabla_group_members")
    .upsert(memberships)

if (error) console.log(error)
