import { base, en, Faker, nb_NO, sv } from "@faker-js/faker"
import { createClient, UserResponse } from "@supabase/supabase-js"
import pLimit from "p-limit"
import type { Database } from "../src/lib/types/database.types.js"
import { randomInt } from "crypto"

type NablaUser = Database["nablaweb_vue"]["Tables"]["nabla_users"]["Insert"]
type NablaGroup = Database["nablaweb_vue"]["Tables"]["nabla_groups"]["Insert"]
type NablaSubgroup =
    Database["nablaweb_vue"]["Tables"]["nabla_subgroups"]["Insert"]
type NablaClass = Database["nablaweb_vue"]["Tables"]["nabla_classes"]["Insert"]
type NablaGroupMember =
    Database["nablaweb_vue"]["Tables"]["nabla_group_members"]["Insert"]
type NablaUserDict = { [username: string]: NablaUser }
type NablaGroupDict = {
    [id: string]: { group: NablaGroup; subgroup: NablaSubgroup }
}

// Need service key - this is standard for local instances
const supabase = createClient<Database>(
    "http://127.0.0.1:54321",
    "sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz",
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

    return users
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
const nUsers = 500
const usersLocal = makeRandomUsers(nUsers - 2)

const admin = makeUser("Admin", "Adminsdotter", "admin")
const user = makeUser("User", "Userssønn", "user")
usersLocal[admin.username] = admin
usersLocal[user.username] = user

const users = await addUsersToSupabase(usersLocal)
await addUsersToDB(users)

console.log("Making admin an admin...")
const { error: adminError } = await supabase
    .schema("nablaweb_vue")
    .from("nabladmins")
    .insert({
        user: "admin",
        reason: "Administration",
    })
if (adminError) console.error(adminError)

console.log("Making groups and subgroups...")
const groupEntries: NablaGroupDict = {
    arrkom: {
        group: { id: "arrkom", name: "ArrKom", mail_list: "arrkom@nabla.no" },
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
        group: {
            id: "bedkom",
            name: "Bedriftskontakten Nabla",
            mail_list: "bedkom@nabla.no",
        },
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
        group: { id: "educom", name: "Educom" },
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
        group: { id: "fadderkom", name: "FadderKom" },
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
        group: {
            id: "kjellerstyret",
            name: "Kjellerstyret",
            mail_list: "kjellern.hk18@nabla.no",
        },
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
        group: {
            id: "kontorkom",
            name: "KontorKom",
            mail_list: "kontorkom@nabla.no",
        },
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
        group: { id: "prokom", name: "ProKom", mail_list: "prokom@nabla.no" },
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
        group: {
            id: "redaksjonen",
            name: "Redaksjonen",
            mail_list: "nabladet@nabla.no",
        },
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
        group: {
            id: "sportskom",
            name: "SportsKom",
            mail_list: "sportskom@nabla.no",
        },
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
        group: { id: "styret", name: "Styret" },
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
        group: { id: "webkom", name: "WebKom", mail_list: "webkom@nabla.no" },
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
        group: { id: "casinus", name: "Casinus" },
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
        group: {
            id: "koreolis",
            name: "Koreolis",
            mail_list: "koreolis@nabla.no",
        },
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
        group: { id: "kultkom", name: "Kultkom" },
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
        group: { id: "lopeklubben", name: "Løpeklubben" },
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
        group: { id: "makernabla", name: "MakerNabla" },
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
        group: { id: "m3", name: "Maxwells Muntre Musikanter" },
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
        group: {
            id: "revyen",
            name: "Nablarevyen",
            mail_list: "revy-alle@nabla.no",
        },
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
        group: { id: "nav", name: "Nablas Aerodynamiske Venner" },
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
        group: { id: "finans", name: "Nablas finansklubb" },
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
        group: { id: "nff", name: "Nablas Flytende Fysikere" },
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
        group: { id: "handball", name: "Nablas håndball-lag" },
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
        group: { id: "klatregruppa", name: "Nablas Klatregruppe" },
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
        group: { id: "olbryggerlaug", name: "Nablas Ølbryggerlaug" },
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
        group: {
            id: "postkom",
            name: "PostKom",
            mail_list: "postkom@nabla.no",
        },
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
        group: { id: "quizkom", name: "QuizKom" },
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
        group: { id: "reka", name: "ReKa" },
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
        group: { id: "reven", name: "ReVen" },
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
        group: { id: "pod", name: "Skråttcast" },
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
        group: {
            id: "gravitones",
            name: "The Gravitones",
            mail_list: "gravitones@nabla.no",
        },
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
        group: {
            id: "stokes",
            name: "The Stokes",
            mail_list: "thestokes@nabla.no",
        },
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
        group: {
            id: "utfluks",
            name: "Utfluks",
            mail_list: "utfluks@nabla.no",
        },
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
}

// 2. Insert into nabla_subgroups (child table)
const { error: errorSubgroups } = await supabase
    .schema("nablaweb_vue")
    .from("nabla_subgroups")
    .upsert(subgroupsList)
if (errorSubgroups) {
    console.log("Error inserting nabla_subgroups:", errorSubgroups)
}

console.log("Seeding classes and adding users to classes...")
const classYears = ["kull24", "kull23", "kull22", "kull21", "kull20"]
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

while (memberships.length < Object.keys(groupEntries).length + 50) {
    const user = getRandomElement(Object.keys(users))
    const group = getRandomElement(Object.keys(groupEntries))
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

type TrustedCategory =
    Database["nablaweb_vue"]["Tables"]["trusted_member_categories"]["Insert"]
type TrustedArea =
    Database["nablaweb_vue"]["Tables"]["trusted_member_areas"]["Insert"]
type TrustedAssignment =
    Database["nablaweb_vue"]["Tables"]["trusted_member_assignments"]["Insert"]

console.log("Seeding Trusted Member Categories...")
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

console.log("Seeding Trusted Member Areas...")
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
    { id: "ktv-24", category: "ktv", display_name: "Fysmat kull 24", order: 1 },
    { id: "ktv-23", category: "ktv", display_name: "Fysmat kull 23", order: 2 },
    { id: "ktv-22", category: "ktv", display_name: "Fysmat kull 22", order: 3 },
    { id: "ktv-21", category: "ktv", display_name: "Fysmat kull 21", order: 4 },
    { id: "ktv-20", category: "ktv", display_name: "Fysmat kull 20", order: 5 },
]

const { error: areaError } = await supabase
    .schema("nablaweb_vue")
    .from("trusted_member_areas")
    .upsert(areas)
if (areaError) console.error(areaError)

console.log("Assigning users to Trusted Member roles...")
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
    console.log(`Successfully assigned ${assignments.length} trusted members.`)
}

const { error } = await supabase
    .schema("nablaweb_vue")
    .from("nabla_group_members")
    .upsert(memberships)

if (error) console.log(error)
