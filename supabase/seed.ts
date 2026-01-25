import { base, en, Faker, nb_NO, sv } from "@faker-js/faker"
import { createClient, UserResponse } from "@supabase/supabase-js"
import pLimit from "p-limit"
import type { Database } from "../src/lib/types/database.types.js"

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

console.log("Making groups...") // A lot of the images break badly. THhink it's the googleusercontent links
const groups: NablaGroupDict = {
    arrkom: {
        name: "ArrKom",
        id: "arrkom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/IMG_0306_HcJuzGf.jpg.250x250_q85_crop-smart.jpg",
        mail_list: "arrkom@nabla.no",
        leader_mail: "arrsjef@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcOBN0lTkj6KlhMZh2-auUo_fZWROoupD8MP7s4HX3mWZGmgdHArYsrQONBCKkJbU4P5oerMFRvxEYI61ShI4o_WORi3aSixAvaP0OXtMz3e02oysiTqa3LMy6CFUKZCfDP-5l5Jev7YjAANeYHJJoT2q0?key=aeJqyczQFfxPqAbucOqYxBAM",
    },
    bedkom: {
        name: "Bedriftskontakten Nabla",
        id: "bedkom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Ny_BN-logo-2_FLQ8NVr.jpg.250x250_q85_crop-smart.png",
        mail_list: "bedkom@nabla.no",
        leader_mail: "bedriftskontakt@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/bn201.jpg",
    },
    educom: {
        name: "Educom",
        id: "educom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/edukom.jpg.250x250_q85_crop-smart.jpg",
        leader_mail: "ambassador@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://lh7-rt.googleusercontent.com/docsz/AD_4nXciCrS_lM0nIUT-sRSQ4KySZwkB-xITYUpyWQpJiYynXjm21fPHLsWd8ouLX0wLUz2ttyIw_ea_mOkuuR4gft7obb-eagUUh1oaSm1mfDFez0f1zoO4k0gzvM2Ys229n3a6MYXPFC90oa8Yt2_zqkYz3_c?key=aeJqyczQFfxPqAbucOqYxBAM",
    },
    fadderkom: {
        name: "FadderKom",
        id: "fadderkom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Skjermbilde_2024-11-06_kl._08.17.07.png.250x250_q85_crop-smart.png",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://lh7-rt.googleusercontent.com/docsz/AD_4nXftykOYRdyz1BUXGUbB_c4LL06VAT82mABdN_VrmkaGK40cbcP37F-zTcV2q3Bo8F7iEls0e2ksUr4EuwvImQ9yYDwG_ywe0-eP38v49-dEVDyy2fvbA5FJCAOEg-pBYYEwbIBBfd0Mj3lZwmy_DK9TPuDn?key=KyKQVimNYgblVFL0RAGYWJpc",
    },
    kjellerstyret: {
        name: "Kjellerstyret",
        id: "kjellerstyret",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/kjellerstyret_dDWDFE9.png.250x250_q85_crop-smart.png.250x250_q85_crop-smart.png",
        mail_list: "kjellern.hk18@nabla.no",
        leader_mail: "kjellersjef@nabla.no",
        about: faker.lorem.paragraphs(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://lh7-rt.googleusercontent.com/docsz/AD_4nXe4MH5vyqY0EpjCWbVARuCBwrkYYF1a02soMPSAciZSaPXFYVoTXvLqZWh4TCRjgHICAunUc8HGpK74wbd_s7OApNZX9X038BUNhr7ugESwWNHt46KtHSzKaVb9dW1eNUd_N61yhbdUgyh9OW3J-lf5wwE?key=Ub7xtpmS0D3jF3uiC4Wgdvhi",
    },
    kontorkom: {
        name: "KontorKom",
        id: "kontorkom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Kontorkom_Logo.jpg.250x250_q85_crop-smart.jpg",
        mail_list: "kontorkom@nabla.no",
        leader_mail: "leder.kontorkom@nabla.no",
        about: faker.lorem.paragraph(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://lh7-rt.googleusercontent.com/docsz/AD_4nXc2sD9zUyyPowNu3gcaf4tYj6pSFYfUujQ0wQ4-40KVb1Pa-0CP0zeUUwBbBWM4Y517-KnlIweRcllEQxIu3DHFBuGyk7Ts4w9L6unUygm1NvPeCSiI1GEvSGP3s6m32bnRmp2Uwg?key=R7qQlOHoIBRTjk8sIFz5f_Zu",
    },
    prokom: {
        id: "prokom",
        name: "ProKom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Prokom-ikon-monokrom.jpg.250x250_q85_crop-smart.jpg",
        mail_list: "prokom@nabla.no",
        leader_mail: "leder.prokom@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://nabla.no/media/uploads/com_pictures/HU5A9317.jpeg",
    },
    redaksjonen: {
        id: "redaksjonen",
        name: "Redaksjonen",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/redaksjonen_logo.jpg.250x250_q85_crop-smart.jpg",
        mail_list: "nabladet@nabla.no",
        leader_mail: "redaktor@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://nabla.no/media/uploads/content/Nabladet_logo_bla.JPG",
    },
    sportskom: {
        name: "SportsKom",
        id: "sportskom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/sportskom.png.250x250_q85_crop-smart.png",
        leader_mail: "sportskom@nabla.no",
        about: faker.person.bio(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://nabla.no/media/uploads/content/nabla_under_gruppe_foto-163.jpg",
    },
    styret: {
        name: "Styret",
        id: "styret",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/styret.jpeg.250x250_q85_crop-smart.jpg",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/com_pictures/HU5A1682.jpg",
    },
    webkom: {
        id: "webkom",
        name: "WebKom",
        kind: "Committee",
        logo: "https://nabla.no/media/thumbnails/uploads/news_pictures/webkom-logo_cd43LtI.png.250x250_q85_crop-smart.png",
        mail_list: "webkom@nabla.no",
        leader_mail: "websjef@nabla.no",
        about: faker.lorem.text(),
        group_photo:
            "https://nabla.no/media/uploads/content/nabla_under_gruppe_foto-004.jpg",
        leader: "admin",
        trusted_member: getRandomElement(Object.keys(users)),
    },
    casinus: {
        name: "Casinus",
        id: "casinus",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Casinus_2.png.250x250_q85_crop-smart.png",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd04_Y2dquwJ2nhmcTVY8vStUNCQmIZUqA8RBPs-nJDG_KoJ3C_-EA_vt-4dw-QEHmW4GbIgS3476nSApEu0DbGbb3goKWOX9VqssqL2U6hDP5SlgHJpWWU049jYSJVv8FTZOq-DQ?key=WJSp9qahF5-MtEm6b_9b_Qkh",
    },
    koreolis: {
        name: "Koreolis",
        id: "koreolis",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/koreolis_logo.jpg.250x250_q85_crop-smart.jpg",
        mail_list: "koreolis@nabla.no",
        leader_mail: "koreolis.kraften@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://nabla.no/media/uploads/content/koreolis-2025.jpeg",
    },
    kultkom: {
        id: "kultkom",
        name: "Kultkom",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Kultkom.png.250x250_q85_crop-smart.png",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://nabla.no/media/uploads/content/nabla_under_gruppe_kultkom.jpg",
    },
    lopeklubben: {
        id: "lopeklubben",
        name: "Løpeklubben",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/lopelogo.png.250x250_q85_crop-smart.png",
        about: faker.lorem.paragraphs(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/Utfluks.JPG", // THIS IS A PROBLEM - GROUP PHOTO CAN BE NULL
    },
    makernabla: {
        id: "makernabla",
        name: "MakerNabla",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/maker_nabla_vrtWpwO.jpg.250x250_q85_crop-smart.jpg",
        about: faker.lorem.paragraphs(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/Utfluks.JPG", // THIS IS A PROBLEM - GROUP PHOTO CAN BE NULL
    },
    m3: {
        id: "m3",
        name: "Maxwells Muntre Musikanter",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Maxwells_logo_1ob4IqE.png.250x250_q85_crop-smart.png",
        leader_mail: "maxwells.muntre@nabla.no",
        about: faker.lorem.paragraphs(5),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://nabla.no/media/uploads/com_pictures/nabla_under_gruppe_foto-091.jpg",
    },
    revyen: {
        // Hey if the revue is not a group but its own thing... Should this only be the "styret", and everyone else be in a reparate group?
        id: "revyen", //Should this maybe be revyen?
        name: "Nablarevyen",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/revyen.jpg.250x250_q85_crop-smart.jpg",
        mail_list: "revy-alle@nabla.no",
        leader_mail: "revy@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/HU5A9343.jpg",
    },
    nav: {
        id: "nav",
        name: "Nablas Aerodynamiske Venner",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/NAV_prof1.PNG.250x250_q85_crop-smart.png",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/Utfluks.JPG", // THIS IS A PROBLEM - GROUP PHOTO CAN BE NULL
    },
    finans: {
        id: "finans",
        name: "Nablas finansklubb",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/5F7AA176-901B-4E5A-AB0F-0AE26615B52B_1_201_a.jpeg.250x250_q85_crop-smart.jpg",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/p1330291.jpg",
    },
    nff: {
        id: "nff",
        name: "Nablas Flytende Fysikere",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Nff-Logo-1.png.250x250_q85_crop-smart.jpg",
        about: faker.lorem.paragraphs(2),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/P1270300.jpg",
    },
    handball: {
        id: "handball",
        name: "Nablas håndball-lag",
        kind: "Interest group",
        logo: "https://nabla.no/static/img/nabla-black.svg",
        about: faker.lorem.paragraph(3),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcPoGs6cAvR6_xpKCkxwPhUmiTb2cfvZhE5_Jp3-itV027PIzVsZyQSr1z26tkqV-Nrg85GxxVIPdtU001kdac8OQI9yCDG54MMQ0MaTKQJf0zlKeyXQ4e8Oq5pkO2zNTs_GrAOeQ?key=R7qQlOHoIBRTjk8sIFz5f_Zu",
    },
    klatregruppa: {
        id: "klatregruppa",
        name: "Nablas Klatregruppe",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/klatregrLogo4.png.250x250_q85_crop-smart.png",
        about: faker.lorem.paragraph(5),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/P1270842.jpg",
    },
    olbryggerlaug: {
        id: "olbryggerlaug",
        name: "Nablas Ølbryggerlaug",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/lauget.jpg.250x250_q85_crop-smart.jpg",
        leader_mail: "bryggemester@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://nabla.no/media/uploads/content/nabla_under_gruppe_ølbryggerlaug_2425.jpg",
    },
    postkom: {
        id: "postkom",
        name: "PostKom",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/PostKom_logo.png.250x250_q85_crop-smart.jpg",
        mail_list: "postkom@nabla.no",
        about: faker.lorem.paragraphs(5),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://nabla.no/media/uploads/content/nabla_under_gruppe_foto-169.jpg",
    },
    quizkom: {
        id: "quizkom",
        name: "QuizKom",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Quizkom-logo.png.250x250_q85_crop-smart.jpg",
        leader_mail: "quizkom@nabla.no",
        about: faker.lorem.sentence(2),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/quizkom-102.jpg",
    },
    reka: {
        id: "reka",
        name: "ReKa",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Reka_Reven.png.250x250_q85_crop-smart.png",
        leader_mail: "reka@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/Reka.JPG",
    },
    reven: {
        id: "reven",
        name: "ReVen",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Reka_Reven.png.250x250_q85_crop-smart.png",
        leader_mail: "reven@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo: "https://nabla.no/media/uploads/content/reven-2025.jpg",
    },
    pod: {
        id: "pod",
        name: "Skråttcast",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/skråttcast2_zxdIEaA.jpg.250x250_q85_crop-smart.jpg",
        leader_mail: "skraattcast@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "http://nabla.no/media/uploads/content/skrattcast-2025.jpg",
    },
    gravitones: {
        id: "gravitones",
        name: "The Gravitones",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/GravSvart_NpvzpPp.png.250x250_q85_crop-smart.png",
        mail_list: "gravitones@nabla.no",
        about: faker.lorem.text(),
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
        group_photo:
            "https://nabla.no/media/uploads/content/gravitones2425.jpg",
    },
    stokes: {
        id: "stokes",
        name: "The Stokes",
        kind: "Interest group",
        logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Stokes_logo.PNG.250x250_q85_crop-smart.png",
        mail_list: "thestokes@nabla.no",
        leader_mail: "lederstokes@nabla.no",
        about: `<img src: "https://nabla.no/media/uploads/content/TheStokes.jpg" width="100%"> <br> ${faker.lorem.text()}`,
        group_photo: "https://nabla.no/media/uploads/content/TheStokes.jpg",
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
    },
    utfluks: {
        id: "utfluks",
        name: "Utfluks",
        kind: "Interest group",
        logo: "https://nabla.no/static/img/nabla-black.svg",
        mail_list: "utfluks@nabla.no",
        about: faker.lorem.text(),
        group_photo: "https://nabla.no/media/uploads/content/Utfluks.JPG",
        leader: getRandomElement(Object.keys(users)),
        trusted_member: getRandomElement(Object.keys(users)),
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
