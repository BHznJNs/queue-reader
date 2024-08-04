<script setup lang="ts">
import { ref, onMounted } from 'vue'
import '@mdui/icons/add.js'
import Drawer from './components/Drawer.vue'
import ReadList from './components/ReadList.vue'
</script>

<template>
<mdui-layout>
  <Drawer></Drawer>

  <mdui-layout-main>
    <ReadList></ReadList>
  </mdui-layout-main>
</mdui-layout>

<mdui-fab>
  <mdui-icon-add slot="icon"></mdui-icon-add>
</mdui-fab>
</template>

<style scoped>
mdui-layout-main {
  height: 100vh;
  background-color: white;
}
mdui-fab {
  position: fixed;
  right: 1rem;
  bottom: 1rem;  
}
</style>
