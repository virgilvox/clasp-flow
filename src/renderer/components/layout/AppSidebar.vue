<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore, type SidebarPanel } from '@/stores/ui'
import { useNodesStore, categoryMeta, type NodeCategory } from '@/stores/nodes'
import { Search, Boxes, Settings2, SlidersHorizontal } from 'lucide-vue-next'

const uiStore = useUIStore()
const nodesStore = useNodesStore()

const sidebarStyle = computed(() => ({
  width: uiStore.sidebarOpen ? `${uiStore.sidebarWidth}px` : '0px',
}))

const panels: { id: SidebarPanel; label: string; icon: typeof Search }[] = [
  { id: 'nodes', label: 'Nodes', icon: Boxes },
  { id: 'properties', label: 'Properties', icon: Settings2 },
  { id: 'controls', label: 'Controls', icon: SlidersHorizontal },
]

function selectCategory(category: NodeCategory | null) {
  nodesStore.setCategoryFilter(category)
}

const categories = computed(() => {
  return Object.entries(categoryMeta) as [NodeCategory, typeof categoryMeta[NodeCategory]][]
})
</script>

<template>
  <aside class="app-sidebar" :style="sidebarStyle">
    <div class="sidebar-content" v-if="uiStore.sidebarOpen">
      <!-- Panel Tabs -->
      <div class="sidebar-tabs">
        <button
          v-for="panel in panels"
          :key="panel.id"
          class="sidebar-tab"
          :class="{ active: uiStore.sidebarPanel === panel.id }"
          @click="uiStore.setSidebarPanel(panel.id)"
        >
          <component :is="panel.icon" />
        </button>
      </div>

      <!-- Nodes Panel -->
      <div v-if="uiStore.sidebarPanel === 'nodes'" class="sidebar-panel">
        <div class="search-wrapper">
          <Search class="search-icon" />
          <input
            type="text"
            class="search-input"
            placeholder="Search nodes..."
            :value="nodesStore.searchQuery"
            @input="nodesStore.setSearchQuery(($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="category-list">
          <button
            class="category-item"
            :class="{ active: nodesStore.categoryFilter === null }"
            @click="selectCategory(null)"
          >
            <span class="category-color" style="background: var(--color-neutral-400)" />
            <span class="category-label">All Nodes</span>
          </button>

          <button
            v-for="[id, meta] in categories"
            :key="id"
            class="category-item"
            :class="{ active: nodesStore.categoryFilter === id }"
            @click="selectCategory(id)"
          >
            <span class="category-color" :style="{ background: meta.color }" />
            <span class="category-label">{{ meta.label }}</span>
          </button>
        </div>

        <div class="node-list">
          <div
            v-for="node in nodesStore.filteredDefinitions"
            :key="node.id"
            class="node-item"
            draggable="true"
            @dragstart="(e) => {
              e.dataTransfer?.setData('application/clasp-node', node.id)
            }"
          >
            <span
              class="node-item-color"
              :style="{ background: categoryMeta[node.category]?.color ?? '#6B7280' }"
            />
            <span class="node-item-name">{{ node.name }}</span>
          </div>

          <div v-if="nodesStore.filteredDefinitions.length === 0" class="no-results">
            No nodes found
          </div>
        </div>
      </div>

      <!-- Properties Panel -->
      <div v-else-if="uiStore.sidebarPanel === 'properties'" class="sidebar-panel">
        <div class="panel-placeholder">
          <p>Select a node to view properties</p>
        </div>
      </div>

      <!-- Controls Panel -->
      <div v-else-if="uiStore.sidebarPanel === 'controls'" class="sidebar-panel">
        <div class="panel-placeholder">
          <p>No exposed controls</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  background: var(--color-neutral-0);
  border-right: 1px solid var(--color-neutral-200);
  overflow: hidden;
  transition: width var(--transition-default);
  flex-shrink: 0;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: var(--sidebar-width);
}

.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-neutral-200);
  background: var(--color-neutral-50);
}

.sidebar-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3);
  color: var(--color-neutral-500);
  border: none;
  background: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sidebar-tab:hover {
  color: var(--color-neutral-900);
  background: var(--color-neutral-100);
}

.sidebar-tab.active {
  color: var(--color-primary-400);
  background: var(--color-neutral-0);
  box-shadow: inset 0 -2px 0 var(--color-primary-400);
}

.sidebar-tab svg {
  width: 18px;
  height: 18px;
}

.sidebar-panel {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.search-wrapper {
  position: relative;
  padding: var(--space-3);
  border-bottom: 1px solid var(--color-neutral-100);
}

.search-icon {
  position: absolute;
  left: calc(var(--space-3) + var(--space-3));
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-neutral-400);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--space-2) var(--space-3) var(--space-2) calc(var(--space-3) + 24px);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-none);
  background: var(--color-neutral-50);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary-400);
  background: var(--color-neutral-0);
}

.category-list {
  padding: var(--space-2);
  border-bottom: 1px solid var(--color-neutral-100);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.category-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--color-neutral-600);
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-item:hover {
  background: var(--color-neutral-100);
}

.category-item.active {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
}

.category-color {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.category-label {
  white-space: nowrap;
}

.node-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
}

.node-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-700);
  cursor: grab;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.node-item:hover {
  background: var(--color-neutral-100);
}

.node-item:active {
  cursor: grabbing;
}

.node-item-color {
  width: 4px;
  height: 16px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.node-item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-results {
  padding: var(--space-4);
  text-align: center;
  color: var(--color-neutral-400);
  font-size: var(--font-size-sm);
}

.panel-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-400);
  font-size: var(--font-size-sm);
}
</style>
