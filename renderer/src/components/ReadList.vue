<script setup lang="ts">
import ReadItem from './ReadItem.vue'
import { ArticleInfo } from '../scripts/utils'

const props = defineProps<{
  list: ArticleInfo[],
  hideTag: boolean,
  isArchives: boolean,
}>()

const emit = defineEmits(['finish', 'unfinish'])
</script>

<template>
<div class="read-list">
  <h1 class="empty" v-show="!props.list.length">Click "+" to Queue</h1>
  <ReadItem
    v-for="item in props.list"
    v-bind="item"
    @finish="(index: number) => emit('finish', index)"
    @unfinish="(index: number) => emit('unfinish', index)"
    :hideTag="hideTag"
    :isArchives="isArchives"
    :key="item.id"
  />
</div>
</template>
