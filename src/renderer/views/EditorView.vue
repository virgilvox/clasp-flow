<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { VueFlow, useVueFlow, Panel } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import type { Connection } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

import { useFlowsStore } from '@/stores/flows'
import { useUIStore } from '@/stores/ui'
import { useNodesStore } from '@/stores/nodes'
import BaseNode from '@/components/nodes/BaseNode.vue'

const flowsStore = useFlowsStore()
const uiStore = useUIStore()
const nodesStore = useNodesStore()

const {
  onConnect,
  addEdges,
  onNodeDragStop,
  onPaneReady,
  project,
  fitView,
  setViewport,
  getViewport,
} = useVueFlow()

// Node types
const nodeTypes = {
  default: BaseNode,
  custom: BaseNode,
}

// Create initial flow if none exists
onMounted(() => {
  if (!flowsStore.activeFlow) {
    flowsStore.createFlow('My First Flow')
  }

  // Register some demo nodes
  registerDemoNodes()
})

function registerDemoNodes() {
  nodesStore.register({
    id: 'constant',
    name: 'Constant',
    version: '1.0.0',
    category: 'inputs',
    description: 'Output a constant value',
    icon: 'hash',
    platforms: ['web', 'electron'],
    inputs: [],
    outputs: [{ id: 'value', type: 'number', label: 'Value' }],
    controls: [
      { id: 'value', type: 'number', label: 'Value', default: 0, exposable: true },
    ],
  })

  nodesStore.register({
    id: 'monitor',
    name: 'Monitor',
    version: '1.0.0',
    category: 'debug',
    description: 'Display input values',
    icon: 'eye',
    platforms: ['web', 'electron'],
    inputs: [{ id: 'value', type: 'any', label: 'Value' }],
    outputs: [],
    controls: [],
  })

  nodesStore.register({
    id: 'map-range',
    name: 'Map Range',
    version: '1.0.0',
    category: 'math',
    description: 'Remap a value from one range to another',
    icon: 'arrow-right-left',
    platforms: ['web', 'electron'],
    inputs: [{ id: 'value', type: 'number', label: 'Value', required: true }],
    outputs: [{ id: 'result', type: 'number', label: 'Result' }],
    controls: [
      { id: 'inMin', type: 'number', label: 'In Min', default: 0 },
      { id: 'inMax', type: 'number', label: 'In Max', default: 1 },
      { id: 'outMin', type: 'number', label: 'Out Min', default: 0 },
      { id: 'outMax', type: 'number', label: 'Out Max', default: 100 },
    ],
  })

  nodesStore.register({
    id: 'trigger',
    name: 'Trigger',
    version: '1.0.0',
    category: 'inputs',
    description: 'Manual trigger button',
    icon: 'zap',
    platforms: ['web', 'electron'],
    inputs: [],
    outputs: [{ id: 'trigger', type: 'trigger', label: 'Trigger' }],
    controls: [
      { id: 'value', type: 'toggle', label: 'Value', default: false },
    ],
  })

  nodesStore.register({
    id: 'slider',
    name: 'Slider',
    version: '1.0.0',
    category: 'inputs',
    description: 'Slider control (0-1)',
    icon: 'sliders-horizontal',
    platforms: ['web', 'electron'],
    inputs: [],
    outputs: [{ id: 'value', type: 'number', label: 'Value' }],
    controls: [
      { id: 'value', type: 'slider', label: 'Value', default: 0.5, exposable: true, props: { min: 0, max: 1, step: 0.01 } },
    ],
  })

  nodesStore.register({
    id: 'audio-input',
    name: 'Audio Input',
    version: '1.0.0',
    category: 'audio',
    description: 'Capture audio from microphone',
    icon: 'mic',
    platforms: ['web', 'electron'],
    inputs: [],
    outputs: [
      { id: 'audio', type: 'audio', label: 'Audio' },
      { id: 'level', type: 'number', label: 'Level' },
      { id: 'beat', type: 'trigger', label: 'Beat' },
    ],
    controls: [
      { id: 'source', type: 'select', label: 'Source', default: 'default' },
    ],
  })
}

// Handle connections
onConnect((connection: Connection) => {
  addEdges([connection])
  if (flowsStore.activeFlow) {
    flowsStore.addEdge(
      connection.source,
      connection.sourceHandle ?? '',
      connection.target,
      connection.targetHandle ?? ''
    )
  }
})

// Handle node drag
onNodeDragStop(({ node }) => {
  flowsStore.updateNodePosition(node.id, node.position)
})

// Handle drop from sidebar
function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

function onDrop(event: DragEvent) {
  const nodeType = event.dataTransfer?.getData('application/clasp-node')
  if (!nodeType) return

  const definition = nodesStore.getDefinition(nodeType)
  if (!definition) return

  // Get drop position in flow coordinates
  const { left, top } = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  })

  // Add node
  flowsStore.addNode(nodeType, position, {
    label: definition.name,
    nodeType: nodeType,
    definition: definition,
  })
}

// Sync zoom with UI store
watch(
  () => uiStore.zoom,
  (zoom) => {
    const viewport = getViewport()
    setViewport({ ...viewport, zoom })
  }
)

// Fit view on pane ready
onPaneReady(() => {
  if (flowsStore.activeNodes.length > 0) {
    fitView({ padding: 0.2 })
  }
})
</script>

<template>
  <div class="editor-view">
    <VueFlow
      v-model:nodes="flowsStore.activeFlow!.nodes"
      v-model:edges="flowsStore.activeFlow!.edges"
      :node-types="nodeTypes"
      :default-edge-options="{
        type: 'smoothstep',
        style: { stroke: 'var(--color-primary-400)', strokeWidth: 2 },
        animated: false,
      }"
      :snap-to-grid="uiStore.snapToGrid"
      :snap-grid="[uiStore.gridSize, uiStore.gridSize]"
      :connection-line-style="{ stroke: 'var(--color-primary-400)', strokeWidth: 2 }"
      fit-view-on-init
      class="flow-canvas"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <Background
        v-if="uiStore.showGrid"
        :gap="uiStore.gridSize"
        :size="1"
        pattern-color="var(--color-neutral-300)"
      />

      <Controls
        position="bottom-right"
        :show-zoom="true"
        :show-fit-view="true"
        :show-interactive="false"
      />

      <MiniMap
        v-if="uiStore.showMinimap"
        position="bottom-right"
        :style="{ marginBottom: '50px' }"
        :pannable="true"
        :zoomable="true"
      />

      <Panel position="top-right" class="canvas-panel">
        <div class="panel-info">
          <span>{{ flowsStore.activeNodes.length }} nodes</span>
          <span>{{ flowsStore.activeEdges.length }} connections</span>
        </div>
      </Panel>
    </VueFlow>

    <!-- Empty state -->
    <div
      v-if="flowsStore.activeNodes.length === 0"
      class="empty-state"
    >
      <p>Drag nodes from the sidebar to get started</p>
    </div>
  </div>
</template>

<style scoped>
.editor-view {
  width: 100%;
  height: 100%;
  position: relative;
}

.flow-canvas {
  width: 100%;
  height: 100%;
  background: var(--canvas-background);
}

/* Override Vue Flow styles */
.flow-canvas :deep(.vue-flow__background) {
  background: var(--canvas-background);
}

.flow-canvas :deep(.vue-flow__controls) {
  box-shadow: var(--shadow-subtle);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-none);
}

.flow-canvas :deep(.vue-flow__controls-button) {
  background: var(--color-neutral-0);
  border: none;
  border-bottom: 1px solid var(--color-neutral-200);
}

.flow-canvas :deep(.vue-flow__controls-button:hover) {
  background: var(--color-neutral-100);
}

.flow-canvas :deep(.vue-flow__minimap) {
  background: var(--color-neutral-0);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-none);
  box-shadow: var(--shadow-subtle);
}

.canvas-panel {
  background: var(--color-neutral-0);
  border: 1px solid var(--color-neutral-200);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
}

.panel-info {
  display: flex;
  gap: var(--space-4);
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--color-neutral-400);
  font-size: var(--font-size-base);
  pointer-events: none;
}
</style>
