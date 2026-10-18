import { base, en, Faker, nb_NO, sv } from "@faker-js/faker"
import { createClient, UserResponse } from "@supabase/supabase-js"
import pLimit from "p-limit"
import type { Database } from "../src/lib/types/database.types.js"
import { randomInt } from "crypto"
import "dotenv/config"

type NablaUser = Database["nablaweb_vue"]["Tables"]["nabla_users"]["Insert"]
type NablaGroup = Database["nablaweb_vue"]["Tables"]["nabla_groups"]["Insert"]
type NablaSubgroup =
    Database["nablaweb_vue"]["Tables"]["nabla_subgroups"]["Insert"]
type NablaClass = Database["nablaweb_vue"]["Tables"]["nabla_classes"]["Insert"]
type NablaGroupMember =
    Database["nablaweb_vue"]["Tables"]["nabla_group_members"]["Insert"]
type NablaUserDict = { [username: string]: NablaUser }
type NablaEvent = Database["nablaweb_vue"]["Tables"]["nabla_events"]["Insert"]
type NablaEventTranslation =
    Database["nablaweb_vue"]["Tables"]["nabla_events_translations"]["Insert"]
type NablaEventRegistrationTier =
    Database["nablaweb_vue"]["Tables"]["nabla_events_registrations"]["Insert"]
type NablaEventParticipant =
    Database["nablaweb_vue"]["Tables"]["nabla_events_participants"]["Insert"]

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
        "Missing SUPABASE_SERVICE_ROLE_KEY. Try running npm run env:pull.",
    )
    process.exit(1)
}
type NablaGroupDict = {
    [id: string]: { group: NablaGroup; subgroup: NablaSubgroup }
}

const supabase = createClient<Database>(
    process.env.SUPABASE_URL ?? "http://127.0.0.1:54321",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const faker = new Faker({
    locale: [nb_NO, sv, en, base], // Faker doesn't support nynorsk atm :((
})

// ------------------------------------------------------------
// Fixed passwords for testing
const FIXED_TEST_PASSWORDS: Record<string, string> = {
    admin: "admin123",
    user: "user123",
}

// ------------------------------------------------------------
// Helper to check whether a table already has rows,
// so each seeding section can skip itself on a rerun instead of
// erroring
// ------------------------------------------------------------
async function tableRowCount(table: string): Promise<number> {
    const { count, error } = await supabase
        .schema("nablaweb_vue")
        .from(table)
        .select("*", { count: "exact", head: true })
    if (error) {
        console.error(`Error checking existing rows in ${table}:`, error)
        return 0
    }
    return count ?? 0
}

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
    }
    return user
}

function makeGroup(
    id: string,
    name: string,
    mail_list?: string,
    is_active: boolean = true,
): NablaGroup {
    return {
        id,
        name,
        mail_list,
        is_active,
    }
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

    return users
}

async function addUsersToSupabase(users: NablaUserDict) {
    const throttle = pLimit(100) // Sending a lot of requests here drowns postgres a bit

    const tasks = Object.values(users).map((user) =>
        throttle(() =>
            supabase.auth.admin.createUser({
                email: user.ntnu_email,
                password: FIXED_TEST_PASSWORDS[user.username] ?? user.username,
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
            if (users[username]) {
                users[username].supabase_id = response.data.user?.id
            }
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
    if (error) {
        console.log("Error inserting users to nabla_users")
        console.log(error)
    }
}

function getRandomElement(array: string[]) {
    return array[randomInt(0, array.length)]
}

console.log("Making users...")
let users: NablaUserDict
if ((await tableRowCount("nabla_users")) > 0) {
    console.log("Users already seeded - reusing existing users.")
    const { data: existingUsers, error } = await supabase
        .schema("nablaweb_vue")
        .from("nabla_users")
        .select("*")
    if (error) throw error
    users = Object.fromEntries(
        (existingUsers as NablaUser[]).map((u) => [u.username, u]),
    )
} else {
    const nUsers = 500
    const usersLocal = makeRandomUsers(nUsers - 2)

    const admin = makeUser("Admin", "Adminsdotter", "admin")
    const user = makeUser("User", "Userssønn", "user")
    usersLocal[admin.username] = admin
    usersLocal[user.username] = user

    users = await addUsersToSupabase(usersLocal)
    await addUsersToDB(users)
}

console.log("Making admin an admin...")
const { error: adminError } = await supabase
    .schema("nablaweb_vue")
    .from("nabladmins")
    .upsert({
        user: "admin",
        reason: "Administration",
    })
if (adminError) console.error(adminError)

console.log("Making groups and subgroups...")
const groupEntries: NablaGroupDict = {
    arrkom: {
        group: makeGroup("arrkom", "ArrKom", "arrkom@nabla.no"),
        subgroup: {
            id: "arrkom",
            kind: "Committee",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/IMG_0306_HcJuzGf.jpg.250x250_q85_crop-smart.jpg",
            leader_mail: "arrsjef@nabla.no",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcOBN0lTkj6KlhMZh2-auUo_fZWROoupD8MP7s4HX3mWZGmgdHArYsrQONBCKkJbU4P5oerMFRvxEYI61ShI4o_WORi3aSixAvaP0OXtMz3e02oysiTqa3LMy6CFUKZCfDP-5l5Jev7YjAANeYHJJoT2q0?key=aeJqyczQFfxPqAbucOqYxBAM",
        },
    },
    bedkom: {
        group: makeGroup(
            "bedkom",
            "Bedriftskontakten Nabla",
            "bedkom@nabla.no",
        ),
        subgroup: {
            id: "bedkom",
            kind: "Committee",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Ny_BN-logo-2_FLQ8NVr.jpg.250x250_q85_crop-smart.png",
            leader_mail: "bedriftskontakt@nabla.no",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo: "https://nabla.no/media/uploads/content/bn201.jpg",
        },
    },
    educom: {
        group: makeGroup("educom", "Educom", undefined),
        subgroup: {
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
    },
    fadderkom: {
        group: makeGroup("fadderkom", "FadderKom", undefined),
        subgroup: {
            id: "fadderkom",
            kind: "Committee",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Skjermbilde_2024-11-06_kl._08.17.07.png.250x250_q85_crop-smart.png",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://lh7-rt.googleusercontent.com/docsz/AD_4nXftykOYRdyz1BUXGUbB_c4LL06VAT82mABdN_VrmkaGK40cbcP37F-zTcV2q3Bo8F7iEls0e2ksUr4EuwvImQ9yYDwG_ywe0-eP38v49-dEVDyy2fvbA5FJCAOEg-pBYYEwbIBBfd0Mj3lZwmy_DK9TPuDn?key=KyKQVimNYgblVFL0RAGYWJpc",
        },
    },
    kjellerstyret: {
        group: makeGroup(
            "kjellerstyret",
            "Kjellerstyret",
            "kjellern.hk18@nabla.no",
        ),
        subgroup: {
            id: "kjellerstyret",
            kind: "Committee",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/kjellerstyret_dDWDFE9.png.250x250_q85_crop-smart.png.250x250_q85_crop-smart.png",
            leader_mail: "kjellersjef@nabla.no",
            about: faker.lorem.paragraphs(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://lh7-rt.googleusercontent.com/docsz/AD_4nXe4MH5vyqY0EpjCWbVARuCBwrkYYF1a02soMPSAciZSaPXFYVoTXvLqZWh4TCRjgHICAunUc8HGpK74wbd_s7OApNZX9X038BUNhr7ugESwWNHt46KtHSzKaVb9dW1eNUd_N61yhbdUgyh9OW3J-lf5wwE?key=Ub7xtpmS0D3jF3uiC4Wgdvhi",
        },
    },
    kontorkom: {
        group: makeGroup("kontorkom", "KontorKom", "kontorkom@nabla.no"),
        subgroup: {
            id: "kontorkom",
            kind: "Committee",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Kontorkom_Logo.jpg.250x250_q85_crop-smart.jpg",
            leader_mail: "leder.kontorkom@nabla.no",
            about: faker.lorem.paragraph(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://lh7-rt.googleusercontent.com/docsz/AD_4nXc2sD9zUyyPowNu3gcaf4tYj6pSFYfUujQ0wQ4-40KVb1Pa-0CP0zeUUwBbBWM4Y517-KnlIweRcllEQxIu3DHFBuGyk7Ts4w9L6unUygm1NvPeCSiI1GEvSGP3s6m32bnRmp2Uwg?key=R7qQlOHoIBRTjk8sIFz5f_Zu",
        },
    },
    prokom: {
        group: makeGroup("prokom", "ProKom", "prokom@nabla.no"),
        subgroup: {
            id: "prokom",
            kind: "Committee",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Prokom-ikon-monokrom.jpg.250x250_q85_crop-smart.jpg",
            leader_mail: "leder.prokom@nabla.no",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://nabla.no/media/uploads/com_pictures/HU5A9317.jpeg",
        },
    },
    redaksjonen: {
        group: makeGroup("redaksjonen", "Redaksjonen", "nabladet@nabla.no"),
        subgroup: {
            id: "redaksjonen",
            kind: "Committee",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/redaksjonen_logo.jpg.250x250_q85_crop-smart.jpg",
            leader_mail: "redaktor@nabla.no",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://nabla.no/media/uploads/content/Nabladet_logo_bla.JPG",
        },
    },
    sportskom: {
        group: makeGroup("sportskom", "SportsKom", "sportskom@nabla.no"),
        subgroup: {
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
    },
    styret: {
        group: makeGroup("styret", "Styret", undefined),
        subgroup: {
            id: "styret",
            kind: "Committee",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/styret.jpeg.250x250_q85_crop-smart.jpg",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://nabla.no/media/uploads/com_pictures/HU5A1682.jpg",
        },
    },
    webkom: {
        group: makeGroup("webkom", "WebKom", "webkom@nabla.no"),
        subgroup: {
            id: "webkom",
            kind: "Committee",
            logo: "https://nabla.no/media/thumbnails/uploads/news_pictures/webkom-logo_cd43LtI.png.250x250_q85_crop-smart.png",
            leader_mail: "websjef@nabla.no",
            about: faker.lorem.text(),
            group_photo:
                "https://nabla.no/media/uploads/content/nabla_under_gruppe_foto-004.jpg",
            leader: "admin",
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    casinus: {
        group: makeGroup("casinus", "Casinus", undefined),
        subgroup: {
            id: "casinus",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Casinus_2.png.250x250_q85_crop-smart.png",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd04_Y2dquwJ2nhmcTVY8vStUNCQmIZUqA8RBPs-nJDG_KoJ3C_-EA_vt-4dw-QEHmW4GbIgS3476nSApEu0DbGbb3goKWOX9VqssqL2U6hDP5SlgHJpWWU049jYSJVv8FTZOq-DQ?key=WJSp9qahF5-MtEm6b_9b_Qkh",
        },
    },
    koreolis: {
        group: makeGroup("koreolis", "Koreolis", "koreolis@nabla.no"),
        subgroup: {
            id: "koreolis",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/koreolis_logo.jpg.250x250_q85_crop-smart.jpg",
            leader_mail: "koreolis.kraften@nabla.no",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://nabla.no/media/uploads/content/koreolis-2025.jpeg",
        },
    },
    kultkom: {
        group: makeGroup("kultkom", "Kultkom", undefined),
        subgroup: {
            id: "kultkom",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Kultkom.png.250x250_q85_crop-smart.png",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://nabla.no/media/uploads/content/nabla_under_gruppe_kultkom.jpg",
        },
    },
    lopeklubben: {
        group: makeGroup("lopeklubben", "Løpeklubben", undefined),
        subgroup: {
            id: "lopeklubben",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/lopelogo.png.250x250_q85_crop-smart.png",
            about: faker.lorem.paragraphs(),
            group_photo: "https://nabla.no/media/uploads/content/Utfluks.JPG",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    makernabla: {
        group: makeGroup("makernabla", "MakerNabla", undefined, false),
        subgroup: {
            id: "makernabla",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/maker_nabla_vrtWpwO.jpg.250x250_q85_crop-smart.jpg",
            about: faker.lorem.paragraphs(),
            group_photo: "https://nabla.no/media/uploads/content/Utfluks.JPG",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    m3: {
        group: makeGroup("m3", "Maxwells Muntre Musikanter", undefined),
        subgroup: {
            id: "m3",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Maxwells_logo_1ob4IqE.png.250x250_q85_crop-smart.png",
            leader_mail: "maxwells.muntre@nabla.no",
            about: faker.lorem.paragraphs(5),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://nabla.no/media/uploads/com_pictures/nabla_under_gruppe_foto-091.jpg",
        },
    },
    revyen: {
        group: makeGroup("revyen", "Nablarevyen", "revy-alle@nabla.no"),
        subgroup: {
            id: "revyen",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/revyen.jpg.250x250_q85_crop-smart.jpg",
            leader_mail: "revy@nabla.no",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo: "https://nabla.no/media/uploads/content/HU5A9343.jpg",
        },
    },
    nav: {
        group: makeGroup(
            "nav",
            "Nablas Aerodynamiske Venner",
            undefined,
            false,
        ),
        subgroup: {
            id: "nav",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/NAV_prof1.PNG.250x250_q85_crop-smart.png",
            about: faker.lorem.text(),
            group_photo: "https://nabla.no/media/uploads/content/Utfluks.JPG",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    finans: {
        group: makeGroup("finans", "Nablas finansklubb", undefined, false),
        subgroup: {
            id: "finans",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/5F7AA176-901B-4E5A-AB0F-0AE26615B52B_1_201_a.jpeg.250x250_q85_crop-smart.jpg",
            about: faker.lorem.text(),
            group_photo: "https://nabla.no/media/p1330291.jpg",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    nff: {
        group: makeGroup("nff", "Nablas Flytende Fysikere", undefined),
        subgroup: {
            id: "nff",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Nff-Logo-1.png.250x250_q85_crop-smart.jpg",
            about: faker.lorem.paragraphs(2),
            group_photo: "https://nabla.no/media/uploads/content/P1270300.jpg",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    handball: {
        group: makeGroup("handball", "Nablas håndball-lag", undefined),
        subgroup: {
            id: "handball",
            kind: "Interest group",
            logo: "https://nabla.no/static/img/nabla-black.svg",
            about: faker.lorem.paragraph(3),
            group_photo:
                "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcPoGs6cAvR6_xpKCkxwPhUmiTb2cfvZhE5_Jp3-itV027PIzVsZyQSr1z26tkqV-Nrg85GxxVIPdtU001kdac8OQI9yCDG54MMQ0MaTKQJf0zlKeyXQ4e8Oq5pkO2zNTs_GrAOeQ?key=R7qQlOHoIBRTjk8sIFz5f_Zu",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    klatregruppa: {
        group: makeGroup("klatregruppa", "Nablas Klatregruppe", undefined),
        subgroup: {
            id: "klatregruppa",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/klatregrLogo4.png.250x250_q85_crop-smart.png",
            about: faker.lorem.paragraph(5),
            group_photo: "https://nabla.no/media/uploads/content/P1270842.jpg",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    olbryggerlaug: {
        group: makeGroup("olbryggerlaug", "Nablas Ølbryggerlaug", undefined),
        subgroup: {
            id: "olbryggerlaug",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/lauget.jpg.250x250_q85_crop-smart.jpg",
            leader_mail: "bryggemester@nabla.no",
            about: faker.lorem.text(),
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
            group_photo:
                "https://nabla.no/media/uploads/content/nabla_under_gruppe_ølbryggerlaug_2425.jpg",
        },
    },
    postkom: {
        group: makeGroup("postkom", "PostKom", "postkom@nabla.no"),
        subgroup: {
            id: "postkom",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/PostKom_logo.png.250x250_q85_crop-smart.jpg",
            about: faker.lorem.paragraphs(5),
            group_photo:
                "https://nabla.no/media/uploads/content/nabla_under_gruppe_foto-169.jpg",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    quizkom: {
        group: makeGroup("quizkom", "QuizKom", undefined),
        subgroup: {
            id: "quizkom",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Quizkom-logo.png.250x250_q85_crop-smart.jpg",
            leader_mail: "quizkom@nabla.no",
            about: faker.lorem.sentence(2),
            group_photo:
                "https://nabla.no/media/uploads/content/quizkom-102.jpg",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    reka: {
        group: makeGroup("reka", "ReKa", undefined),
        subgroup: {
            id: "reka",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Reka_Reven.png.250x250_q85_crop-smart.png",
            leader_mail: "reka@nabla.no",
            about: faker.lorem.text(),
            group_photo: "https://nabla.no/media/uploads/content/Reka.JPG",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    reven: {
        group: makeGroup("reven", "ReVen", undefined),
        subgroup: {
            id: "reven",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Reka_Reven.png.250x250_q85_crop-smart.png",
            leader_mail: "reven@nabla.no",
            about: faker.lorem.text(),
            group_photo:
                "https://nabla.no/media/uploads/content/reven-2025.jpg",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    pod: {
        group: makeGroup("pod", "Skråttcast", undefined),
        subgroup: {
            id: "pod",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/skråttcast2_zxdIEaA.jpg.250x250_q85_crop-smart.jpg",
            leader_mail: "skraattcast@nabla.no",
            about: faker.lorem.text(),
            group_photo:
                "http://nabla.no/media/uploads/content/skrattcast-2025.jpg",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    gravitones: {
        group: makeGroup("gravitones", "The Gravitones", "gravitones@nabla.no"),
        subgroup: {
            id: "gravitones",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/GravSvart_NpvzpPp.png.250x250_q85_crop-smart.png",
            about: faker.lorem.text(),
            group_photo:
                "https://nabla.no/media/uploads/content/gravitones2425.jpg",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    stokes: {
        group: makeGroup("stokes", "The Stokes", "thestokes@nabla.no"),
        subgroup: {
            id: "stokes",
            kind: "Interest group",
            logo: "https://nabla.no/media/thumbnails/uploads/com_pictures/Stokes_logo.PNG.250x250_q85_crop-smart.png",
            leader_mail: "lederstokes@nabla.no",
            about: `<img src: "https://nabla.no/media/uploads/content/TheStokes.jpg" width="100%"> <br> ${faker.lorem.text()}`,
            group_photo: "https://nabla.no/media/uploads/content/TheStokes.jpg",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
    utfluks: {
        group: makeGroup("utfluks", "Utfluks", "utfluks@nabla.no"),
        subgroup: {
            id: "utfluks",
            kind: "Interest group",
            logo: "https://nabla.no/static/img/nabla-black.svg",
            about: faker.lorem.text(),
            group_photo: "https://nabla.no/media/uploads/content/Utfluks.JPG",
            leader: getRandomElement(Object.keys(users)),
            trusted_member: getRandomElement(Object.keys(users)),
        },
    },
}

// Extract base groups and subgroups for individual upserting
const groupsList = Object.values(groupEntries).map((e) => e.group)
const subgroupsList = Object.values(groupEntries).map((e) => e.subgroup)

// 1. Insert into nabla_groups first (parent table)
const { error: errorGroups } = await supabase
    .schema("nablaweb_vue")
    .from("nabla_groups")
    .upsert(groupsList)
if (errorGroups) {
    console.log("Error inserting nabla_groups:", errorGroups)
} else {
    console.log(`Inserted ${groupsList.length} rows into nabla_groups`)
}

// 2. Insert into nabla_subgroups (child table)
const { error: errorSubgroups } = await supabase
    .schema("nablaweb_vue")
    .from("nabla_subgroups")
    .upsert(subgroupsList)
if (errorSubgroups) {
    console.log("Error inserting nabla_subgroups:", errorSubgroups)
} else {
    console.log(`Inserted ${subgroupsList.length} rows into nabla_subgroups`)
}

console.log("Seeding classes and adding users to classes...")
const classYears = ["kull25", "kull24", "kull23", "kull22", "kull21", "kull20"]
const classGroups: NablaGroup[] = classYears.map((c) => ({
    id: c,
    name: `Fysmat ${c.replace("kull", "")}`,
}))

const classRows: NablaClass[] = classYears.map((c) => ({
    id: c,
    class: c,
}))

// Upsert class entities into nabla_groups and nabla_classes
await supabase.schema("nablaweb_vue").from("nabla_groups").upsert(classGroups)
await supabase.schema("nablaweb_vue").from("nabla_classes").upsert(classRows)

// Assign each user to a random class group via nabla_group_members
const classMemberships: NablaGroupMember[] = Object.keys(users).map(
    (username, index) => {
        const randomClassId = getRandomElement(classYears)
        return {
            user: username,
            group: randomClassId,
            member_role: "Student",
            is_active: true,
            order: index,
        }
    },
)

console.log("Populating groups with members...")
const memberships: NablaGroupMember[] = [...classMemberships]
const usedPairs = new Set<string>(
    classMemberships.map((m) => `${m.user}:${m.group}`),
)

// 1. Ensure every subgroup gets at least a couple of members (e.g., leader, trusted member, plus a random member)
for (const [groupId, entry] of Object.entries(groupEntries)) {
    // Add the leader if they exist
    if (
        entry.subgroup.leader &&
        !usedPairs.has(`${entry.subgroup.leader}:${groupId}`)
    ) {
        usedPairs.add(`${entry.subgroup.leader}:${groupId}`)
        memberships.push({
            user: entry.subgroup.leader,
            group: groupId,
            member_role: "Leder",
            is_active: true,
            order: memberships.length,
        })
    }

    // Add 3 to 5 random members to this subgroup
    for (let i = 0; i < 4; i++) {
        const randomUser = getRandomElement(Object.keys(users))
        const pairKey = `${randomUser}:${groupId}`
        if (!usedPairs.has(pairKey)) {
            usedPairs.add(pairKey)
            memberships.push({
                user: randomUser,
                group: groupId,
                member_role: faker.company.catchPhrase(),
                is_active: true,
                order: memberships.length,
            })
        }
    }
}
const { error: membershipError } = await supabase
    .schema("nablaweb_vue")
    .from("nabla_group_members")
    .upsert(memberships)
if (membershipError) console.error(membershipError)

type TrustedCategory =
    Database["nablaweb_vue"]["Tables"]["trusted_member_categories"]["Insert"]
type TrustedArea =
    Database["nablaweb_vue"]["Tables"]["trusted_member_areas"]["Insert"]
type TrustedAssignment =
    Database["nablaweb_vue"]["Tables"]["trusted_member_assignments"]["Insert"]

console.log("Seeding Trusted Member Categories...")
if ((await tableRowCount("trusted_member_categories")) > 0) {
    console.log("Trusted member categories already seeded - skipping.")
} else {
    const categories: TrustedCategory[] = [
        { id: "ftv", display_name: "Fakultetstillitsvalgte (FTV)", order: 1 },
        { id: "itv", display_name: "Instituttillitsvalgte (ITV)", order: 2 },
        { id: "ptv", display_name: "Programtillitsvalgte (PTV)", order: 3 },
        { id: "ktv", display_name: "Klassetillitsvalgte (KTV)", order: 4 },
    ]

    const { error: trustedCategories } = await supabase
        .schema("nablaweb_vue")
        .from("trusted_member_categories")
        .upsert(categories)

    if (trustedCategories) console.error(trustedCategories)
}

console.log("Seeding Trusted Member Areas...")
if ((await tableRowCount("trusted_member_areas")) > 0) {
    console.log("Trusted member areas already seeded - skipping.")
} else {
    const areas: TrustedArea[] = [
        {
            id: "ftv-nv",
            category: "ftv",
            display_name: "Fakultet for naturvitenskap (NV)",
            area_mail: "nv-ftv@studentrad.ntnu.no",
            order: 1,
        },
        {
            id: "ftv-ie",
            category: "ftv",
            display_name:
                "Fakultet for informasjonsteknologi og elektroteknikk (IE)",
            area_mail: "ie-ftv@studentrad.ntnu.no",
            order: 2,
        },
        {
            id: "itv-ify",
            category: "itv",
            display_name: "Institutt for fysikk (IFY)",
            area_mail: "nv-fysikk@studentrad.ntnu.no",
            order: 1,
        },
        {
            id: "itv-imf",
            category: "itv",
            display_name: "Institutt for matematiske fag (IMF)",
            area_mail: "imf@sr-ie.no",
            order: 2,
        },
        { id: "ptv-fysmat", category: "ptv", display_name: "Fysmat", order: 1 },
        {
            id: "ktv-24",
            category: "ktv",
            display_name: "Fysmat kull 24",
            order: 1,
        },
        {
            id: "ktv-23",
            category: "ktv",
            display_name: "Fysmat kull 23",
            order: 2,
        },
        {
            id: "ktv-22",
            category: "ktv",
            display_name: "Fysmat kull 22",
            order: 3,
        },
        {
            id: "ktv-21",
            category: "ktv",
            display_name: "Fysmat kull 21",
            order: 4,
        },
        {
            id: "ktv-20",
            category: "ktv",
            display_name: "Fysmat kull 20",
            order: 5,
        },
    ]

    const { error: areaError } = await supabase
        .schema("nablaweb_vue")
        .from("trusted_member_areas")
        .upsert(areas)
    if (areaError) console.error(areaError)
}

console.log("Assigning users to Trusted Member roles...")
if ((await tableRowCount("trusted_member_assignments")) > 0) {
    console.log("Trusted member assignments already seeded - skipping.")
} else {
    const assignments: TrustedAssignment[] = []
    const usernames = Object.keys(users)

    const singlePersonAreas = ["ftv-nv", "ftv-ie", "itv-ify", "itv-imf"]
    for (const areaId of singlePersonAreas) {
        assignments.push({
            area_id: areaId,
            username: getRandomElement(usernames),
            order: 0,
        })
    }

    const doublePersonAreas = [
        "ptv-fysmat",
        "ktv-24",
        "ktv-23",
        "ktv-22",
        "ktv-21",
        "ktv-20",
    ]

    for (const areaId of doublePersonAreas) {
        assignments.push({
            area_id: areaId,
            username: getRandomElement(usernames),
            order: 0,
        })
        assignments.push({
            area_id: areaId,
            username: getRandomElement(usernames),
            order: 1,
        })
    }

    const { error: assignError } = await supabase
        .schema("nablaweb_vue")
        .from("trusted_member_assignments")
        .upsert(assignments)

    if (assignError) {
        console.log("Error in assignments:", assignError)
    } else {
        console.log(
            `Successfully assigned ${assignments.length} trusted members.`,
        )
    }
}

console.log("Seeding Events...")
if ((await tableRowCount("nabla_events")) > 0) {
    console.log("Events already seeded - skipping.")
} else {
    const events: NablaEvent[] = [
        {
            slug: "immball-2026",
            event_type: "payment",
            event_photo:
                "https://nabla.no/media/uploads/content/nabla_under_gruppe_foto-004.jpg",
            start_time: "2026-09-17T18:00:00+01:00",
            end_time: "2026-09-17T23:59:00+01:00",
            location: "R1, Realfagbygget",
            registration_required: true,
            organiser: "arrkom",
            global_registration_limit: 250,
            is_hidden: false,
        },
        {
            slug: "bedriftspresentasjon-example-as",
            event_type: "bedpress",
            event_photo: "https://nabla.no/media/uploads/content/bn201.jpg",
            start_time: "2026-09-15T17:15:00+01:00",
            end_time: "2026-09-15T19:00:00+01:00",
            location: "KJEL21, Kjelhuset",
            registration_required: true,
            organiser: "bedkom",
            global_registration_limit: 30,
            is_hidden: false,
        },
        {
            slug: "julebohr-2026",
            event_type: "payment",
            event_photo:
                "https://nabla.no/media/uploads/com_pictures/HU5A1682.jpg",
            start_time: "2026-12-05T19:00:00+01:00",
            end_time: "2026-12-05T23:00:00+01:00",
            location: "Realfagkantina, Realfagbygget",
            registration_required: true,
            organiser: "arrkom",
            global_registration_limit: 100,
            is_hidden: false,
        },
    ]

    const { error: eventsError } = await supabase
        .schema("nablaweb_vue")
        .from("nabla_events")
        .upsert(events)
    if (eventsError) console.error(eventsError)

    const translations: NablaEventTranslation[] = [
        {
            event: events[0].slug!,
            language: "nb",
            title: "Immatrikuleringsball",
            description:
                "Finn frem finstasen og gjør dere klare for årets begivenhet i Nabla. Immball blir den 17. september på frimurerlogen",
            body_text: faker.lorem.paragraphs(2),
        },
        {
            event: events[0].slug!,
            language: "en",
            title: "Admissions ball",
            description:
                "Get ready for this year's event in Nabla. The Admissions ball will be held on September 17th at the Freemason's Lodge.",
            body_text: faker.lorem.paragraphs(2),
        },
        {
            event: events[1].slug!,
            language: "nb",
            title: "Bedriftspresentasjon: Example AS",
            description: "Bli kjent med Example AS over pizza og mingling.",
            body_text: faker.lorem.paragraphs(2),
        },
        {
            event: events[1].slug!,
            language: "en",
            title: "Company presentation: Example AS",
            description: "Get to know Example AS over pizza and mingling.",
            body_text: faker.lorem.paragraphs(2),
        },
        {
            event: events[2].slug!,
            language: "nb",
            title: "Julebohr",
            description:
                "Årets julebohr i realfagkantina - god mat og godt selskap.",
            body_text: faker.lorem.paragraphs(3),
        },
        {
            event: events[2].slug!,
            language: "en",
            title: "Christmas dinner",
            description:
                "This year's Christmas dinner in the realfagkantina - good food and good company.",
            body_text: faker.lorem.paragraphs(3),
        },
    ]

    const { error: translationsError } = await supabase
        .schema("nablaweb_vue")
        .from("nabla_events_translations")
        .upsert(translations)
    if (translationsError) {
        console.error(translationsError)
    } else {
        console.log(`Seeded ${events.length} events with translations.`)
    }

    console.log("Seeding Registration Tiers...")
    // Tiers are keyed by group: a class (kull25) or a subgroup (arrkom).
    // nabla_group: null is the default tier for anyone without a matching group.
    const registrationTiers: NablaEventRegistrationTier[] = [
        // Immball: default 350, first-years 250, ArrKom members 200
        {
            id: crypto.randomUUID(),
            event: events[0].slug!,
            nabla_group: null,
            nabla_group_capacity: 180,
            price_kr: 350,
            payment_end: "2026-09-14T23:59:00+02:00",
            registration_start: "2026-08-25T12:00:00+02:00",
            registration_end: "2026-09-14T23:59:00+02:00",
            deregistration_end: "2026-09-12T23:59:00+02:00",
        },
        {
            id: crypto.randomUUID(),
            event: events[0].slug!,
            nabla_group: "kull25",
            nabla_group_capacity: 250,
            price_kr: 250,
            payment_end: "2026-09-14T23:59:00+02:00",
            registration_start: "2026-08-25T12:00:00+02:00",
            registration_end: "2026-09-14T23:59:00+02:00",
            deregistration_end: "2026-09-12T23:59:00+02:00",
        },
        {
            id: crypto.randomUUID(),
            event: events[0].slug!,
            nabla_group: "arrkom",
            nabla_group_capacity: 20,
            price_kr: 200,
            payment_end: "2026-09-14T23:59:00+02:00",
            registration_start: "2026-08-25T12:00:00+02:00",
            registration_end: "2026-09-14T23:59:00+02:00",
            deregistration_end: "2026-09-12T23:59:00+02:00",
        },
        // Bedriftspresentasjon: free, default tier only
        {
            id: crypto.randomUUID(),
            event: events[1].slug!,
            nabla_group: null,
            nabla_group_capacity: null,
            price_kr: 0,
            payment_end: null,
            registration_start: "2026-09-01T12:00:00+02:00",
            registration_end: "2026-09-15T12:00:00+02:00",
            deregistration_end: "2026-09-14T12:00:00+02:00",
        },
        // Julebord: default 450, first-years 300
        {
            id: crypto.randomUUID(),
            event: events[2].slug!,
            nabla_group: null,
            nabla_group_capacity: 50,
            price_kr: 450,
            payment_end: "2026-12-03T23:59:00+01:00",
            registration_start: "2026-11-15T12:00:00+01:00",
            registration_end: "2026-12-03T23:59:00+01:00",
            deregistration_end: "2026-12-01T23:59:00+01:00",
        },
        {
            id: crypto.randomUUID(),
            event: events[2].slug!,
            nabla_group: "kull25",
            nabla_group_capacity: 100,
            price_kr: 300,
            payment_end: "2026-12-03T23:59:00+01:00",
            registration_start: "2026-11-15T12:00:00+01:00",
            registration_end: "2026-12-03T23:59:00+01:00",
            deregistration_end: "2026-12-01T23:59:00+01:00",
        },
    ]

    const { error: registrationsError } = await supabase
        .schema("nablaweb_vue")
        .from("nabla_events_registrations")
        .upsert(registrationTiers)
    if (registrationsError) {
        console.error(registrationsError)
    } else {
        console.log(`Seeded ${registrationTiers.length} registration tiers.`)
    }

    console.log("Seeding Participants...")
    // Which groups each user belongs to (classes and subgroups), and the reverse
    const groupsByUser = new Map<string, string[]>()
    const membersByGroup = new Map<string, string[]>()
    for (const m of memberships) {
        groupsByUser.set(m.user, [...(groupsByUser.get(m.user) ?? []), m.group])
        membersByGroup.set(m.group, [
            ...(membersByGroup.get(m.group) ?? []),
            m.user,
        ])
    }

    const usernames = Object.keys(users)
    const participants: NablaEventParticipant[] = []

    for (const event of events) {
        // Stay under the event's own limit
        const limit = event.global_registration_limit ?? 0
        const attendeeCount = Math.min(
            40,
            limit > 0 ? Math.floor(limit * 0.8) : 40,
            usernames.length,
        )

        const eventTiers = registrationTiers.filter((t) => t.event === event.id)
        const defaultTier = eventTiers.find((t) => !t.nabla_group)

        // Make sure every group-specific tier gets a few attendees,
        // then fill the rest with random users
        const picked = new Set<string>()
        for (const tier of eventTiers) {
            if (!tier.nabla_group) continue
            const members = membersByGroup.get(tier.nabla_group) ?? []
            for (const username of faker.helpers.arrayElements(
                members,
                Math.min(6, members.length),
            )) {
                if (picked.size < attendeeCount) picked.add(username)
            }
        }
        while (picked.size < attendeeCount) {
            picked.add(getRandomElement(usernames))
        }

        for (const username of picked) {
            // Register under a random one of the user's own groups that has a
            // tier for this event, otherwise under the default tier
            const userGroups = groupsByUser.get(username) ?? []
            const matchingTiers = eventTiers.filter(
                (t) => t.nabla_group && userGroups.includes(t.nabla_group),
            )
            const tier =
                matchingTiers.length > 0
                    ? faker.helpers.arrayElement(matchingTiers)
                    : defaultTier

            participants.push({
                event: event.slug!,
                username,
                status: "registered",
                registered_at: new Date(
                    Date.now() - randomInt(0, 14) * 24 * 60 * 60 * 1000,
                ).toISOString(),
                registration_tier: tier?.id ?? null,
            })
        }
    }

    const { error: participantsError } = await supabase
        .schema("nablaweb_vue")
        .from("nabla_events_participants")
        .upsert(participants)
    if (participantsError) {
        console.error(participantsError)
    } else {
        console.log(`Seeded ${participants.length} event participants.`)
    }
}
