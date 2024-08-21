<script setup lang="ts">
import { onMounted, ref } from 'vue'
import '@mdui/icons/arrow-back.js'
import '@mdui/icons/arrow-forward.js'
import ReadItem from './ReadItem.vue'
import { ArticleInfo } from '../scripts/utils'
import { StackStore } from '../scripts/store'

const archives: StackStore<ArticleInfo> = globalThis.__ARCHIVES__
const archivesRef = ref<ArticleInfo[]>([])
const currentPage = ref(1)
const totalPage = ref(archives.size)

const emit = defineEmits(['unfinish'])

async function openPage(index: number) {
  currentPage.value = index
  archivesRef.value = await archives.getPage(index)
}

async function unfinishHandler(id: number) {
  const { value, index } = await archives.findAndRemove(
    currentPage.value,
    (item: ArticleInfo) =>
        item.id === id
  )
  archivesRef.value.splice(archivesRef.value.length - index - 1, 1)[0]
  emit('unfinish', value)
}

defineExpose({
  push(element: ArticleInfo) {
    archives.push(element)
    archivesRef.value.unshift(element)
  }
})

onMounted(() => {
  openPage(1)
  archives.addResizeEvent(async (newSize: number, _) => {
    totalPage.value = newSize
    archivesRef.value = await archives.getPage(1)
  })
})
</script>

<template>
<div class="read-list">
  <h1 class="empty" v-show="!archivesRef.length">Nothing Archived</h1>
  <ReadItem
    v-for="item in archivesRef"
    v-bind="item"
    @unfinish="unfinishHandler"
    :hideTag="false"
    :isArchives="true"
    :key="item.id"
  />
  <div v-show="archives.size > 1" class="pagination">
    <mdui-button-icon
      @click="() => openPage(currentPage - 1)"
      :disabled="currentPage === 1"
    >
      <mdui-icon-arrow-back />
    </mdui-button-icon>
    <p>{{ currentPage }} / {{ archives.size }}</p>
    <mdui-button-icon
      @click="() => openPage(currentPage + 1)"
      :disabled="currentPage === totalPage"
    >
      <mdui-icon-arrow-forward />
    </mdui-button-icon>
  </div>
</div>
</template>

<style src="./list.css" scoped></style>