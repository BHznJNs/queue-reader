<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { Dialog, SegmentedButton, Select } from 'mdui'
import { Language } from '../scripts/i18n';
import { SettingThemeState } from '../wrapper/ThemeProvider'
import { useI18n } from 'vue-i18n';

const dialog = ref<Dialog>()
const themeSelect = ref<SegmentedButton>()
const targetTheme = ref<SettingThemeState>(globalThis.__CONFIG__.theme)
const languageSelect = ref<Select>()
const targetLanguage = ref<Language>(globalThis.__CONFIG__.language)

const setTheme = inject('set-theme') as (theme: SettingThemeState) => void
const { t, locale } = useI18n()

function open() {
  targetTheme.value = globalThis.__CONFIG__.theme
  targetLanguage.value = globalThis.__CONFIG__.language
  dialog.value &&
    (dialog.value.open = true)
}

function close() {
  dialog.value &&
    (dialog.value.open = false)
}

function save() {
  globalThis.__CONFIG__.theme = targetTheme.value
  globalThis.__CONFIG__.language = targetLanguage.value
  setTheme(targetTheme.value)
  locale.value = targetLanguage.value
}

defineExpose({open, close})

onMounted(() => {
  themeSelect.value?.addEventListener('change', (e) => {
    const target = e.target as SegmentedButton
    targetTheme.value = target.value as SettingThemeState
  })
  languageSelect.value?.addEventListener('change', (e) => {
    const target = e.target as Select
    targetLanguage.value = target.value as Language
  })
})
</script>

<template>
<mdui-dialog
  ref="dialog"
  close-on-esc
  close-on-overlay-click
>
  <span slot="headline">{{ t('setting.title') }}</span>
  <div class="setting-options">
    <label>
      {{ t('setting.theme') }}: 
      <mdui-segmented-button-group
        ref="themeSelect"
        selects="single"
        required
        :value="targetTheme"
      >
        <mdui-segmented-button value="light">{{ t('setting.themes.light') }}</mdui-segmented-button>
        <mdui-segmented-button value="dark">{{ t('setting.themes.dark') }}</mdui-segmented-button>
        <mdui-segmented-button value="auto">{{ t('setting.themes.auto') }}</mdui-segmented-button>
      </mdui-segmented-button-group>
    </label>

    <label>
      {{ t('setting.language') }}: 
      <mdui-select
        ref="languageSelect"
        variant="outlined"
        :value="targetLanguage"
      >
        <mdui-menu-item value="en">English</mdui-menu-item>
        <mdui-menu-item value="zh">简体中文</mdui-menu-item>
      </mdui-select>
    </label>
  </div>

  <mdui-button
    slot="action"
    variant="text"
    @click="close"
  >{{ t('setting.actions.cancel') }}</mdui-button>
  <mdui-button
    slot="action"
    @click="save"
  >{{ t('setting.actions.save') }}</mdui-button>
</mdui-dialog>
</template>

<style scoped>
mdui-dialog::part(panel) {
  width: max-content;
  min-width: min(40vw, 600px);
}

.setting-options {
  display: flex;
  flex-direction: column;
  gap: .6rem;
  padding: .4rem 0;
  overflow: hidden;

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;

    mdui-select {
      max-width: 12rem;
      margin-left: 1rem;
    }
  }
}
</style>
