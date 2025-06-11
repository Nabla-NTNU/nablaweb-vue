<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    const { t } = useI18n()
</script>

<template>
    <footer class="bg-primary text-gray-25 p-6">
        <div class="mx-auto flex w-240 justify-between items-start flex-wrap">
            <!-- Address Section -->
            <div class="m-3 font-lato text-m">
                <h4 class="text-l mb-4"> {{ t('adresse') }} </h4>
                <p>Linjeforeningen Nabla<br>Kjemiblokk 2, Realfagsbygget<br>Sæm Sælands vei 10, NTNU<br>7034 Trondheim, Norway</p>
            </div>

            <!-- Social Media Section -->
            <div class="m-3 font-lato text-m">
                <h4 class="text-l mb-4"> {{ t('følg-oss') }}</h4>
                <ul>
                    <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
                    <li><a href="https://twitter.com" target="_blank">Twitter</a></li>
                    <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
                    <li><a href="https://linkedin.com" target="_blank">LinkedIn</a></li>
                </ul>
            </div>

            <!-- Sponsor Logo Section -->
            <div class="m-3 font-lato text-m">
                <h4 class="text-l mb-4"> {{ t('sponset-av') }} </h4>
                <div class="flex items-center">
                    <a href="http://www.tekna.no/"><img class="mr-4 h-14" src="https://www.tekna.no/Static/Web2020/img/icons/tekna-logo-150-jubileum.png" alt="Tekna"></a>
                    <a class="ml-4 inline-block focus-visible:rounded-[3px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-blueberry-600" href="http://www.sit.no/"><span class="sr-only"></span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 36.67" class="w-[90px]"><g transform="translate(-1445.384 -680.572)"><path fill="#FCFCFD" d="M1495.6,698.02c0.01,2.3,2.03,2.86,6.13,3.69c6.01,1.16,8.94,2.61,8.95,6.99   c0.02,5.05-3.57,8.49-9.24,8.51l-1.69,0.01c-5.56,0.02-9.17-3.4-9.17-5.64c0.04-0.18,0.16-0.33,0.34-0.39l3.25-1.64   c0.09-0.05,0.18-0.09,0.28-0.11c0.17,0,0.28,0.17,0.45,0.34c1.35,1.74,2.37,3.14,4.84,3.13l1.69-0.01   c2.58-0.01,4.26-1.47,4.26-3.27c-0.01-2.41-2.48-2.69-7.15-3.63c-5.34-1.05-7.87-2.67-7.89-6.88c-0.02-4.89,3.62-8.27,9.02-8.28   l1.69-0.01c5.56-0.02,9.17,3.4,9.17,5.64c0,0.17-0.11,0.28-0.34,0.39l-3.25,1.64c-0.11,0.05-0.22,0.09-0.34,0.11   c-0.17,0-0.22-0.17-0.39-0.34c-1.41-1.79-2.43-3.14-4.84-3.13l-1.69,0.01C1497.04,695.15,1495.58,696.23,1495.6,698.02"></path><path fill="#FCFCFD" d="M1516.9,686.83c-1.66,0.05-3.05-1.26-3.1-2.92c0-0.05,0-0.1,0-0.16   c-0.01-1.71,1.37-3.09,3.08-3.1c1.71-0.01,3.09,1.37,3.1,3.08C1519.98,685.44,1518.6,686.83,1516.9,686.83 M1518.96,716.59   l-3.93,0.01c-0.39,0-0.56-0.17-0.56-0.56l-0.08-24.15c0-0.39,0.17-0.56,0.56-0.56l3.93-0.01c0.39,0,0.56,0.17,0.56,0.56l0.08,24.15   C1519.52,716.42,1519.35,716.59,1518.96,716.59"></path><path fill="#FCFCFD" d="M1536.32,717.05c-5.11-0.12-9.17-4.35-9.07-9.46l-0.04-11.23c0-0.39-0.17-0.56-0.56-0.56   l-3.09,0.01c-0.39,0-0.56-0.17-0.56-0.56l0.11-1.97l6.44-6.87l0.39-0.17l1.74-0.01c0.39,0,0.56,0.17,0.56,0.56l0.01,3.93   c0,0.39,0.17,0.56,0.56,0.56l3.93-0.01c0.39,0,0.56,0.17,0.56,0.56l0.01,3.37c0,0.39-0.17,0.56-0.56,0.56l-3.93,0.01   c-0.39,0-0.56,0.17-0.56,0.56l0.04,11.23c0.01,1.2,0.46,2.35,1.25,3.25c0.51,0.62,1.69,1.01,3.38,1.73   c0.28,0.11,0.45,0.22,0.45,0.56l0.01,3.37C1537.38,716.98,1537.1,717.04,1536.32,717.05"></path><path fill="#FCFCFD" d="M1458.22,696.02c0,0-1.76-0.09-1.88-1.29s1.14-2.45,3.38-2.57c1.78-0.02,3.56-0.15,5.32-0.38   c0.99-0.35,1.61-1.34,1.49-2.39c-0.13-1.32-2.05-2.76-4.18-3.07c-1.51-0.22-7.54-1.71-13.37,8.18c-1.51,2.58-2.28,2.27-2.84,2.1   c-0.14-0.04-1.12-0.5-0.62-2.28c1.16-4.21,3.71-7.9,7.25-10.46c5.04-3.49,11.47-4.26,17.19-2.06c5.69,2.01,9.18,6.71,9.12,9.73   c-0.05,2.41-1.61,4.38-7.16,4.42C1466.19,696,1458.23,696.01,1458.22,696.02"></path><path fill="#FCFCFD" d="M1467.91,701.79c0,0,1.76,0.09,1.88,1.29s-1.14,2.46-3.38,2.57c-1.78,0.02-3.56,0.15-5.32,0.38   c-0.99,0.36-1.61,1.34-1.5,2.39c0.13,1.33,2.05,2.76,4.19,3.07c1.51,0.22,7.54,1.71,13.37-8.18c1.52-2.57,2.28-2.26,2.84-2.1   c0.15,0.05,1.13,0.5,0.63,2.28c-1.16,4.21-3.72,7.9-7.25,10.46c-5.04,3.49-11.47,4.26-17.19,2.06c-5.69-2.01-9.18-6.71-9.12-9.73   c0.05-2.42,1.61-4.38,7.16-4.42C1459.94,701.82,1467.9,701.8,1467.91,701.79"></path></g></svg></a>
                </div>
            </div>
        </div>
    </footer>
</template>

<i18n lang="yaml">
    nb:
        adresse: Adresse
        følg-oss: Følg oss!
        sponset-av: Sponset av
    en: 
        adresse: Address
        følg-oss: Give us a follow!
        sponset-av: "Proudly sponsored by:"
</i18n>