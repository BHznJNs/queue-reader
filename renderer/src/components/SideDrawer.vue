<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { breakpoint, throttle } from 'mdui'
import type { NavigationDrawer } from 'mdui'
import { ListId, QUEUE, ARCHIVES } from '../scripts/path'
import '@mdui/icons/view-list.js'
import '@mdui/icons/tag.js'
import '@mdui/icons/mark-email-read.js'
import '@mdui/icons/arrow-right.js'
import '@mdui/icons/arrow-drop-down.js'
import '@mdui/icons/settings.js'
import '@mdui/icons/remove-circle-outline.js'
import { useI18n } from 'vue-i18n'

const drawer = ref<NavigationDrawer>()
const isTagCollapsed = ref(false)
const { t } = useI18n()

const props = defineProps<{
  tags: Set<string>,
  active: ListId,
}>()

const hasTags = computed(() => Boolean(props.tags.size))
const emit = defineEmits(['open', 'setting', 'deleteTag'])

defineExpose({
  open() {
    drawer.value &&
      (drawer.value.open = true)
  },
  close() {
    drawer.value &&
      (drawer.value.open = false)
  },
  toggle() {
    drawer.value &&
      (drawer.value.open = !drawer.value.open)
  }
})

onMounted(() => {
  function resizeHandler() {
    const breakpointCondition = breakpoint()
    const isMobileSized = breakpointCondition.down('md')
    drawer.value &&
      (drawer.value.open = !isMobileSized)
  }
  window.addEventListener("resize", throttle(resizeHandler, 400))
  resizeHandler()
})
</script>

<template>
<mdui-navigation-drawer ref="drawer" open close-on-esc close-on-overlay-click>
  <div class="drawer-content-container">
    <mdui-list class="drawer-tabs">
      <mdui-list-item
        @click="emit('open', QUEUE)"
        :active="props.active === QUEUE"
        rounded
      >
        {{ t('sidebar.queue') }}
        <mdui-icon-view-list slot="icon" />
      </mdui-list-item>

      <mdui-collapse @change="isTagCollapsed = !isTagCollapsed" accordion>
        <mdui-collapse-item>
          <mdui-list-item
            slot="header"
            rounded
            :disabled="!hasTags"
          >
            {{ t('sidebar.tags') }}
            <mdui-icon-tag slot="icon" />
            <div v-show="hasTags" slot="end-icon">
              <mdui-icon-arrow-right v-show="!isTagCollapsed" />
              <mdui-icon-arrow-drop-down v-show="isTagCollapsed" />
            </div>
          </mdui-list-item>

          <div class="collapse-container">
            <mdui-list-item
              v-for="(item, index) of props.tags"
              @click="emit('open', item)"
              :active="props.active === item"
              :key="index"
              class="tag-item"
              rounded
            >
              {{ item }}
              <mdui-button-icon
                @click.stop="() => emit('deleteTag', item)"
                slot="end-icon"
              >
                <mdui-icon-remove-circle-outline />
              </mdui-button-icon>
            </mdui-list-item>
          </div>
        </mdui-collapse-item>
      </mdui-collapse>

      <mdui-list-item
        @click="emit('open', ARCHIVES)"
        :active="props.active === ARCHIVES"
        rounded
      >
        {{ t('sidebar.archives') }}
        <mdui-icon-mark-email-read slot="icon" />
      </mdui-list-item>
    </mdui-list>

    <mdui-list class="setting-container">
      <mdui-list-item rounded @click="emit('setting')">
        {{ t('sidebar.setting') }}
        <mdui-icon-settings slot="icon" />
      </mdui-list-item>
    </mdui-list>
  </div>
</mdui-navigation-drawer>
</template>

<style scoped>
mdui-navigation-drawer {
  box-shadow: var(--mdui-elevation-level3);
  z-index: 2001;
}

.drawer-content-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: .4rem 0 0;
  overflow: hidden;
  box-sizing: border-box;

  mdui-list {
    margin-left: .6rem;
    margin-right: .6rem;

    & > mdui-list-item::part(headline) {
      font-size: 1.1rem;
    }
  }
  
  mdui-list.drawer-tabs {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  mdui-list.setting-container {
    margin: 0;
    padding: 1rem .6rem;
    box-shadow: var(--mdui-elevation-level1);
  }

  mdui-collapse-item > mdui-list-item::part(headline) {
    font-size: 1.1rem;
  }
  .collapse-container {
    margin-left: 2.5rem;
  }
}

.tag-item mdui-button-icon {
  opacity: 0;
  pointer-events: none;
}
.tag-item:hover mdui-button-icon {
  opacity: 1;
  pointer-events: all;
}
</style>
