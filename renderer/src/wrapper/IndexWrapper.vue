<script setup lang="ts">
import { provide } from 'vue'
import App from '../App.vue'
import { settingTheme, actualTheme, setTheme } from './ThemeProvider'

provide('setting-theme', settingTheme)
provide('actual-theme', actualTheme)
provide('set-theme', setTheme)
</script>

<template>
<App />
</template>
