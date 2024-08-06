<script setup lang="ts">
import ReadItem from './ReadItem.vue'
import type { ArticleInfo } from './ReadItem.vue';

const props = defineProps<{
  list: ArticleInfo[],
}>()
</script>

<template>
<div class="read-list">
  <ReadItem
    v-for="(item, index) in props.list"
    v-bind="item"
    :key="index"
  />
</div>
</template>

<style scoped>
mdui-divider {
  height: .8rem;
}

.read-list {
  display: flex;
  flex-direction: column;
  gap: .6rem;
  padding: 1rem 2rem;
}
</style>
