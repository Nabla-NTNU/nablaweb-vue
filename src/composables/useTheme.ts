import { ref, watch, onMounted, onUnmounted } from "vue"

export enum StyleTheme {
    Classic = "classic",
    Modern = "modern",
}

export enum ColorTheme {
    Light = "light",
    Dark = "dark",
    System = "system",
}

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

export function useTheme() {
    // Only allow this to run once
    if (chosenTheme.value || chosenStyle.value) return

    // Get the theme and listen to changes
    onMounted(() => {
        getLocalTheme()
        isDarkModeQuery.addEventListener("change", setSystemTheme)
    })

    // Stop listening to changes
    onUnmounted(() => {
        isDarkModeQuery.removeEventListener("change", setSystemTheme)
    })

    // Update theme with system if system is chosen
    watch(systemTheme, (newTheme) => {
        if (chosenTheme.value == ColorTheme.System) {
            document.documentElement.setAttribute("theme", newTheme)
        }
    })

    // Update chosen theme when requested
    watch(chosenTheme, (newTheme) => {
        if (newTheme == ColorTheme.System) {
            document.documentElement.setAttribute("theme", systemTheme.value)
        } else {
            document.documentElement.setAttribute("theme", newTheme!)
        }
        localStorage.setItem("theme", newTheme!)
    })

    // Update style when requested
    watch(chosenStyle, (newStyle) => {
        // Set meta tag to updated header/footer colour
        document.documentElement.setAttribute("style", newStyle!)
        localStorage.setItem("style", newStyle!)
    })
}
