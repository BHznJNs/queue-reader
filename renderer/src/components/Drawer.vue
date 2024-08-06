<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { breakpoint, throttle } from 'mdui'
import type { NavigationDrawer } from 'mdui'
import '@mdui/icons/view-list.js'
import '@mdui/icons/tag.js'
import '@mdui/icons/mark-email-read.js'
import '@mdui/icons/arrow-drop-up.js'
import '@mdui/icons/arrow-drop-down.js'
import '@mdui/icons/settings.js'

const drawer = ref<NavigationDrawer>()
const isTagCollapsed = ref(false)

function accordionChangeHandler() {
  isTagCollapsed.value = !isTagCollapsed.value
}

function resizeHandler() {
  const breakpointCondition = breakpoint()
  const isMobileSized = breakpointCondition.down('md')
  drawer.value &&
    (drawer.value.open = !isMobileSized)
}

onMounted(() => {
  window.addEventListener("resize", throttle(resizeHandler, 400))
  resizeHandler()
})
</script>

<template>
<mdui-navigation-drawer ref="drawer" open close-on-esc close-on-overlay-click>
  <div class="drawer-content-container">
    <mdui-list class="drawer-tabs">
      <mdui-list-item rounded>
        Overview
        <mdui-icon-view-list slot="icon" />
      </mdui-list-item>

      <mdui-collapse @change="accordionChangeHandler" accordion value="item-1">
        <mdui-collapse-item value="item-1">
          <mdui-list-item slot="header" rounded>
            Tags
            <mdui-icon-tag slot="icon" />
            <mdui-icon-arrow-drop-up v-show="!isTagCollapsed" slot="end-icon" />
            <mdui-icon-arrow-drop-down v-show="isTagCollapsed" slot="end-icon" />
          </mdui-list-item>

          <div class="collapse-container">
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
          </div>
        </mdui-collapse-item>
      </mdui-collapse>

      <mdui-list-item rounded>
        Seen
        <mdui-icon-mark-email-read slot="icon" />
      </mdui-list-item>
    </mdui-list>

    <mdui-list class="setting-container">
      <mdui-list-item rounded>
        Setting
        <mdui-icon-settings slot="icon" />
      </mdui-list-item>
    </mdui-list>
  </div>
</mdui-navigation-drawer>
</template>

<style scoped>
mdui-navigation-drawer {
  box-shadow: var(--mdui-elevation-level3);
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
  .collapse-container {
    margin-left: 2.5rem;
  }
}
</style>
