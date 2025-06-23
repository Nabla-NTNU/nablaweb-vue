<script setup lang="ts">
    import { ref, Ref } from "vue"
    import { useRoute } from "vue-router"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    import { supabase } from "@/lib/supabaseClient"
    import { useGroup } from "@/composables/useNablaGroup"
    import { useGroupImageUpload } from "@/composables/useImageUpload"

    import ImagePicker from "@/components/group-page/ImagePicker.vue"
    import MarkdownField from "@/components/group-page/MarkdownField.vue"
    import MemberAdminTable from "@/components/group-page/MemberAdminTable.vue"
    import UserPicker from "@/components/group-page/UserPicker.vue"
    import { GroupMember, NablaUser } from "@/lib/types/frontend.types"

    const route = useRoute()
    const groupID = route.params.id as string

    // Both have loading and error refs thar can be presented to user
    const { group, refreshGroupMembers } = useGroup(groupID)
    const { upload } = useGroupImageUpload(groupID)

    // Functions below should probably be part of a composable, not this view.
    async function handleSaveImage(newImage: string) {
        try {
            const { error } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_groups")
                .update({ group_photo: newImage })
                .eq("id", groupID)

            if (error) throw error
            else group.value.groupPhoto = new URL(newImage)
        } catch (error) {
            console.error("[Nabla Group Admin] Error saving image URL:", error)
        }
    }

    async function handleSaveAboutText(newAboutText: string) {
        try {
            const { error } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_groups")
                .update({ about: newAboutText })
                .eq("id", groupID)

            if (error) throw error
            else group.value.about = newAboutText
        } catch (error) {
            console.error("[Nabla Group Admin] Error saving about text:", error)
        }
    }

    async function handleSaveNewLeader(newLeaderUsername: string) {
        try {
            const { error } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_groups")
                .update({ leader: newLeaderUsername })
                .eq("id", groupID)

            if (error) throw error
            else group.value.leader = { user: { username: newLeaderUsername } }
        } catch (error) {
            console.error("[Nabla Group Admin] Error saving new leader:", error)
        }
    }

    async function handleSaveMemberTable(localMemberTable: GroupMember[]) {
        const offset = Math.floor(Math.random() * 2 ** 30) // crusty but funny solution to ordering members with unique orders in a single request. Not actually needed, but there's a bug throwing an error somewhere without this that I can't track down
        const updates = localMemberTable.map((member, index) => ({
            group: groupID,
            user: member.user.username,
            member_role: member.role ? (member.role as string) : "",
            order: offset + index,
            is_active: member.isActive == undefined ? true : member.isActive,
        }))
        try {
            const { error } = await supabase
                .schema("nablaweb_vue")
                .from("nabla_group_members")
                .upsert(updates, { onConflict: "group, user" })

            if (error) throw error
            refreshGroupMembers()
        } catch (error) {
            console.error("Error saving membership updates:", error)
        }
    }

    // const searchString = ref("")
    const foundUsers: Ref<NablaUser[]> = ref([])

    async function searchForUsers(newMemberSearchString: string) {
        const alreadyMembers = new Set(
            group.value.members?.map((m) => m.user.username),
        )

        const { data, error } = await supabase
            .schema("nablaweb_vue")
            .from("nabla_users")
            .select(
                `
                username,
                firstName: first_name,
                lastName: last_name,
                class
            `,
            )
            .or(
                `first_name_last_name_username.ilike.%${newMemberSearchString}%`,
            )

        if (error) {
            console.error("Error searching for members:", error)
        } else {
            foundUsers.value = data.filter(
                (u) => !alreadyMembers.has(u.username),
            )
        }
    }
</script>

<template>
    <div v-if="group" class="flex w-full flex-grow flex-col">
        <!-- <img class = "object-fit: w-full object-cover" :src='nablaGroup.image' alt="Flotte folk"> -->
        <div
            class="sm:px-6 lg:px-8 mx-auto flex w-full max-w-[1200px] px-4 py-10"
        >
            <div class="flex-1 pr-6">
                <div class="mb-4 flex flex-row">
                    <h1 class="grow text-title-2 font-semibold tracking-tight">
                        {{ t("adminsida-for") }} {{ group.name }}
                    </h1>
                    <RouterLink
                        :to="`/undergrupper/${groupID}`"
                        class="m-auto items-center text-nowrap rounded-lg bg-primary px-4 py-2 text-center font-semibold text-white transition-all duration-300"
                        style="white-space: pre-line"
                    >
                        {{ t("gå-tilbake") }}
                    </RouterLink>
                </div>

                <h2
                    class="group mb-4 flex items-center text-subtitle-2 font-semibold tracking-tight"
                >
                    {{ t("endre-gruppebilde") }}
                </h2>
                {{ t("endre-gruppebilde-tekst") }}

                <ImagePicker
                    :image-url="group.groupPhoto ? group.groupPhoto.href : ''"
                    :upload-image="upload"
                    @save-image="handleSaveImage"
                />

                <br />

                <h2
                    class="group mb-4 flex items-center text-subtitle-2 font-semibold tracking-tight"
                >
                    {{ t("tekst-om-gruppen") }}:
                </h2>
                {{ t("tekst-om-gruppen-tekst") }}

                <br />
                <br />

                <MarkdownField
                    :text="group.about ? group.about : ''"
                    @save-text="handleSaveAboutText"
                />

                <h2
                    class="group mb-4 flex items-center text-subtitle-2 font-semibold tracking-tight"
                >
                    {{ t("medlemsliste") }}:
                </h2>

                <MemberAdminTable
                    :members="group.members ? group.members : []"
                    :not-removable="group.leader ? [group.leader] : []"
                    :found-users="foundUsers"
                    @save-member-table="handleSaveMemberTable"
                    @search-for-users="searchForUsers"
                />
                <br />
                <br />

                <h2
                    class="group mb-4 flex items-center text-subtitle-2 font-semibold tracking-tight"
                >
                    {{ t("endre-leder") }}:
                </h2>
                {{ t("faresone") }}
                <br />
                <UserPicker
                    v-if="group"
                    :current="group.leader"
                    :members="group.members"
                    @save-chosen-username="handleSaveNewLeader"
                />
                <br />
                <br />

                <!-- Incredibly ugly tbh - there's definetly a neater way of doing this -->
                <RouterLink
                    :to="`/undergrupper/${groupID}`"
                    class="rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-all duration-300"
                >
                    &lt;-
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
nb:
    adminsida-for: Adminsida for
    gå-tilbake: "Gå \n tilbake"
    endre-gruppebilde: Endre gruppebilde
    endre-gruppebilde-tekst: >
        Disse kan enten peke mot et bilde ute på nettet, eller lastes opp. Dersom dere laster opp - vi fastsetter
        maks ____ Mb per bilde. Det er ingen fast størrelse på bildet. Gjerne sjekk at det ser presentabelt på alle
        størrelser skjermer, fra mobiltelefon til storskjerm.
    tekst-om-gruppen: Tekst om undergruppen
    tekst-om-gruppen-tekst: >
        Her er det nok best å være short & sweet, men dere har tilgang til markdown og HTML om noen har fryktelig
        lyst ;))
    medlemsliste: Medlemsliste
    endre-leder: Endre gruppeleder
    faresone: Fare! Ikke reversiblet!
en:
    adminsida-for: Admin page for
    gå-tilbake: "Go \n back"
    endre-gruppebilde: Change group photo
    endre-gruppebilde-tekst: >
        You can choose a web-link, or upload a picture to our servers. If you're uploading - we enforce a maxomum of
        ____ Mb per image. There's no aspect ratio, however, so please make sure it looks alright on both large and
        smaller screens.
    tekst-om-gruppen: About text
    tekst-om-gruppen-tekst: >
        You'll likely be best off being short and sweet, however you have access to all of markdown and HTML if you
        so wish ;))
    medlemsliste: Member list
    endre-leder: Change group leader
    faresone: Danger zone! Non-reversible!
</i18n>
