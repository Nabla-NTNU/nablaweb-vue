<script setup lang="ts">
import '../../style.css'
import '../../assets/fonts/fonts.css';

import Button from '../../components/Button_test.vue';
import Header from '../../components/Header.vue';
import MainContent from '../../components/MainContent.vue';
import Footer from '../../components/Footer.vue';
</script>

<template>
    <div class="flex flex-grow flex-col">
      <div class="mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-8 max-w-[1200px] py-10">
        <article>
          <h1 id="stillingsutlysninger" class="group flex items-center font-semibold tracking-tight text-title-2 mb-4">
            Ny student?
          </h1>
          <div class="w-full max-w-240 space-y-4">
            <p class="break-words py-1 text-l">
              Fyll inn tekst her.
            </p>
          </div>
        </article>
      </div>
    </div>
</template>