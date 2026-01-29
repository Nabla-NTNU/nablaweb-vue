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
                class="rounded-full border-2 border-transparent bg-primary px-4 py-1 text-title-5 duration-200 hover:border-primary-light hover:bg-primary-dark hover:text-secondary-light m:text-title-4"
                to="/for-bedrifter"
            >
                {{ t("for-bedriftshenvendelser") }}
            </router-link>
        </div>
    </div>

    <div class="m-8 grid grid-cols-3 gap-4">
        <div class="mb-3 text-title-4 font-semibold">
            <h2>{{ t("kontaktinfo-til-styret") }}</h2>
        </div>
        <div class="..."></div>
        <div class="mb-3 text-title-4 font-semibold">
            Nabla - {{ t("kontakt") }}
        </div>
        <div class="w-250 col-span-2 flex">
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

        <div class="...">
            <p>
                Har du en superkul idé til noe nytt vi kan gjøre i Nabla? Savner
                du noe, eller har du en tilbakemelding til oss som drifter
                linjeforeningen? Da tar Styret gjerne imot tilbakemelding på
                mail til nabla [Ætt] nabla.no. Styret ønsker gjerne hjelp fra
                dere alle til å gjøre Nabla til en best mulig linjeforening. Vi
                ønsker derfor alle mulige tilbakemeldinger dersom du har noe på
                hjertet, enten det er ris eller ros. Det kan være alt fra et
                ønskearrangement for Arrkom til eventuelle problem eller
                forbedringer i Nabla. Dersom saken angår noen i Styret, kan du
                gjerne sende mail til PostKom gjennom postkom [Ætt] nabla.no som
                et mellomledd for klager til Styret. Alle tilbakemeldinger og
                forslag vil gjennomgås på styremøter og behandles av Styret.
            </p>
            <p>
                Det er også mulig å sende en mail til de tillitsvalgte ved
                instituttene. ITV-ene tar imot blant annet forslag til faglige
                eller studierelaterte endringer. De vil bringe forslagene dine
                videre til ledelsen. Husk at du også kan kontakte ITV-ene ved
                utfordringer med emner og undervisere.
            </p>
        </div>
    </div>

    <h1 class="mx-12 my-8 text-title-4 font-semibold">
        {{ t("undergrupper") }}
    </h1>
    <div class="flex-rows mx-12 my-10 justify-center">
        <div
            v-for="group in groups.filter((g) => g.id !== 'styret')"
            :key="group.id"
        >
            <h2 class="mb-3 text-title-4 font-semibold">
                <router-link
                    :to="`/undergrupper/${group.id}`"
                    class="text-primary hover:underline"
                >
                    {{ group.name }}
                </router-link>
            </h2>
            <h2 class="mb-3 text-title-5 font-semibold">
                {{ group.mailList || "-" }}
            </h2>

            <NablaTable :column-titles="['Stilling', 'Navn', 'Mail']">
                <tr>
                    <td class="left-0 bg-inherit border-r sticky z-10">
                        {{ t("leder") }}
                    </td>

                    <td class="w-1/2">
                        <span v-if="group.leader">
                            <router-link
                                :to="`/profile/${group.leader.username}`"
                                class="text-primary-600 hover:underline"
                            >
                                {{ group.leader.firstName }}
                                {{ group.leader.lastName }}
                            </router-link>
                        </span>
                        <span v-else>-</span>
                    </td>
                    <td class="w-1/4">{{ group.leaderMail || "-" }}</td>
                </tr>

                <tr>
                    <td>{{ t("tillitsvalgt") }}</td>
                    <td v-if="group.trustedMember">
                        <router-link
                            :to="`/profile/${group.trustedMember.username}`"
                            class="text-primary-600 hover:underline"
                        >
                            {{ group.trustedMember.firstName }}
                            {{ group.trustedMember.lastName }}
                        </router-link>
                    </td>
                    <td v-else>-</td>
                    <td v-if="group.trustedMember">
                        {{ group.trustedMember.ntnuEmail }}
                    </td>
                    <td v-else>-</td>
                </tr>
            </NablaTable>
        </div>
    </div>
</template>

<i18n lang="yaml">
nb:
    kontakt: Kontakt
    undergrupper: Undergrupper
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
    undergrupper: Subgroups
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
