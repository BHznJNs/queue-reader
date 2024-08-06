<script setup lang="ts">
import { ref, provide } from 'vue'
import App from './App.vue'

export type ActualThemeState = 'light' | 'dark'
export type SettingThemeState = ActualThemeState | 'auto'
const settingTheme = ref<SettingThemeState>('auto')
const actualTheme = ref<ActualThemeState>(getCurrentTheme())

function getCurrentTheme(): ActualThemeState {
    if (settingTheme.value === 'light' || settingTheme.value === 'dark') {
        return settingTheme.value
    }
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const isDarkMode = () => darkModeMediaQuery.matches
    const targetTheme = () => isDarkMode() ? 'dark' : 'light'

    darkModeMediaQuery.addEventListener('change', () =>
        actualTheme.value = targetTheme())
    return targetTheme()
}

provide('setting-theme', settingTheme)
provide('actual-theme', actualTheme)
</script>

<template>
<App />
</template>
