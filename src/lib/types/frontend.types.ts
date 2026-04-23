// null: defined to be null in db
// undefined: not yet fetched from db. Can write class that fetches unfetched data if we want.

export type NablaGroup = {
    id: string // Also the URL of the group
    name?: string
    members?: GroupMember[]
    kind?: GroupKind
    logo?: URL
    mailList?: string | null
    leaderMail?: string | null
    leader?: NablaUser
    trustedMember?: NablaUser
    about?: string
    groupPhoto?: URL
    date?: Date
    isActive?: boolean
}

export enum GroupKind {
    InterestGroup = "Interest group",
    Committee = "Committee",
}

export type GroupMember = {
    user: NablaUser
    role?: string
    date?: Date
    isActive?: boolean
}

export type NablaUser = {
    username: string
    firstName?: string
    lastName?: string
    profilePicture?: URL
    isActive?: boolean
    class?: string
    memberOf?: NablaGroup[]
    pastMemberOf?: NablaGroup[]
    ntnuEmail?: string
    listEmail?: string
    publicEmail?: string
    about?: string
    birthday?: Date | null
    website?: URL
}

export type HeaderItem = {
    text: string
    link: string
    // Could be recursive, but multiple dropdown layers is bad UX
    dropdownItems?: {
        text: string
        link: string
    }[]
}

export enum StyleTheme {
    Classic = "classic",
    Modern = "modern",
}

export enum ColorTheme {
    Light = "light",
    Dark = "dark",
    System = "system",
}

export type TrustedAssignment = {
    user: {
        username: string
        firstName: string
        lastName: string
        ntnuEmail: string
    }
    order: number
}

export type TrustedArea = {
    id: string
    name: string
    areaMail: string | null
    order: number
    assignments: TrustedAssignment[]
}

export type TrustedCategory = {
    id: string
    displayName: string
    order: number
    areas: TrustedArea[]
}
