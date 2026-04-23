import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"

export const chosenLanguage = ref<string>(localStorage.getItem("lang") || "nb")

export function useLanguage() {
    const { locale } = useI18n({ useScope: "global" })

    function updateLanguage() {
        locale.value = chosenLanguage.value

        document.documentElement.setAttribute("lang", chosenLanguage.value)

        localStorage.setItem("lang", chosenLanguage.value)
    }

    watch(chosenLanguage, () => {
        updateLanguage()
    })

    updateLanguage()
}
