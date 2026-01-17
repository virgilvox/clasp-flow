<script setup lang="ts">
import { computed } from 'vue'
import { useFlowsStore } from '@/stores/flows'
import { useRuntimeStore } from '@/stores/runtime'
import { useUIStore } from '@/stores/ui'
import {
  LayoutGrid,
  Play,
  Pause,
  Square,
  Save,
  Download,
  Upload,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-vue-next'

const flowsStore = useFlowsStore()
const runtimeStore = useRuntimeStore()
const uiStore = useUIStore()

const flowName = computed(() => flowsStore.activeFlow?.name ?? 'No Flow')
const isDirty = computed(() => flowsStore.hasUnsavedChanges)
const isRunning = computed(() => runtimeStore.isRunning)

function toggleSidebar() {
  uiStore.toggleSidebar()
}

function togglePlayback() {
  if (runtimeStore.isStopped) {
    runtimeStore.start()
  } else if (runtimeStore.isRunning) {
    runtimeStore.pause()
  } else {
    runtimeStore.resume()
  }
}

function stop() {
  runtimeStore.stop()
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button
        class="btn btn-icon btn-ghost header-sidebar-toggle"
        @click="toggleSidebar"
        :title="uiStore.sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
      >
        <PanelLeftClose v-if="uiStore.sidebarOpen" />
        <PanelLeft v-else />
      </button>

      <div class="header-brand">
        <LayoutGrid class="brand-icon" />
        <span class="brand-title">CLASP Flow</span>
      </div>

      <span class="header-divider" />

      <span class="header-flow-name">
        {{ flowName }}
        <span v-if="isDirty" class="dirty-indicator">*</span>
      </span>
    </div>

    <div class="header-center">
      <div class="playback-controls">
        <button
          class="btn btn-icon"
          :class="isRunning ? 'btn-primary' : 'btn-secondary'"
          @click="togglePlayback"
          :title="isRunning ? 'Pause' : 'Play'"
        >
          <Pause v-if="isRunning" />
          <Play v-else />
        </button>

        <button
          class="btn btn-icon btn-secondary"
          @click="stop"
          :disabled="runtimeStore.isStopped"
          title="Stop"
        >
          <Square />
        </button>
      </div>
    </div>

    <div class="header-right">
      <button class="btn btn-icon btn-ghost" title="Save">
        <Save />
      </button>
      <button class="btn btn-icon btn-ghost" title="Export">
        <Download />
      </button>
      <button class="btn btn-icon btn-ghost" title="Import">
        <Upload />
      </button>
      <button class="btn btn-icon btn-ghost" title="Settings">
        <Settings />
      </button>

      <span class="header-version">v0.1.0</span>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 var(--space-4);
  background: var(--color-neutral-800);
  color: var(--color-neutral-0);
  gap: var(--space-4);
  flex-shrink: 0;
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.header-left {
  flex: 1;
}

.header-right {
  flex: 1;
  justify-content: flex-end;
}

.header-sidebar-toggle {
  color: var(--color-neutral-400);
}

.header-sidebar-toggle:hover {
  color: var(--color-neutral-0);
  background: var(--color-neutral-700);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.brand-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-400);
}

.brand-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
}

.header-divider {
  width: 1px;
  height: 20px;
  background: var(--color-neutral-600);
  margin: 0 var(--space-2);
}

.header-flow-name {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-300);
}

.dirty-indicator {
  color: var(--color-warning);
  margin-left: var(--space-1);
}

.playback-controls {
  display: flex;
  gap: var(--space-2);
}

.header-right .btn-ghost {
  color: var(--color-neutral-400);
}

.header-right .btn-ghost:hover {
  color: var(--color-neutral-0);
  background: var(--color-neutral-700);
}

.header-version {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
  margin-left: var(--space-2);
}
</style>
