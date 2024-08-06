<script setup lang="ts">
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api'
import type { Dialog, Dropdown, TextField, Menu } from 'mdui'
import '@mdui/icons/arrow-drop-up.js'
import '@mdui/icons/arrow-drop-down.js'
import { ArticleInfo } from './ReadItem.vue'

const dialog = ref<Dialog>()
const tagDropdown = ref<Dropdown>()
const isTagDropdownOpen = ref(false)
const isArticleLoading = ref(false)
const targetArticleUrl = ref('')
const targetArticleTag = ref('')

function toggleDropdown() {
  tagDropdown.value != undefined &&
    (tagDropdown.value.open = !tagDropdown.value.open)
  isTagDropdownOpen.value != undefined &&
    (isTagDropdownOpen.value = !isTagDropdownOpen.value)
}

function urlEditHandler(e) {
  const target = e.target as TextField
  targetArticleUrl.value = target.value
}

function tagEditHandler(e) {
  const target = e.target as TextField
  targetArticleTag.value = target.value
}

function tagSelectHandler(e) {
  const target = e.target as Menu
  target.value &&
    (targetArticleTag.value = target.value as string)
  isTagDropdownOpen.value = false
}

function open() {
  dialog.value &&
    (dialog.value.open = true)
}

function close() {
  dialog.value &&
    (dialog.value.open = false)
}

function clear() {
  targetArticleUrl.value = ''
  targetArticleTag.value = ''
}

async function confirm() {
  isArticleLoading.value = true
  const article = await invoke('fetch_article', {
    url: targetArticleUrl.value,
  }) as ArticleInfo
  emit('confirm', article)
  clear()
  isArticleLoading.value = false
  close()
}

const emit = defineEmits(['confirm'])

defineExpose({
  open,
  close,
  clear,
})
</script>

<template>
<mdui-dialog
  ref="dialog"
  close-on-esc
  close-on-overlay-click
>
  <span slot="headline">Add to Queue</span>
  <div class="article-info">
    <mdui-text-field
      variant="outlined"
      label="Article URL"
      type="url"
      :value="targetArticleUrl"
      @change="urlEditHandler"
      clearable
    />

    <mdui-dropdown ref="tagDropdown" trigger="manual" placement="auto">
      <mdui-text-field
        slot="trigger"
        variant="outlined"
        label="Article Tag"
        :value="targetArticleTag"
        @change="tagEditHandler"
        type="text"
      >
        <mdui-icon-arrow-drop-up   @click="toggleDropdown" v-show="isTagDropdownOpen" slot="end-icon" />
        <mdui-icon-arrow-drop-down @click="toggleDropdown" v-show="!isTagDropdownOpen" slot="end-icon" />
      </mdui-text-field>
      <mdui-menu
        @change="tagSelectHandler"
        part="menu"
        selects="single"
      >
        <mdui-menu-item value="Item 1">Item 1</mdui-menu-item>
        <mdui-menu-item value="Item 2">Item 2 </mdui-menu-item>
      </mdui-menu>
    </mdui-dropdown>
  </div>
  <mdui-button @click="close" slot="action" variant="text">Cancel</mdui-button>
  <mdui-button @click="confirm" :loading="isArticleLoading" slot="action">Confirm</mdui-button>
</mdui-dialog>
</template>

<style scoped>
mdui-dialog::part(panel) {
  min-width: min(40vw, 600px);
}

span[slot="headline"] {
  font-weight: bold;
}
.article-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: .4rem 0;
  overflow: hidden;
}

mdui-icon-arrow-drop-up,
mdui-icon-arrow-drop-down {
  cursor: pointer;
}
</style>