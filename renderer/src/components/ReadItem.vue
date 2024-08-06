<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import type { ActualThemeState } from '../ThemeWrapper.vue'
export interface ArticleInfo {
  title: string,
  link: string,
  appendTime: number, // timestamp
  neededTime: number, // unit: min
  description?: string,
}
const actualTheme = inject('actual-theme') as Ref<ActualThemeState>
const props = defineProps<ArticleInfo>()

const cardVariant = computed(() =>
  actualTheme.value === 'light' ? 'elevated' : 'filled')

function timeAgo(timestamp: number): string {
    const difference = Math.floor((Date.now() - timestamp) / 1000);
    const intervals = {
        'year': 31536000,
        'month': 2628000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
    };

    for (const intervalName in intervals) {
        const interval = intervals[intervalName];
        if (difference >= interval) {
            const count = Math.floor(difference / interval);
            return `about ${count} ${intervalName}${count !== 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}
</script>

<template>
<mdui-card :variant="cardVariant" class="mdui-pose">
  <div class="card-content-container">
    <mdui-checkbox></mdui-checkbox>
    <div class="article">
      <a :href="props.link" target="_blank"></a>
      <h3>{{ props.title }}</h3>
      <div class="article-info">
        <p>{{ timeAgo(props.appendTime) }}</p>
        <mdui-divider verticle></mdui-divider>
        <p>{{ props.neededTime }} min read</p>
      </div>
    </div>
  </div>
</mdui-card>
</template>

<style scoped>

/* background-color: rgb(var(--mdui-color-surface-container-highest)); */

.card-content-container {
  display: flex;
  gap: .5rem;
  align-items: start;
  padding: 1.5rem;
  padding-left: 1rem;

  .article {
    position: relative;
    overflow: hidden;

    * {
      margin: 0;
    }

    a {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    h3 {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; 
    }

    p {
      opacity: .75;
    }

    .article-info {
      display: flex;
      align-items: center;
      gap: .2rem;
      margin-top: .6rem;
      font-size: .875rem;

      mdui-divider {
        width: 1px;
        height: .6rem;
      }
    }

    .description {
      margin-top: 1rem;
    }
  }
}
</style>
