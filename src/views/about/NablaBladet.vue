<script setup lang="ts">
    

</script>

<template>

    <div class="nablad-arkiv p-6">
        <!-- For hvert år-->
        <div v-for="årgruppe in utgivelsesår":key= "årgruppe.år" class="år-gruppe mb-12"> 
            <h2>
                {{ årgruppe.år }}
            </h2>
            <!-- Grid av årets nablader-->
            <div :class="['nablad-grid', årgruppe.isRecent ? 'recent' : 'older']">
                <!-- Hvert individuelle nablad-->
                <div v-for="blad in årgruppe.nablader" :key="blad.id" class = "nablad-card cursor-pointer text-center hover:scale-105 transition-transform duration-200" >
                    <!-- Forsiden til et nablad er klikkbart-->
                     <a :href="blad.pdf" target="_blank" rel="noopener">
                        <img :src="blad.cover" :alt="blad.title" class="w-full rounded shadow-md"/>
                     </a>
                    <p class="underoverskrift">
                        {{ blad.underoverskrift }}
                    </p>
                </div>
            </div>
        </div> 

        

    </div>



</template>

<i18n lang="yaml">
nb: 

en:

nn:

</i18n>