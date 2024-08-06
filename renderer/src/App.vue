<script setup lang="ts">
import { ref, inject } from 'vue'
import '@mdui/icons/add.js'
import Drawer from './components/Drawer.vue'
import NewArticleDialog from './components/NewArticle.vue'
import ReadList from './components/ReadList.vue'
import type { SettingThemeState } from './ThemeWrapper.vue'
import type { ArticleInfo } from './components/ReadItem.vue'

const newArticleDialog = ref<typeof NewArticleDialog>()
const theme = inject('setting-theme') as SettingThemeState

const articleList: ArticleInfo[] = [
  {
    title: 'Article Title',
    link: 'https://bing.com',
    appendTime: 1722844318760,
    neededTime: 3,
    description: "test stetstets adskd kkans asdkakjskdj kaskdknaksndknaksfdfj jadoskdlaksld"
  },
  {
    title: 'Article Title Article Title Article Title Article Title Article Title',
    link: 'https://bing.com',
    appendTime: 1722844318760,
    neededTime: 3,
    description: "test stetstets adskd kkans asdkakjskdj kaskdknaksndknaksfdfj jadoskdlaksld"
  }
]

function openAddArticleDialog() {
  newArticleDialog.value && newArticleDialog.value.open()
}
</script>

<template>
<mdui-layout :class="'mdui-theme-' + theme">
  <Drawer></Drawer>

  <mdui-layout-main>
    <ReadList :list="articleList" />
  </mdui-layout-main>

</mdui-layout>

<mdui-fab @click="openAddArticleDialog">
  <mdui-icon-add slot="icon" />
</mdui-fab>

<NewArticleDialog ref="newArticleDialog" />
</template>

<style scoped>
mdui-layout-main {
  height: 100vh;
}
mdui-fab {
  position: fixed;
  right: 1rem;
  bottom: 1rem;  
}
</style>
