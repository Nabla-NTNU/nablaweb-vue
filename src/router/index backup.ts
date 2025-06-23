import { createRouter, createWebHistory } from "vue-router"

import HjemView from "@/views/NablaHome.vue"
// import NyStudentView from "@/views/ny-student/NyStudent.vue"
import ProfilView from "@/views/NablaProfile.vue"
// import StillingsannonseView from '@/views/for-bedrifter/stillingsannonse/stillingsannonse.vue'
import GroupPage from "@/views/about/groups/NablaGroup.vue"
import GroupAdminPage from "@/views/about/groups/NablaGroupAdmin.vue"
import GroupsPage from "@/views/about/groups/NablaGroups.vue"
import UnderKonstruksjonView from "@/views/error/UnderKontruksjon.vue"
import PageNotFoundView from "@/views/error/PageNotFound.vue"

import { groupPageGuard, groupAdminPageGuard } from "./guards"

const routes = [
    // Hjem
    { path: "/", component: HjemView },

    // Om Nabla
    { path: "/om", component: UnderKonstruksjonView },
    { path: "/om/fond", component: UnderKonstruksjonView },
    { path: "/om/forretningsorden", component: UnderKonstruksjonView },
    { path: "/om/lover-og-forskrifter", component: UnderKonstruksjonView },
    { path: "/om/nabla", component: UnderKonstruksjonView },
    { path: "/om/retningslinjer", component: UnderKonstruksjonView },
    { path: "/om/stillingsbeskrivelser", component: UnderKonstruksjonView },
    { path: "/om/tillitsvalgte", component: UnderKonstruksjonView },

    // For komponenter
    { path: "/for-komponenter", component: UnderKonstruksjonView },
    {
        path: "/for-komponenter/arrangementer",
        component: UnderKonstruksjonView,
    },
    { path: "/for-komponenter/blogg", component: UnderKonstruksjonView },
    {
        path: "/for-komponenter/faglig-innhold",
        component: UnderKonstruksjonView,
    },
    {
        path: "/for-komponenter/interessegrupper",
        component: UnderKonstruksjonView,
    },
    { path: "/for-komponenter/kjellern", component: UnderKonstruksjonView },
    { path: "/for-komponenter/komiteer", component: GroupsPage },
    {
        path: "/for-komponenter/komiteer/:id",
        component: GroupPage,
        props: true,
        beforeEnter: groupPageGuard,
    },
    {
        path: "/for-komponenter/komiteer/:id/admin",
        component: GroupAdminPage,
        props: true,
        beforeEnter: groupAdminPageGuard,
    },
    { path: "/for-komponenter/kontakt", component: UnderKonstruksjonView },
    {
        path: "/for-komponenter/motereferater",
        component: UnderKonstruksjonView,
    },
    {
        path: "/for-komponenter/okonomisk-stotte",
        component: UnderKonstruksjonView,
    },
    {
        path: "/for-komponenter/stillingsannonser",
        component: UnderKonstruksjonView,
    },
    { path: "/for-komponenter/styret", component: UnderKonstruksjonView },
    { path: "/for-komponenter/tjenester", component: UnderKonstruksjonView },
    {
        path: "/for-komponenter/utleggsskjema",
        component: UnderKonstruksjonView,
    },
    { path: "/for-komponenter/varsling", component: UnderKonstruksjonView },

    // For bedrifter
    { path: "/for-bedrifter", component: UnderKonstruksjonView },
    { path: "/for-bedrifter/bedriftsbesok", component: UnderKonstruksjonView },
    {
        path: "/for-bedrifter/bedriftspresentasjon",
        component: UnderKonstruksjonView,
    },
    { path: "/for-bedrifter/eureka", component: UnderKonstruksjonView },
    { path: "/for-bedrifter/kurs", component: UnderKonstruksjonView },
    {
        path: "/for-bedrifter/screeningintervju",
        component: UnderKonstruksjonView,
    },
    {
        path: "/for-bedrifter/stillingsannonse",
        component: UnderKonstruksjonView,
    },

    // Annet
    // { path: "/ny-student", component: NyStudentView },
    { path: "/joulekalender", component: UnderKonstruksjonView },
    { path: "/profil", component: ProfilView },
    // { path: "/sok", component: UnderKonstruksjonView },
    // { path: "/admin", component: UnderKonstruksjonView },

    // Diverse
    // { path: "/kontortider", component: UnderKonstruksjonView },
    // { path: "/nabladet", component: UnderKonstruksjonView },
    // { path: "/SKE", component: UnderKonstruksjonView },
    // { path: "/skraattcast", component: UnderKonstruksjonView },
    // { path: "/soknad", component: UnderKonstruksjonView },
    // { path: "/tilbakemeldinger", component: UnderKonstruksjonView },

    { path: "/:catchAll(.*)*", component: PageNotFoundView, props: true },
]

// Create a router instance
const router = createRouter({
    history: createWebHistory(), // Uses HTML5 History API
    routes,
})

export default router
