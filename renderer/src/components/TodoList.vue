<script setup lang="ts">
import { computed, ref } from 'vue'
import ReadItem from './ReadItem.vue'
import { ArticleInfo } from '../scripts/utils'
import { DataPath, GlobalFsOption, ListId, QUEUE } from '../scripts/path'
import { writeTextFile } from '@tauri-apps/api/fs'
import { DataStoreFromData } from '../scripts/store'

let queue: ArticleInfo[] = globalThis.__QUEUE__
const queueRef = ref<ArticleInfo[]>(Array.from(queue))

const emit = defineEmits(['finish'])
const props = defineProps<{
  tag: ListId,
}>()

const list = computed(() => {
  if (props.tag === QUEUE) {
    return queueRef.value
  }
  return queueRef.value.filter(item => item.tag === props.tag)
})

function finishHandler(id: number) {
  const index = queue.findIndex((item: ArticleInfo) => item.id === id)
  const removed = queue.splice(index, 1)[0]
  queueRef.value.splice(index, 1)[0]
  emit('finish', removed)
}

defineExpose({
  append(item: ArticleInfo) {
    queueRef.value.unshift(item)
    queue.unshift(item)
  },
  insert(item: ArticleInfo) {
    let i = 0
    for (const value of queue) {
      if (value.id < item.id) {
        break
      }
      i += 1
    }
    queue.splice(i, 0, item)
    queueRef.value.splice(i, 0, item)
  },
  async removeTag(tagName: string) {
    const newQueue = queue.filter((item: ArticleInfo) =>
      item.tag !== tagName)
    queueRef.value = newQueue
    await writeTextFile(DataPath.queue, JSON.stringify(newQueue), GlobalFsOption)
    queue = globalThis.__QUEUE__ = DataStoreFromData(DataPath.queue, newQueue)
  }
})
</script>

<template>
<div class="read-list">
  <h1 class="empty" v-show="!list.length">Click "+" to Queue</h1>
  <ReadItem
    v-for="item in list"
    v-bind="item"
    @finish="finishHandler"
    :hideTag="props.tag !== QUEUE"
    :isArchives="false"
    :key="item.id"
  />
</div>
</template>

<style src="./list.css" scoped></style>