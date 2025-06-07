# Composables
Idiomatisk Vue bruker det som heter [Composables APIet](https://vuejs.org/guide/reusability/composables) for å hente inn data før det settes inn i View'et. Her er det tre funksjoner som brukes ofte:

Filnavnkonvensjonen er også idiomatisk.

### `ref()`
Om noen er skjent med react eller swiftUI eller noe reaktiv UI bibliotek er dette variablene deres. Det peker på data, og har en property `value` som kan være `null`, om må sjekkes.

### `onMounted()` & `onUnmounted()`
Disse tar inn en excecutable som henter inn data etter at siden er oppe. I teorien ser det her litt iffy ut, men definisjonsvis er sida mer reaktiv med det.