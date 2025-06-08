// null: defined to be null in db
// undefined: not fetched from db

export type nablaGroup = {
    id: string,         // Also the URL of the group
    name: string | undefined,
    members: groupMember[] | undefined,
    kind: groupKind | undefined,
    logo: URL | undefined,
    mailList: string | null | undefined,
    leaderMailList: string | null | undefined,
    leader: groupMember | undefined,
    about: string | undefined,
    groupPhoto: URL | undefined,
    date: Date | undefined,
    isActive: boolean | undefined
}

enum groupKind {
    InterestGroup,
    Committee
}

type groupMember = {
    user: nablaUser,
    role: string | undefined,
    date: Date | undefined,
    isActive: boolean | undefined
}

export type nablaUser = {
    username: string,
    firstName: string | undefined,
    lastName: string | undefined,
    profilePicture: URL | undefined,
    isActive: boolean | undefined,
    class: string | undefined,
    memberOf: nablaGroup[] | undefined,
    ntnuEmail: string | undefined,
    listEmail: string | undefined,
    publicEmail: string | undefined,
    about: string | undefined,
    birthday: Date | undefined | null,
    website: URL | undefined
}

// Other types needed
//  - 