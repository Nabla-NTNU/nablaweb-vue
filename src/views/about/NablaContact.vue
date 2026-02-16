<script setup lang="ts">
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { useGroups } from "@/composables/useNablaGroup"

    const { groups } = useGroups()

    import NablaTable from "@/components/general/NablaTable.vue"
</script>

<template>
    <div class="mx-8 flex flex-col m:my-12 m:flex-row">
        <div>
            <h1 class="text-title-2 font-semibold">
                {{ t("kontakt") }}
            </h1>
        </div>

        <div class="m:grow">
            <br class="m:hidden" />
            <!--Flytter knappen til høyre-->
        </div>

        <div>
            <router-link
                class="rounded-full border-2 border-transparent bg-primary px-4 py-1 text-title-5 text-primary-25 duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light m:text-title-4"
                to="/for-bedrifter"
            >
                {{ t("for-bedriftshenvendelser") }}
            </router-link>
        </div>
    </div>

    <div class="mx-8 grid grid-cols-2 gap-x-20">
        <div class="text-title-3 font-semibold">
            {{ t("styret") }}
        </div>

        <div class="..."></div>

        <div class="row-span-2">
            <NablaTable :column-titles="['Stilling', 'Navn', 'Mail']">
                <tr>
                    <td>{{ t("hele-styret") }}</td>
                    <td>-</td>
                    <td>nabla@nabla.no</td>
                </tr>

                <tr>
                    <td>{{ t("leder") }}</td>
                    <td>Håkon Lindgård Olsen</td>
                    <td>leder@nabla.no</td>
                </tr>

                <tr>
                    <td>{{ t("nestleder") }}</td>
                    <td>Sigve Runde Barlaug</td>
                    <td>nestleder@nabla.no</td>
                </tr>
                <tr>
                    <td>{{ t("faddersjef/sektretær") }}</td>
                    <td>Eirik Rokk Bache</td>
                    <td>sekretaer@nabla.no</td>
                </tr>
                <tr>
                    <td>{{ t("økonomiansvarlig") }}</td>
                    <td>Juliane Mundal</td>
                    <td>kasserer@nabla.no</td>
                </tr>
                <tr>
                    <td>{{ t("koordinator") }}</td>
                    <td>Ole Marius Green</td>
                    <td>koordinator@nabla.no</td>
                </tr>
                <tr>
                    <td>{{ t("bedkomsjef") }}</td>
                    <td>Sondre Tønder Sangolt</td>
                    <td>bedriftskontakt@nabla.no</td>
                </tr>
                <tr>
                    <td>{{ t("arrangementsjef") }}</td>
                    <td>Cornelia Fure</td>
                    <td>arrsjef@nabla.no</td>
                </tr>

                <!--       Gjelder kun ved jubileum
            <tr> 
                <td>Jubileumssjef</td>
                <td>-</td>
                <td>jubileumssjef@nabla.no</td>
            </tr>
                -->
            </NablaTable>
        </div>

        <div class="self-end text-title-3 font-semibold">
            {{ t("andre-viktige-mailer") }}
        </div>

        <div class="...">
            <NablaTable :column-titles="['Stilling', 'Navn', 'Mail']">
                <tr>
                    <td>{{ t("alle") + " " + t("gruppeledere") }}</td>
                    <td>-</td>
                    <td>gruppeledere@nabla.no</td>
                </tr>
                <tr>
                    <td>{{ t("bnokonomi") }}</td>
                    <td>Martin Viken</td>
                    <td>bnokonomi@nabla.no</td>
                </tr>
                <tr>
                    <td>Eureka-{{ t("ansvarlig") }}</td>
                    <td>Mikkel Brastad</td>
                    <td>eureka@nabla.no</td>
                </tr>
            </NablaTable>
        </div>
    </div>

    <h1 class="mx-8 my-8 text-title-3 font-semibold">
        {{ t("undergrupper") }}
    </h1>

    <div class="flex-rows mx-8 my-10 justify-center">
        <NablaTable
            :column-titles="[
                '',
                t('gruppemail'),
                t('leder'),
                t('ledermail'),
                t('tillitsvalgt'),
            ]"
        >
            <tr
                v-for="group in groups.filter((g) => g.id !== 'styret')"
                :key="group.id"
            >
                <td>
                    <span class="text-title-5">
                        <router-link
                            :to="`/undergrupper/${group.id}`"
                            class="text-link"
                        >
                            {{ group.name }}
                        </router-link>
                    </span>
                </td>

                <td>
                    <span>
                        {{ group.mailList || "-" }}
                    </span>
                </td>
                <td>
                    <router-link
                        v-if="group.leader"
                        :to="`/profile/${group.leader.username}`"
                        class="text-link"
                    >
                        {{ group.leader.firstName }} {{ group.leader.lastName }}
                    </router-link>
                    <span v-else>-</span>
                </td>
                <td>
                    {{ group.leaderMail || "-" }}
                </td>
                <td>
                    <router-link
                        v-if="group.trustedMember"
                        :to="`/profile/${group.trustedMember.username}`"
                        class="text-link"
                    >
                        {{ group.trustedMember.firstName }}
                        {{ group.trustedMember.lastName }}
                    </router-link>
                    <span v-else>-</span>
                </td>
            </tr>
        </NablaTable>
    </div>
</template>

<i18n lang="yaml">
nb:
    andre-viktige-mailer: Andre viktige mailer
    alle: Alle
    kontakt: Kontakt
    undergrupper: Undergrupper
    for-bedriftshenvendelser: For bedriftshenvendelser
    gruppeleder: Gruppeleder
    gruppeledere: gruppeledere
    mail: Mail
    ledermail: Ledermail
    gruppemail: Gruppemail
    tillitsvalgt: Tillitsvalgt
    styret: Styret
    hele-styret: Hele Styret
    leder: Leder
    nestleder: Nestleder
    faddersjef/sektretær: Faddersjef/Sektretær
    økonomiansvarlig: Økonomiansvarlig
    koordinator: Koordinator
    bedkomsjef: Bedkomsjef
    arrangementsjef: Arrangementsjef
    bnokonomi: BN-Økonomi
    ansvarlig: ansvarlig

en:
    andre-viktige-mailer: Other important mails
    alle: All
    kontakt: Contact
    undergrupper: Subgroups
    for-bedriftshenvendelser: For bedriftshenvendelser
    gruppeleder: Group leader
    gruppeledere: group leaders
    mail: Mail
    ledermail: Leadermail
    gruppemail: Group mail
    tillitsvalgt: Trusted member
    styret: The Board
    hele-styret: The whole board
    leder: Leader
    nestleder: Assistant leader
    faddersjef/sektretær: Chief of buddies and secretary
    økonomiansvarlig: Financal manager
    koordinator: Coordinator
    bedkomsjef: Business manager
    arrangementsjef: Event manager
    bnokonomi: BN-Economy
    ansvarlig: responsible
</i18n>
