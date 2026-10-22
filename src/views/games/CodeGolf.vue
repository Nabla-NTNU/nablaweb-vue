<script setup lang="ts">
    import { useI18n } from "vue-i18n"

    import NablaTable from "@/components/general/NablaTable.vue"

    const { t } = useI18n()
</script>

<template>
    <div class="mx-12 my-4">
        <h1 class="grow text-title-3 font-semibold tracking-tight">
            Webkoms Godegolf
        </h1>
        {{ t("introtekst") }}
    </div>

    <div style="float: right">
        <NablaTable :column-titles="[t('stilling'), t('navn'), t('mail')]">
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

    <div class="mx-10 my-4">
        <div class="relative w-full min-w-[200px]">
            <textarea
                class="py-2.5 font-sans text-sm h-[850px] w-[850px] resize-none rounded-[10px] bg-white px-3 font-normal text-black outline-none transition-none focus:outline-none"
                style="border: 6px solid #004677; box-sizing: border-box"
                placeholder=" "
            ></textarea>
        </div>
    </div>
</template>

<i18n lang="yaml">
nb:
    introtekst: Innenfor programmering finnes det mange ulike "sportsgrener". Noen handler om å løse en oppgave på kortest mulig tid, det vil si tiden det tar å skrive et fungerende program. Andre om å løse en oppgave på kortest mulig kjøretid, det vil si tiden programmet bruker på å løse oppgaven. En tredje kategori handler om å løse en oppgave på færrest mulig tegn; kodegolfing. Ordet kommer av at man i golf forsøker å komme seg rundt banen på færrest mulig slag.
nn:
    introtekst: Innenfor programmering finnes det mange ulike "sportsgrener". Noen handler om å løse en oppgave på kortest mulig tid, det vil si tiden det tar å skrive et fungerende program. Andre om å løse en oppgave på kortest mulig kjøretid, det vil si tiden programmet bruker på å løse oppgaven. En tredje kategori handler om å løse en oppgave på færrest mulig tegn; kodegolfing. Ordet kommer av at man i golf forsøker å komme seg rundt banen på færrest mulig slag.
en:
    introtekst: Innenfor programmering finnes det mange ulike "sportsgrener". Noen handler om å løse en oppgave på kortest mulig tid, det vil si tiden det tar å skrive et fungerende program. Andre om å løse en oppgave på kortest mulig kjøretid, det vil si tiden programmet bruker på å løse oppgaven. En tredje kategori handler om å løse en oppgave på færrest mulig tegn; kodegolfing. Ordet kommer av at man i golf forsøker å komme seg rundt banen på færrest mulig slag.
</i18n>
