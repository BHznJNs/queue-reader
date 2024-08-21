import { ref } from 'vue'

export type ActualThemeState = 'light' | 'dark'
export type SettingThemeState = ActualThemeState | 'auto'
export const settingTheme = ref<SettingThemeState>('auto')

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
const isDarkMode = () => darkModeMediaQuery.matches
const perferedTheme = () => isDarkMode() ? 'dark' : 'light'
const computedTheme = () => (settingTheme.value === 'auto')
    ? perferedTheme()
    : settingTheme.value
darkModeMediaQuery.addEventListener('change', () =>
    actualTheme.value = computedTheme())

export const actualTheme = ref<ActualThemeState>(computedTheme())
export function setTheme(theme: SettingThemeState) {
    settingTheme.value = theme
    actualTheme.value = computedTheme()
}
