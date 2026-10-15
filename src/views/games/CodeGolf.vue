<script setup lang="ts">
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()
</script>

<template>
    <div class="mx-12 my-4">
        <h1 class="grow text-title-3 font-semibold tracking-tight">
            Webkoms Godegolf
        </h1>
        {{ t("introtekst") }}
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
