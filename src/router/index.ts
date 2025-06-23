import { createRouter, createWebHistory } from "vue-router"

import HjemView from "@/views/NablaHome.vue"
// import NyStudentView from "@/views/ny-student/NyStudent.vue"
import ProfilView from "@/views/NablaProfile.vue"
// import StillingsannonseView from '@/views/for-bedrifter/stillingsannonse/stillingsannonse.vue'
import GroupPage from "@/views/about/groups/NablaGroup.vue"
import GroupAdminPage from "@/views/about/groups/NablaGroupAdmin.vue"
import GroupsPage from "@/views/about/groups/NablaGroups.vue"
// import UnderKonstruksjonView from "@/views/error/UnderKontruksjon.vue"
import PageNotFoundView from "@/views/error/PageNotFound.vue"

import { groupPageGuard, groupAdminPageGuard } from "./guards"

const routes = [
    // Hjem
    { path: "/", component: HjemView },

    // Om Nabla
    // { path: "/om", component: AboutNabla },
    // { path: "/styret", component: NablaCouncil },
    { path: "/undergrupper", component: GroupsPage },
    {
        path: "/undergrupper/:id",
        component: GroupPage,
        props: true,
        beforeEnter: groupPageGuard,
    },
    {
        path: "/undergrupper/:id/admin",
        component: GroupAdminPage,
        props: true,
        beforeEnter: groupAdminPageGuard,
    },
    // { path: "/nabladet", component: NablaNabladet },
    // { path: "/skraattcast", component: NablaPodcast },
    // { path: "/kjelleren", component: NablaCellar },
    // { path: "/kontakt-og-varsling", component: NablaContact },

    // Calendar (filtering could be nice)
    // { path: "/kalender", component: NablaCalendar },
    // { path: "/kalender?arr", component: NablaCalendar },
    // { path: "/kalender?bedpres", component: NablaCalendar },
    // { path: "/kalender?kontor", component: NablaCalendar },

    // Career
    // { path: "/karriere", component: NablaCareer },
    // { path: "/for-bedrifter", component: ForCompanies },
    // { path: "/jobb", component: NablaJobs },
    // { path: "/eureka", component: AboutEureka },

    // Wiki
    // { path: "/wiki", component: NablaWiki },
    // { path: "/wiki/historie", component: NablaWiki },
    // { path: "/wiki/fag", component: NablaWiki },

    // Logged in utilities
    { path: "/profil", component: ProfilView },
    // { path: "/golf", component: NablaGolf },
    // { path: "/refusjon", component: NablaRefund },
    // { path: "/user-admin", component: UnderKonstruksjonView },
    // { path: "/dashboard", component: UnderKonstruksjonView },

    // Annet
    // { path: "/login", component: NablaLogin },
    { path: "/:catchAll(.*)*", component: PageNotFoundView, props: true },
    // { path: "/sok", component: UnderKonstruksjonView },
    // { path: "/ny-student", component: NyStudentView },
    // { path: "/joulekalender", component: UnderKonstruksjonView },
    // { path: "/soknad", component: UnderKonstruksjonView },
]
// Create a router instance
const router = createRouter({
    history: createWebHistory(), // Uses HTML5 History API
    routes,
})

export default router
