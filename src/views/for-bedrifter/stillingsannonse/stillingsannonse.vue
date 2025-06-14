<script setup>
    import "../../../style.css"
    import "../../../assets/fonts/fonts.css"
</script>

<template>
    <div class="flex w-full flex-grow flex-col">
        <div
            class="sm:px-6 lg:px-8 mx-auto flex w-full max-w-[1200px] flex-col px-4 py-10"
        >
            <article>
                <h1
                    id="stillingsutlysninger"
                    class="group mb-4 flex items-center text-title-2 font-semibold tracking-tight"
                >
                    Hjem
                </h1>
                <div class="w-full max-w-240 space-y-4">
                    <p class="break-words py-1 text-l">
                        Ta kontakt med oss dersom dere har en relevant
                        stillingsutlysning dere ønsker å legge ut på siden.
                    </p>
                    <p class="break-words py-1 text-l">
                        <strong>Bedriftskontakten</strong>:
                        <a
                            class="font-medium underline transition-colors duration-200 after:content-['_↗'] hover:text-blue-500"
                            node="[object Object]"
                            href="mailto:bedkom@nabla.no"
                        >
                            bedkom(at)nabla.no
                        </a>
                    </p>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StillingsannonseView",
    }
</script>
