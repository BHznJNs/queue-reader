<script setup lang="ts">
import { ref, inject } from 'vue'
import '@mdui/icons/add.js'
import '@mdui/icons/menu.js'
import '@mdui/icons/sort.js'
import SideDrawer from './components/SideDrawer.vue'
import NewArticleDialog from './components/NewArticle.vue'
import SettingDialog from './components/Setting.vue'
import TodoList from './components/TodoList.vue'
import FinishedList from './components/FinishedList.vue'
import type { SettingThemeState } from './wrapper/ThemeProvider'
import ConfirmDialog, { requestConfirm } from './components/ConfirmDialog'
import ErrorMsg from './components/ErrorMsg'
import { ListId, QUEUE, ARCHIVES } from './scripts/path'
import type { ArticleInfo } from './scripts/utils'
import { useI18n } from 'vue-i18n'

const theme = inject('setting-theme') as SettingThemeState
const { t } = useI18n()

const sideDrawer = ref<typeof SideDrawer>()
const todoList = ref<typeof TodoList>()
const finishedList = ref<typeof FinishedList>()
const newArticleDialog = ref<typeof NewArticleDialog>()
const settingDialog = ref<typeof SettingDialog>()

const tags: Set<string> = globalThis.__CONFIG__.tags
const tagList = ref(new Set(tags))
const currentListId = ref<ListId>(QUEUE)

function appendArticle(info: ArticleInfo, tag: string) {
  info.tag = tag
  info.id = globalThis.__CONFIG__.increment
  globalThis.__CONFIG__.increment += 1
  if (!tags.has(tag)) {
    tags.add(tag)
    tagList.value.add(tag)
  }
  todoList.value?.append(info)
}

function finishHandler(finished: ArticleInfo) {
  finishedList.value?.push(finished)
}

function unfinishHandler(unfinished: ArticleInfo) {
  todoList.value?.insert(unfinished)
}

function deleteTagHandler(tagName: string) {
  requestConfirm(tagName, async () => {
    tags.delete(tagName)
    tagList.value.delete(tagName)
    await todoList.value.removeTag(tagName)
  })
}
</script>

<template>
<div :class="'mdui-theme-' + theme">
  <mdui-layout>
    <SideDrawer
      ref="sideDrawer"
      :tags="tagList"
      :active="currentListId"
      @open="(id: ListId) => currentListId = id"
      @setting="settingDialog?.open"
      @deleteTag="deleteTagHandler"
    />

    <mdui-top-app-bar scroll-behavior="elevate">
      <mdui-button-icon @click="sideDrawer.toggle()">
        <mdui-icon-menu />
      </mdui-button-icon>
      <mdui-top-app-bar-title>{{ t('title') }}</mdui-top-app-bar-title>
      <div style="flex-grow: 1"></div>
    </mdui-top-app-bar>

    <mdui-layout-main>
      <TodoList
        ref="todoList"
        v-show="currentListId !== ARCHIVES"
        @finish="finishHandler"
        :tag="currentListId"
      />
      <FinishedList
        ref="finishedList"
        v-show="currentListId === ARCHIVES"
        @unfinish="unfinishHandler"
      />
    </mdui-layout-main>
  </mdui-layout>

  <mdui-fab
    v-show="currentListId !== ARCHIVES"
    @click="newArticleDialog.open"
  >
    <mdui-icon-add slot="icon" />
  </mdui-fab>

  <SettingDialog ref="settingDialog" />
  <NewArticleDialog
    ref="newArticleDialog"
    @confirm="appendArticle"
    :tags="tagList"
  />
  <ErrorMsg />
  <ConfirmDialog />
</div>
</template>

<style scoped>
mdui-layout-main {
  position: relative;
  height: 100vh;
}

mdui-fab {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
}
</style>
