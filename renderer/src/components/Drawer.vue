<script setup lang="ts">
import { ref, onMounted } from 'vue'
import '@mdui/icons/view-list.js'
import '@mdui/icons/tag.js'
import '@mdui/icons/mark-email-read.js';
import '@mdui/icons/arrow-drop-up.js'
import '@mdui/icons/arrow-drop-down.js'

const accordion = ref(null)
const isTagCollapsed = ref(false)

onMounted(() => {
  accordion.value.addEventListener("change", () =>
    isTagCollapsed.value = !isTagCollapsed.value)
})
</script>

<template>
  <mdui-navigation-drawer open close-on-esc close-on-overlay-click>
    <mdui-list>
      <mdui-list-item rounded>
        Overview
        <mdui-icon-view-list slot="icon"></mdui-icon-view-list>
      </mdui-list-item>

      <mdui-collapse ref="accordion" accordion value="item-1">
        <mdui-collapse-item value="item-1">
          <mdui-list-item slot="header" rounded>
            Tags
            <mdui-icon-tag slot="icon"></mdui-icon-tag>
            <mdui-icon-arrow-drop-up v-show="!isTagCollapsed" slot="end-icon"></mdui-icon-arrow-drop-up>
            <mdui-icon-arrow-drop-down v-show="isTagCollapsed" slot="end-icon"></mdui-icon-arrow-drop-down>
          </mdui-list-item>

          <div class="collapse-container">
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
            <mdui-list-item rounded>Technology</mdui-list-item>
            <mdui-list-item rounded>Sports</mdui-list-item>
            <mdui-list-item rounded>Education</mdui-list-item>
            <mdui-list-item rounded>Environment</mdui-list-item>
          </div>
        </mdui-collapse-item>
      </mdui-collapse>

      <mdui-list-item rounded>
        Read
        <mdui-icon-mark-email-read slot="icon"></mdui-icon-mark-email-read>
      </mdui-list-item>
    </mdui-list>
  </mdui-navigation-drawer>
</template>

<style scoped>
mdui-list {
  margin-left: .6rem;
  margin-right: .6rem;
}

.collapse-container {
  margin-left: 2.5rem;
}
</style>
