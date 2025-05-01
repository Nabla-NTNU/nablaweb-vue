<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter, RouterLink } from 'vue-router';
    import { marked } from 'marked'

    import { getGroupDetails } from '@/lib/db/db';
    import { useAuth } from '@/composables/useAuth';
    import { supabase } from '@/lib/supabaseClient';
    import GroupImagePicker from '@/components/group-page/group-image-picker.vue'

    const route = useRoute();
    const router = useRouter();
    const groupURL = route.params.id;

    const nablaGroup = ref({})
    const mailtoLink = ref("");


    onMounted(async () => {
        nablaGroup.value = await getGroupDetails(groupURL)
        if (nablaGroup.value == null) {
            router.push('/404')
        }
        mailtoLink.value = `mailto:${nablaGroup.value.groupMail}`

    })
  const { user, isLoading, isAuthenticated } = useAuth()

  async function updateText() {
    const {data, error} = await supabase
        .from('nabla_group_pages')
        .update({about: nablaGroup.value.about})
        .eq('group', groupURL)
  }

  async function reset() {
    nablaGroup.value = await getGroupDetails(groupURL)
  }
  
</script>

<template>
    <div class="flex w-full flex-grow flex-col">
        <img class = "object-fit: w-full object-cover" :src='nablaGroup.groupImage' alt="Flotte folk">
        <div class="mx-auto flex w-full px-4 sm:px-6 lg:px-8 max-w-[1200px] py-10">
            <div class="flex-1 pr-6">
                <div class="flex flex-row mb-4">
                    <h1 class="grow font-semibold tracking-tight text-title-2">
                        Adminsida for {{ nablaGroup.groupName }}    
                    </h1>
                    <RouterLink :to="`/for-komponenter/komiteer/${groupURL}`" class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary text-center">
                        Gå <br> tilbake
                    </RouterLink>
                </div>

                <GroupImagePicker v-model:imageURL="nablaGroup.imageURL" @save-url="onSaveURL"/>

                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Endre gruppebilde
                </h2>
                Disse kan enten peke mot et bilde ute på nettet, eller lastes opp. Dersom dere laster opp - vi fastsetter maks ____ Mb per bilde. Det er ingen fast størrelse på bildet. Gjerne sjekk at det ser presentabelt på alle størrelser skjermer, fra mobiltelefon til storskjerm.
                <div class="flex gap-4">
                    <input v-model="nablaGroup.groupImage" placeholder="https://nabla.no/det_kuleste_bildet">
                    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" @click="reset()">
                        Lagre annen URL
                    </button>
                    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary" @click="reset()">
                        Last opp nytt
                        <!-- TODO!!! -->
                    </button>
                </div>
                
                <br>

                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Tekst om undergruppen:
                </h2>
                Her er det nok best å være short & sweet, men dere har tilgang til markdown og HTML om noen har fryktelig lyst ;))
                <br><br>
                <div class="flex flex-row gap-4">
                    <div class="flex flex-col flex-1 gap-2">
                        <textarea class="w-full grow resize-none m-2" v-model="nablaGroup.about" placeholder="NablaKom er hele nablas nabla-komite!"></textarea>
                    </div>
                    <!-- Workaround for tailwind stripping all styling from normal html (smh) -->
                    <article class="flex-1 reset-tailwind" v-html='marked.parse(nablaGroup.about) || " "' v-if='nablaGroup.about'></article>
                </div>
                <div class="flex flex-row gap-2 mb-4">
                    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" @click="updateText()">
                        Lagre ny tekst
                    </button>

                    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary" @click="reset()">
                        Gå tilbake
                    </button>
                </div>
                
                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Medlemsliste:
                </h2>
                <table class="min-w-full table-auto mb-4">
                    <thead>
                        <tr>
                            <th class="w-auto whitespace-nowrap text-left px-2">Navn</th>
                            <th class="whitespace-nowrap px-2">Kull</th>
                            <th class="w-full whitespace-nowrap">Rolle</th>
                            <th class="whitespace-nowrap px-2">Dato</th>
                            <th class="whitespace-nowrap px-2">Flytt</th>
                            <th class="whitespace-nowrap px-2">Ferdig</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="nablaGroup.members" v-for="nablaUser in nablaGroup.members">
                            <td class="text-left whitespace-nowrap px-2">
                                {{  nablaUser.firstName }} {{ nablaUser.lastName }} 
                            </td>
                            <td>
                                kull??
                            </td>
                            <td class="px-2">
                                <input placeholder="Kuleste medlem!"/>
                            </td>
                            <td>
                                00.00.0000
                            </td>
                            <td>
                                <button class="mt-auto px-4 py-2 my-1 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" @click="">
                                    Δ
                                </button>
                                <button class="mt-auto px-4 py-2 my-1 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" @click="">
                                    ∇
                                </button>
                            </td>
                            <td>
                                <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary" @click="">
                                    Slett
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left whitespace-nowrap px-2" colspan="2">
                                <input placeholder="Brukernavn"/>
                            </td>
                            <td class="px-2">
                                <input placeholder="Den nye rollen"/>
                            </td>
                            <td colspan="3">
                                <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary" @click="">
                                    Legg ny medlem inn!
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
        

                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Endre gruppeleder
                </h2>
                Faresone! Ikke reversibelt!
                <br>
                <div class="md-4">
                    <select v-if="nablaGroup.members" class="mx-4">
                        <option v-for="nablaUser in nablaGroup.members">
                            {{nablaUser.username}}
                        </option>
                    </select>
                    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary" @click="reset()">
                        Sett ny leder
                    </button>
                </div>
                <br>
                <br>

                <!-- Incredibly ugly tbh - there's definetly a neater way of doing this -->
                <RouterLink :to="`/for-komponenter/komiteer/${groupURL}`" class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary">
                    <-
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<!-- Identical to the one in LoginCard - why don't we have global styles for kiunds of buttons? -->
<style scoped>
    input {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        border-radius: 5pt;
        box-sizing: border-box;
    }
</style>

<!--
TODO: 
    - Split into components in @/components/Group/
    - move lib code into composables in @/composables/useGroup.ts and @useAuth.ts
        - Seems like we'd use defineProps<>() & defineEmits<>()
    - set explicit <script setup lang="ts">
    - DO NOT USE CSS (do use tailwind)
    - Instead of creating common tailwind class - create common Vue components
    - move markdown rendering out of this script into @/composables/useGroup.ts
        - make sure to _actually_ sanitise it for lé DOM (DOMPurify)
    - Write readme.md for the composables folder
    - Actually protect admin page from non-owners
    - Add place to edit group name / group logo
    
TODO (non-critical)
    - clean tailwind.config.js
    - actually implement and respect loading & states
    - get ESLing working (eslint-plugin-vue)
    - get pre-commit working (lint-staged)
    - get serverside supabase type-generation working
    - Unit tests :((
    - animation for changing leader would be lit
        - mby a thank you for your service meme gif?
    - Discuss header/footer design (simplify)
-->