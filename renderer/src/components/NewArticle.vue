<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { invoke } from '@tauri-apps/api'
import type { Dialog, Dropdown, TextField, Menu } from 'mdui'
import '@mdui/icons/arrow-right.js'
import '@mdui/icons/arrow-drop-down.js'
import { isValidUrl, ArticleInfo } from '../scripts/utils'
import { showMsg } from './ErrorMsg'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const dialog = ref<Dialog>()
const tagDropdown = ref<Dropdown>()
const tagMenu = ref<Menu>()
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
  tagMenu.value!.value = ''
}

async function confirm() {
  isArticleLoading.value = true
  let article: ArticleInfo
  try {
    console.assert(targetArticleUrl.value.length > 0)
    console.assert(targetArticleTag.value.length > 0)
    article = await invoke('fetch_article', {
      url: targetArticleUrl.value,
    }) as ArticleInfo
  } catch(err) {
    showMsg(t('newArticle.errorMsg'))
    console.error(err)
    setTimeout(() =>
      (isArticleLoading.value = false), 100)
    return
  }
  emit('confirm', article, targetArticleTag.value)
  clear(); close()
  setTimeout(() =>
    (isArticleLoading.value = false), 100)
}

const emit = defineEmits(['confirm'])
const props = defineProps<{
  tags: Set<string>,
}>()

const isAbleToComfirm = computed(() =>
  targetArticleTag.value.length &&
  targetArticleUrl.value.length &&
  isValidUrl(targetArticleUrl.value)
)

defineExpose({
  open, close, clear,
})

onMounted(() => {
  tagDropdown.value?.addEventListener('closed', () => {
    isTagDropdownOpen.value = false
  })
})
</script>

<template>
<mdui-dialog
  ref="dialog"
  :close-on-esc="!isArticleLoading"
  :close-on-overlay-click="!isArticleLoading"
>
  <span slot="headline">{{ t('newArticle.title') }}</span>
  <div class="article-info">
    <mdui-text-field
      variant="outlined"
      type="url" clearable
      :label="t('newArticle.url')"
      :disabled="isArticleLoading"
      :value="targetArticleUrl"
      @change="urlEditHandler"
    />

    <mdui-dropdown
      ref="tagDropdown"
      trigger="manual"
    >
      <mdui-text-field
        slot="trigger"
        variant="outlined"
        type="text"
        :label="t('newArticle.tag')"
        :helper="t('newArticle.tagDesc')"
        :disabled="isArticleLoading"
        :value="targetArticleTag"
        @change="tagEditHandler"
      >
        <div v-show="props.tags.size" slot="end-icon">
          <mdui-icon-arrow-right @click="toggleDropdown" v-show="!isTagDropdownOpen" />
          <mdui-icon-arrow-drop-down  @click="toggleDropdown" v-show="isTagDropdownOpen" />
        </div>
      </mdui-text-field>
      <mdui-menu
        ref="tagMenu"
        part="menu"
        selects="single"
        @change="tagSelectHandler"
      >
        <mdui-menu-item
          v-for="(item, index) in props.tags"
          :value="item"
          :key="index"
        >{{ item }}</mdui-menu-item>
      </mdui-menu>
    </mdui-dropdown>
  </div>
  <mdui-button
    @click="close"
    :disabled="isArticleLoading"
    slot="action"
    variant="text"
  >{{ t('newArticle.actions.cancel') }}</mdui-button>
  <mdui-button
    @click="confirm"
    :disabled="!isAbleToComfirm"
    :loading="isArticleLoading"
    slot="action"
  >{{ t('newArticle.actions.confirm') }}</mdui-button>
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