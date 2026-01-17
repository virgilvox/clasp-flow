<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from './stores/ui'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import StatusBar from './components/layout/StatusBar.vue'

const uiStore = useUIStore()

const appClasses = computed(() => ({
  'app': true,
  'sidebar-collapsed': !uiStore.sidebarOpen,
}))
</script>

<template>
  <div :class="appClasses">
    <AppHeader />
    <div class="app-body">
      <AppSidebar />
      <main class="app-main">
        <router-view />
      </main>
    </div>
    <StatusBar />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--color-neutral-100);
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-main {
  flex: 1;
  overflow: hidden;
  position: relative;
}
</style>
