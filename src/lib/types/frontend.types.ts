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

export type Event = {
    startTime: Date
    endTime?: Date
    location?: string
    eventType: EventType
    slug?: string
    image?: URL
    link?: URL
    requiresRegistration: boolean
    organizer?: NablaGroup[]
    totalCapacity?: number
    hiddenIfUnavailable: boolean
    registrationRules?: Map<string, RegistrationInfo> // string is group name
    comments: EventComment[]
    reactions: Reaction[]
    owningGroups: NablaGroup[]
    owningPeople: NablaUser[]
    participants: EventParticipant[]
    waitingList: EventParticipant[]

    title: string
    ingress?: string
    body: string
}

export type RegistrationInfo = {
    registrationStart: Date
    registrationEnd: Date
    deregistrationEnd: Date
    allocatedPlaces: number
    price: number
}

export enum EventType {
    bedpress,
    ordinary,
    payment,
}

export type EventComment = {
    user: NablaUser
    text: string
    reactions: Reaction[]
}

export type Reaction = {
    user: NablaUser
    reactionType: Emote
}

export enum Emote {
    like,
    dislike,
    nabla,
    heart,
    angry,
    laugh,
}

export type EventParticipant = {
    user: NablaUser
    registrationDate: Date
}
