<script setup>
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';

    import { supabase } from '@/lib/supabaseClient';
    import { useAuth } from '@/composables/useAuth';
    import { useGroup } from '@/composables/useNablaGroup'
    import { useGroupImageUpload } from '@/composables/useImageUpload';
    
    import ImagePicker from '@/components/group-page/image-picker.vue'
    import MarkdownField from '@/components/group-page/markdown-field.vue'
    import MemberAdminTable from '@/components/group-page/member-admin-table.vue'
    import UserPicker from '@/components/group-page/user-picker.vue'
    
    const route = useRoute()
    const groupID = route.params.id


    const { group: nablaGroup, loading, error, refreshGroupMembers} = useGroup(groupID)
    const { uploading, error: uploadError, publicURL, upload } = useGroupImageUpload(groupID)

    async function handleSaveImageURL(localImageURL) {
        const {data, error} = await supabase
            .schema('nablaweb_vue')
            .from('nabla_groups')
            .update({group_image: localImageURL})
            .eq('id', groupID)

        if (error) {
            console.error('Error saving image URL:', error)
            console.error(error)
        } else {
            nablaGroup.value.image = localImageURL
        }
    }

    async function handleSaveAboutText(localAboutText) {
        const {data, error} = await supabase
            .schema('nablaweb_vue')
            .from('nabla_groups')
            .update({about: localAboutText})
            .eq('id', groupID)
        if (error) {
            console.error('Error saving about text:', error)
        } else {
            nablaGroup.value.about = localAboutText
        }
    }

    async function handleSaveNewLeader(newLeaderUsername) {
        const {data, error} = await supabase
            .schema('nablaweb_vue')
            .from('nabla_groups')
            .update({leader: newLeaderUsername})
            .eq('id', groupID)
        if (error) {
            console.error('Error saving new leader text:', error)
        } else {
            nablaGroup.value.leader=newLeaderUsername
        }
    }

    async function handleSaveMemberTable(localMemberTable) {
        const offset = Math.floor(Math.random() * (2**30)) // crusty but funny solution to ordering members with unique orders in a single request. Not actually needed, but there's a bug throwing an error somewhere without this that I can't track down
        const updates = localMemberTable.map((member, index) => ({
            group:          groupID,
            user:           member.username,
            member_role:    member.role? member.role : '',
            order:          offset + index,
            is_active:      member.isActive
        }));
        
        const {error} = await supabase
            .schema('nablaweb_vue')
            .from('nabla_group_members')
            .upsert(updates, {onConflict: ['group', 'user']});

        if (error) {
            console.error('Error saving membership updates:', error)
        } 
        if (!error) {
            refreshGroupMembers()
        }
    }

    const searchString = ref("")
    const foundUsers = ref([])
    async function searchForUsers(newMemberSearchString) {
        const alreadyMembers = new Set(nablaGroup.value.members.map(m => m.username))

        const {data, error} = await supabase
            .schema('nablaweb_vue')
            .from('nabla_users')
            .select()
            .or(`first_name_last_name_username.ilike.%${newMemberSearchString}%`)
        if (error) {
            console.error('Error searching for members:', error)
        } else {
            foundUsers.value = data.filter(u => !alreadyMembers.has(u.username))
        }
    }
</script>

<template>
    <div class="flex w-full flex-grow flex-col" v-if="nablaGroup">
        <!-- <img class = "object-fit: w-full object-cover" :src='nablaGroup.image' alt="Flotte folk"> -->
        <div class="mx-auto flex w-full px-4 sm:px-6 lg:px-8 max-w-[1200px] py-10">
            <div class="flex-1 pr-6">
                
                <div class="flex flex-row mb-4">
                    <h1 class="grow font-semibold tracking-tight text-title-2">
                        Adminsida for {{ nablaGroup.name }}    
                    </h1>
                    <RouterLink :to="`/for-komponenter/komiteer/${groupID}`" class="m-auto items-center text-nowrap px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary text-center">
                        Gå <br> tilbake
                    </RouterLink>
                </div>

                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Endre gruppebilde
                </h2>
                Disse kan enten peke mot et bilde ute på nettet, eller lastes opp. Dersom dere laster opp - vi fastsetter maks ____ Mb per bilde. Det er ingen fast størrelse på bildet. Gjerne sjekk at det ser presentabelt på alle størrelser skjermer, fra mobiltelefon til storskjerm.

                <ImagePicker :imageURL="nablaGroup.image" :uploadImage="upload" @saveImageURL="handleSaveImageURL"/>
                
                <br>

                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Tekst om undergruppen:
                </h2>
                Her er det nok best å være short & sweet, men dere har tilgang til markdown og HTML om noen har fryktelig lyst ;))
                
                <br>
                <br>

                <MarkdownField :text="nablaGroup.about" @saveText="handleSaveAboutText"/>
                
                <h2 class="group flex items-center font-semibold tracking-tight text-subtitle-2 mb-4">
                    Medlemsliste:
                </h2>

                <MemberAdminTable
                    :members="nablaGroup.members"
                    :notRemovable="nablaGroup.leader? [nablaGroup.leader] : []"
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
                <UserPicker v-if="nablaGroup"
                    :current="nablaGroup.leader"
                    :members="nablaGroup.members"
                    @saveChosenUsername="handleSaveNewLeader"
                />
                <br>
                <br>

                <!-- Incredibly ugly tbh - there's definetly a neater way of doing this -->
                <RouterLink :to="`/for-komponenter/komiteer/${groupID}`" class="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-primary">
                    <-
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<!--
TODO:
    - Clean useNablaGroup
    
TODO (non-critical)
    - Fix explicit <script setup lang="ts">
    - Show errors in UI
        - Better try-catch loops in composables pls
        - Button success state
        - Text banner on non-local error
    - Add place to edit group name / group logo
    - choose tilitsvalgt 
    - clean tailwind.config.js
    - actually implement and respect loading & states
    - get ESLing working (eslint-plugin-vue)
    - get pre-commit working (lint-staged)
    - Unit tests :((
    - animation for changing leader would be lit
        - mby a thank you for your service meme gif?
    - Discuss header/footer design (simplify)
-->