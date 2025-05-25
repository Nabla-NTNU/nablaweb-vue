<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter, RouterLink } from 'vue-router';

    import { supabase } from '@/lib/supabaseClient';
    import { useAuth } from '@/composables/useAuth';
    import { getGroupDetails } from '@/lib/db/db';
    import { useGroup } from '@/composables/useNablaGroup'
    import { useGroupImageUpload } from '@/composables/useImageUpload';
    
    import ImagePicker from '@/components/group-page/image-picker.vue'
    import MarkdownField from '@/components/group-page/markdown-field.vue'
    import MemberAdminTable from '@/components/group-page/member-admin-table.vue'
    
    
    const route = useRoute()
    const router = useRouter()

    const groupURL = route.params.id;

    const { uploading, error, publicURL, upload } = useGroupImageUpload(groupURL)

    const { user, isLoading, isAuthenticated } = useAuth()


    const nablaGroup = ref({}) // should be deleted I think
    const groupAboutText = ref("")
    const groupImageURL = ref("")
    const groupMembers = ref([])
    const groupLeader = ref("")
    const searchString = ref("")
    const foundUsers = ref([])
    const newLeaderUsername = ref("")

    onMounted(async () => {
        nablaGroup.value = await useGroup(groupURL)
        if (nablaGroup.value == null) {
            router.push('/404')
        }
        groupAboutText.value = nablaGroup.value.about
        groupImageURL.value = nablaGroup.value.groupImage
        groupMembers.value = nablaGroup.value.groupMembers
        groupLeader.value = 'alexamm'//nablaGroup.value.groupLeader
        searchForUsers("")
    })

    async function handleSaveImageURL(localImageURL) {
        const {data, error} = await supabase
            .from('nabla_group_pages')
            .update({group_image: localImageURL})
            .eq('group', groupURL)
        if (error) {
            console.error('Error saving image URL:', error)
        } else {
            groupImageURL.value = localImageURL
        }
    }

    async function handleSaveAboutText(localAboutText) {
        const {data, error} = await supabase
            .from('nabla_group_pages')
            .update({about: localAboutText})
            .eq('group', groupURL)
        if (error) {
            console.error('Error saving about text:', error)
        } else {
            groupAboutText.value = localAboutText
        }
    }

    async function handleSaveMemberTable(localMemberTable) {
        const offset = Math.floor(Math.random() * (2**30)) // crusty but funny solution to ordering members with unique orders in a single request. Not actually needed, but there's a bug throwing an error somewhere without this that I can't track down
        const updates = localMemberTable.map((member, index) => ({
            group:       groupURL,
            user:        member.username,
            member_role: member.role,
            order:       offset + index,
            is_active:   member.isActive
        }));
        
        const {data, error} = await supabase
            .from('nabla_group_members')
            .upsert(updates)
        if (error) {
            console.error('Error saving membership updates:', error)
        } else {
            nablaGroup.value = await useGroup(groupURL)
            if (nablaGroup.value == null) {
                router.push('/404')
            }
            groupMembers.value = nablaGroup.value.groupMembers
        }
    }

    async function searchForUsers(newMemberSearchString) {
        const alreadyMembers = new Set(groupMembers.value.map(m => m.username))

        const {data, error} = await supabase
            .from('nabla_users')
            .select()
            .or(`first_name_last_name_username.ilike.%${newMemberSearchString}%`)
        if (error) {
            console.error('Error searching for members:', error)
        } else {
            foundUsers.value = data.filter(u => !alreadyMembers.has(u.username))
            console.log(data)
        }
    }

</script>

<template>
    <div class="flex w-full flex-grow flex-col">
        <img class = "object-fit: w-full object-cover" :src='groupImageURL' alt="Flotte folk">
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

                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Endre gruppebilde
                </h2>
                Disse kan enten peke mot et bilde ute på nettet, eller lastes opp. Dersom dere laster opp - vi fastsetter maks ____ Mb per bilde. Det er ingen fast størrelse på bildet. Gjerne sjekk at det ser presentabelt på alle størrelser skjermer, fra mobiltelefon til storskjerm.

                <ImagePicker :imageURL="groupImageURL" :uploadImage="upload" @saveImageURL="handleSaveImageURL"/>
                
                <br>

                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Tekst om undergruppen:
                </h2>
                Her er det nok best å være short & sweet, men dere har tilgang til markdown og HTML om noen har fryktelig lyst ;))
                
                <br>
                <br>

                <MarkdownField :text="groupAboutText" @saveText="handleSaveAboutText"/>
                
                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Medlemsliste:
                </h2>

                <MemberAdminTable
                    :members="groupMembers"
                    :notRemovable="groupLeader"
                    @saveMemberTable="handleSaveMemberTable"
                    v-model:searchString="searchString"
                    @searchForUsers="searchForUsers"
                    :foundUsers="foundUsers"
                />
                <br>
                <br>
                
                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Endre gruppeleder:
                </h2>
                Faresone! Ikke reversibelt!
                <br>
                <div class="md-4 flex">
                    <input
                        list="new-leader"
                        v-model="newLeaderUsername"
                        placeholder="Ny leder?"
                        class="border rounded p-2 w-full m-2"
                    />
                    <datalist id="new-leader" v-if="groupMembers" class="mx-4">
                        <div v-for="nablaUser in groupMembers">
                            <option v-if="nablaUser.username !== groupLeader" :value="nablaUser.username">
                                {{nablaUser.firstName}} {{ nablaUser.lastName }}, {{ nablaUser.class }}, {{ nablaUser.role }}
                            </option>
                        </div>
                    </datalist>
                    <button class="mt-auto px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-secondary disabled:bg-gray" @click="console.error('not implemented')" :disabled="!groupMembers.some(user => user.username === newLeaderUsername)">
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

<!--
TODO: 
    - Split into components in @/components/Group/
        - only leader picker left
        - Consider if a "tillitsvalgt" picker needed?
    - move lib code into composables in @/composables/useGroup.ts and @useAuth.ts
    - set explicit <script setup lang="ts">
    - Instead of creating common tailwind class - create common Vue components
        - Replace buttons and titles
    - Write readme.md for the composables folder
    - Actually protect admin page from non-owners (get RLS going)
    - Add place to edit group name / group logo
    
TODO (non-critical)
    - clean tailwind.config.js
    - actually implement and respect loading & states
    - get ESLing working (eslint-plugin-vue)
    - get pre-commit working (lint-staged)
    - Unit tests :((
    - animation for changing leader would be lit
        - mby a thank you for your service meme gif?
    - Discuss header/footer design (simplify)
-->