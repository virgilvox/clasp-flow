<script setup lang="ts">
import { computed, inject, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFlowsStore } from '@/stores/flows'
import { useRuntimeStore } from '@/stores/runtime'
import { useUIStore } from '@/stores/ui'
import {
  Play,
  Pause,
  Square,
  Save,
  Download,
  Upload,
  Settings,
  PanelLeftClose,
  PanelLeft,
  PanelRightClose,
  PanelRight,
  Sliders,
  Code2,
  Brain,
} from 'lucide-vue-next'
import LatchLogo from '@/components/branding/LatchLogo.vue'
import { aiInference } from '@/services/ai/AIInference'

const route = useRoute()
const router = useRouter()
const flowsStore = useFlowsStore()
const runtimeStore = useRuntimeStore()
const uiStore = useUIStore()

// Track if AI models are loaded
const hasLoadedModels = ref(false)
let aiUnsubscribe: (() => void) | null = null

onMounted(() => {
  updateAIStatus()
  aiUnsubscribe = aiInference.subscribe(() => {
    updateAIStatus()
  })
})

onUnmounted(() => {
  aiUnsubscribe?.()
})

function updateAIStatus() {
  const state = aiInference.getState()
  hasLoadedModels.value = state.loadedModels.size > 0
}

// Check current view
const isEditorView = computed(() => route.name === 'editor')
const isControlPanelView = computed(() => route.name === 'controls')

// Navigate between views
function goToEditor() {
  router.push({ name: 'editor' })
}

function goToControlPanel() {
  router.push({ name: 'controls' })
}

// Inject execution engine controls from EditorView
const executionControls = inject<{
  start: () => void
  stop: () => void
  pause: () => void
  resume: () => void
  toggle: () => void
}>('executionControls')

const flowName = computed(() => flowsStore.activeFlow?.name ?? 'No Flow')
const isDirty = computed(() => flowsStore.hasUnsavedChanges)
const isRunning = computed(() => runtimeStore.isRunning)

function toggleSidebar() {
  uiStore.toggleSidebar()
}

function togglePlayback() {
  if (executionControls) {
    executionControls.toggle()
  }
}

function stop() {
  if (executionControls) {
    executionControls.stop()
  }
}

function togglePropertiesPanel() {
  uiStore.togglePropertiesPanel()
}

function openAIModelManager() {
  uiStore.openAIModelManager()
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
        <LatchLogo :size="24" variant="dark" class="brand-icon" />
        <span class="brand-title">LATCH</span>
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

      <span class="header-divider" />

      <div class="view-switcher">
        <button
          class="btn btn-sm view-btn"
          :class="{ active: isEditorView }"
          @click="goToEditor"
          title="Editor View"
        >
          <Code2 />
          <span>Editor</span>
        </button>
        <button
          class="btn btn-sm view-btn"
          :class="{ active: isControlPanelView }"
          @click="goToControlPanel"
          title="Control Panel"
        >
          <Sliders />
          <span>Controls</span>
        </button>
      </div>
    </div>

    <div class="header-right">
      <button
        v-if="isEditorView"
        class="btn btn-icon btn-ghost header-panel-toggle"
        @click="togglePropertiesPanel"
        :title="uiStore.propertiesPanelOpen ? 'Hide properties' : 'Show properties'"
      >
        <PanelRightClose v-if="uiStore.propertiesPanelOpen" />
        <PanelRight v-else />
      </button>

      <span v-if="isEditorView" class="header-divider" />

      <!-- AI Button: Full text when no models loaded, icon only when loaded -->
      <button
        v-if="!hasLoadedModels"
        class="btn ai-load-btn"
        title="Load Local AI Models"
        @click="openAIModelManager"
      >
        <Brain :size="16" />
        <span>Load Local AI</span>
      </button>
      <button
        v-else
        class="btn btn-icon ai-btn-loaded"
        title="AI Model Manager"
        @click="openAIModelManager"
      >
        <Brain />
      </button>

      <span class="header-divider" />

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

.header-sidebar-toggle:hover,
.header-panel-toggle:hover {
  color: var(--color-neutral-0);
  background: var(--color-neutral-700);
}

.header-panel-toggle {
  color: var(--color-neutral-400);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.brand-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
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

.ai-load-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: #A855F7;
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ai-load-btn:hover {
  background: #9333EA;
}

.ai-btn-loaded {
  color: #A855F7;
}

.ai-btn-loaded:hover {
  color: #C084FC;
  background: var(--color-neutral-700);
}

.header-version {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
  margin-left: var(--space-2);
}

.view-switcher {
  display: flex;
  gap: var(--space-1);
  background: var(--color-neutral-900);
  padding: var(--space-1);
  border-radius: var(--radius-sm);
}

.view-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--color-neutral-400);
  background: transparent;
  border: none;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: all 0.15s ease;
}

.view-btn:hover {
  color: var(--color-neutral-200);
  background: var(--color-neutral-700);
}

.view-btn.active {
  color: var(--color-neutral-0);
  background: var(--color-primary-500);
}

.view-btn svg {
  width: 14px;
  height: 14px;
}
</style>
