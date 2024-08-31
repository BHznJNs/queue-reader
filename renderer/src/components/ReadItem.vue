<script setup lang="ts">
import { ref, computed, inject, Ref, onMounted } from 'vue'
import { Checkbox } from 'mdui'
import { ArticleInfo, timeAgo } from '../scripts/utils'
import type { ActualThemeState } from '../wrapper/ThemeProvider'
import { useI18n } from 'vue-i18n';

const actualTheme = inject('actual-theme') as Ref<ActualThemeState>
const { t } = useI18n()
const props = defineProps<ArticleInfo & {
  hideTag: boolean,
  isArchives: boolean,
}>()

const checkbox = ref<Checkbox>()
const isFinished = ref(props.isArchives)

const cardVariant = computed(() =>
  actualTheme.value === 'light' ? 'elevated' : 'filled')

const emit = defineEmits(['finish', 'unfinish'])

onMounted(() => {
  checkbox.value?.addEventListener('change', (e) => {
    const target = e.target as Checkbox
    if (target.checked) {
      setTimeout(() => emit('finish', props.id), 600)
    } else {
      setTimeout(() => emit('unfinish', props.id), 600)
    }
    isFinished.value = target.checked
  })
})
</script>

<template>
<mdui-card
  :variant="cardVariant"
  :class="{'finished': isFinished !== props.isArchives}"
  class="mdui-pose"
>
  <div :class="{'finished': isFinished}" class="card-content-container">
    <mdui-checkbox ref="checkbox" :checked="isArchives" />
    <div class="article">
      <a :href="props.link" target="_blank"></a>
      <h3>{{ props.title }}</h3>
      <div class="article-info">
        <mdui-badge v-show="!hideTag">{{ props.tag }}</mdui-badge>
        <mdui-divider v-show="!hideTag" verticle></mdui-divider>
        <p>{{ timeAgo(props.appendTime) }}</p>
        <mdui-divider verticle></mdui-divider>
        <p>{{ t('list.neededTime', [props.neededTime]) }}</p>
      </div>
      <p class="description" v-show="props.description">{{ props.description }}</p>
    </div>
  </div>
</mdui-card>
</template>

<style scoped>
mdui-card {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition: grid-template-rows .3s .1s,
              opacity .2s .25s;

  &.finished {
    grid-template-rows: 0fr;
    opacity: 0;
  }
}

.card-content-container {
  display: flex;
  gap: .5rem;
  align-items: start;
  padding: 1.5rem;
  padding-left: 1rem;
  min-height: 0;

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
      display: inline;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      color: rgb(var(--mdui-color-on-surface));
      background-image: linear-gradient(
          to right,
          rgb(var(--mdui-color-on-surface)),
          rgb(var(--mdui-color-on-surface))
      );
      background-repeat: no-repeat;
      background-position: left center;
      background-size: 0 2px;
      transition: color .3s,
                  background .3s;
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

.finished h3 {
  color: rgba(var(--mdui-color-on-surface), .6) !important;
  background-size: 100% 2px !important;
}
</style>
