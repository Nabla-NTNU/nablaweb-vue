import { ref, watch, onMounted, onUnmounted } from "vue"
import { ColorTheme, StyleTheme } from "@/lib/types/frontend.types"

// User-defined theme and style
export const chosenTheme = ref<ColorTheme>()
export const chosenStyle = ref<StyleTheme>()
// export const loading = ref(true)

// System dark mode logic
const isDarkModeQuery = window.matchMedia("(prefers-color-scheme: dark)")

function getSystemTheme() {
    return isDarkModeQuery.matches ? ColorTheme.Dark : ColorTheme.Light
}

function setSystemTheme() {
    systemTheme.value = getSystemTheme()
}

const systemTheme = ref<ColorTheme>(getSystemTheme())

// Website colour theme logic
const metaStyleTheme = document.querySelector("meta[name='theme-color']")
const metaColorTheme = document.querySelector("meta[name='color-scheme']")

// Local storage logic
function getLocalTheme() {
    const localTheme: string | null = localStorage.getItem("theme")
    const localStyle: string | null = localStorage.getItem("style")

    if (localTheme == null || !(localTheme in ColorTheme)) {
        localStorage.setItem("theme", ColorTheme.System)
        chosenTheme.value = ColorTheme.System
    }
    if (localStyle == null || !(localStyle in StyleTheme)) {
        localStorage.setItem("style", StyleTheme.Classic)
        chosenStyle.value = StyleTheme.Classic
    }
    if (localTheme != null && localStyle != null) {
        try {
            chosenTheme.value = localTheme as ColorTheme
            chosenStyle.value = localStyle as StyleTheme
        } catch (error) {
            console.error(
                `[useTheme] Error loading theme from storage, unexpected value found in local storage: ${error}`,
            )
            // Reset to defaut settings
            chosenTheme.value = ColorTheme.System
            chosenStyle.value = StyleTheme.Classic
            // Overwrite whatever data was bad
            localStorage.setItem("theme", ColorTheme.System)
            localStorage.setItem("style", StyleTheme.Classic)
        }
    }
}

function updateTheme() {
    if (chosenTheme.value == ColorTheme.System) {
        document.documentElement.style.colorScheme = systemTheme.value
        document.documentElement.setAttribute("theme", systemTheme.value)
        metaColorTheme?.setAttribute("content", "light dark")
    } else {
        document.documentElement.style.colorScheme = chosenTheme.value!
        document.documentElement.setAttribute("theme", chosenTheme.value!)
        metaColorTheme?.setAttribute("content", chosenTheme.value!)
    }
    localStorage.setItem("theme", chosenTheme.value!)
}

function updateStyle() {
    document.documentElement.setAttribute("style", chosenStyle.value!)
    localStorage.setItem("style", chosenStyle.value!)

    // Fix meta tag (for explicit browser window chrome colouring (very pretty))
    const currentStyleSheet = window.getComputedStyle(document.body)
    const newPrimaryColor = currentStyleSheet.getPropertyValue("--primary")
    metaStyleTheme?.setAttribute("content", newPrimaryColor)
}

function updateThemeStyle() {
    updateTheme()
    updateStyle()
}

export function useTheme() {
    // Only allow this to run once
    if (chosenTheme.value || chosenStyle.value) return
    watch([systemTheme, chosenStyle, chosenTheme], updateThemeStyle)

    onMounted(() => {
        getLocalTheme()
        isDarkModeQuery.addEventListener("change", setSystemTheme)
    })

    onUnmounted(() => {
        isDarkModeQuery.removeEventListener("change", setSystemTheme)
    })
}
