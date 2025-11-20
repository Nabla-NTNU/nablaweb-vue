<script setup lang="ts">
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { useGroups } from "@/composables/useNablaGroup"

    const { groups } = useGroups()

    import NablaTable from "@/components/general/NablaTable.vue"
</script>

<template>
    <div class="mx-12 flex flex-col m:my-12 m:flex-row">
        <div>
            <h1 class="text-title-3 font-semibold">
                {{ t("kontakt") }}
            </h1>
        </div>

        <div class="m:grow">
            <br class="m:hidden" />
            <!--Flytter knappen til høyre side-->
        </div>

        <div>
            <router-link
                class="rounded-full border-2 border-transparent bg-primary px-4 py-1 text-title-5 duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light m:text-title-4"
                to="/for-bedrifter"
            >
                {{ t("for-bedriftshenvendelser") }}
            </router-link>
        </div>
    </div>
    <div class="mx-12 my-12 flex"></div>

    <div class="flex justify-center">
        <h2 class="mb-3 text-title-4 font-semibold">
            {{ t("kontaktinfo-til-styret") }}
        </h2>
    </div>
    <div class="w-250 flex justify-center">
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

            <!--       Gjelder kun når det er jubileum
            <tr> 
                <td>Jubileumssjef</td>
                <td>-</td>
                <td>jubileumssjef@nabla.no</td>
            </tr>
-->
        </NablaTable>
    </div>

    <div class="mx-120 my-6">
        <div v-for="group in groups" :key="group.id">
            <h2 class="mb-3 text-title-4 font-semibold">
                <router-link
                    :to="`/undergrupper/${group.id}`"
                    class="text-primary hover:underline"
                >
                    {{ group.name }}
                </router-link>
            </h2>
            <div v-if="group.mailList">
                <h3 class="text-title-5 font-semibold">
                    {{ t("gruppemail") }}: {{ group.mailList }}
                </h3>
            </div>
            <NablaTable :column-titles="['Stilling', 'Navn', 'Mail']">
                <div v-if="group.leaderMail || group.mailList">
                    <tr>
                        <td>Leder</td>
                        <td>Tillitsvalgt</td>
                    </tr>

                    <div v-if="group.leaderMail">
                        {{ t("ledermail") }}:
                        {{ group.leaderMail }}
                    </div>

                    <div v-if="group.trustedMember">
                        {{ t("tillitsvalgt") }}:
                        {{ group.trustedMember?.user.firstName }}
                        {{ group.trustedMember?.user.lastName }}
                        <br />
                        {{ t("mail") }}:
                        {{ group.trustedMember?.user.username }}@student.ntnu.no
                    </div>
                </div>
            </NablaTable>
        </div>
    </div>
</template>

<i18n lang="yaml">
nb:
    kontakt: Kontakt
    for-bedriftshenvendelser: For bedriftshenvendelser
    gruppeleder: Gruppeleder
    mail: Mail
    ledermail: Ledermail
    gruppemail: Gruppemail
    tillitsvalgt: Tillitsvalgt
    kontaktinfo-til-styret: Kontaktinfo til styret
    hele-styret: Hele Styret
    leder: Leder
    nestleder: Nestleder
    faddersjef/sektretær: Faddersjef/Sektretær
    økonomiansvarlig: Økonomiansvarlig
    koordinator: Koordinator
    bedkomsjef: Bedkomsjef
    arrangementsjef: Arrangementsjef
en:
    kontakt: Contact
    for-bedriftshenvendelser: For bedriftshenvendelser
    gruppeleder: Group leader
    mail: Mail
    ledermail: Leadermail
    gruppemail: Group mail
    tillitsvalgt: Trusted member
    kontaktinfo-til-styret: Contact info for the board
    hele-styret: The whole board
    leder: The leader
    nestleder: Assistant leader
    faddersjef/sektretær: Chief of buddies and secretary
    økonomiansvarlig: Financal manager
    koordinator: Coordinator
    bedkomsjef: Business manager
    arrangementsjef: Event manager
</i18n>
