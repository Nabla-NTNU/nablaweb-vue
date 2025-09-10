<script setup lang="ts">
    import AboutSideBar from "@/components/AboutSideBar.vue"
    import { useI18n } from "vue-i18n"
    const { t } = useI18n()

    const councillors = [
        {
            position: "Leder",
            email: "nabla@nabla.no",
            photoURL:
                "https://blenderartists.org/uploads/default/original/4X/b/9/c/b9c874ce7cadfd60d7d53802594744e15df04d08.jpg",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            user: {
                firstName: "Håkon",
                lastName: "Olsen",
            },
        },
        {
            position: "Nestleder",
            email: "nestleder@nabla.no",
            photoURL:
                "https://mondoshop.com/cdn/shop/articles/Luke_Square_grande_f74b6122-4920-40e1-a783-e099ce443651.jpg?v=1581592455",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            user: {
                firstName: "Sigve",
                lastName: "Barlaug",
            },
        },
        {
            position: "Økonomiansvarlig",
            email: "okans@nabla.no",
            photoURL:
                "https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/2803/square_thumb%403x.jpg",
            text: "Lorem Ipsum is simply dummy text.",
            user: {
                firstName: "Juliane",
                lastName: "Mundal",
            },
        },
        {
            position: "Koordinator",
            email: "koordinator@nabla.no",
            photoURL:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBbGPxYAhVP3gJtB2ZTN0JySwYhr5c9z4umg&s",
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            user: {
                firstName: "Ole Marius",
                lastName: "Green",
            },
        },
    ]
</script>

<template>
    <div class="flex-row">
        <div class="flex-1">
            <AboutSideBar> </AboutSideBar>
        </div>
        <div class="m-4 max-w-[1200px] flex-grow">
            <h1 class="text-title-1 font-semibold tracking-tight">
                {{ t("linjeforeningen-nabla") }}
            </h1>
            <!-- All this should be editable in DB or by approveds members -->
            <p>
                Nabla er linjeforeningen for sivilingeniørprogrammet Fysikk og
                matematikk ved NTNU. Du kan lese mer om studiet på NTNU sine
                nettsider. På denne nettsiden finner du informasjon om studiet,
                linjeforeningen, og hva som foregår. Ta gjerne turen innom
                nablakontoret i kontortida for kaffe, vafler og en hyggelig
                prat. Vi selger også kompendier.
            </p>
            <p></p>

            <h2 class="text-title-3 font-semibold tracking-tight">
                {{ t("styret") }}
            </h2>
            <h3 class="mb-4 text-subtitle-2 font-semibold tracking-tight">
                <a
                    href="mailto://styret@nabla.no"
                    class="duration-300 hover:text-secondary"
                    >styret@nabla.no</a
                >
            </h3>
            Etter SKE, er Nablastyret linjeforeningens høyeste organ. Styret har
            ukentlige møter, og her har du som komponent møterett. Om du vil
            komme innom på et av møtene våre, ta kontakt med et av
            styremedlemmene, eller hele styret!

            <p>Styremøter tirsdager kl.08:15-10:00 i R41</p>

            <div
                v-for="(councillor, index) in councillors"
                :key="councillor.position"
                class="flex flex-col items-center gap-6 text-center m:flex-row m:text-left"
                :class="{ 'm:flex-row-reverse m:text-right': index % 2 === 1 }"
            >
                <div class="w-full flex-shrink-0 m:w-auto">
                    <img
                        :src="councillor.photoURL"
                        class="w-full max-w-[360px] rounded-xl object-cover"
                    />
                </div>

                <!-- Text and info -->
                <div class="flex-1">
                    <h3 class="font-zilla text-subtitle-3 tracking-tight">
                        {{ councillor.user.firstName }}
                        {{ councillor.user.lastName }}
                    </h3>
                    <div class="mb-4 font-semibold tracking-tight">
                        {{ councillor.position }},
                        <a
                            class="duration-300 hover:text-secondary"
                            :href="'mailto://' + councillor.email"
                        >
                            {{ councillor.email }}
                        </a>
                    </div>
                    <div clas="m-2">
                        {{ councillor.text }}
                    </div>
                </div>
            </div>
        </div>
        <img
            src="https://nabla.no/media/uploads/com_pictures/HU5A1682.jpg"
            class="w-full max-w-[1080px]"
        />
    </div>
</template>

<i18n lang="yaml">
nb:
    linjeforeningen-nabla: "Linjeforeningen Nabla"
    styret: "Styret"
en:
    linjeforeningen-nabla: "The Nabla Student Society"
    styret: "The Council"
</i18n>
