<script setup lang="ts">
import { computed, ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'
import { ChevronDown, ChevronRight, TrendingUp } from 'lucide-vue-next'
import { categoryMeta, dataTypeMeta, type NodeDefinition, useNodesStore } from '@/stores/nodes'
import { useFlowsStore } from '@/stores/flows'
import EnvelopeEditor from '@/components/controls/EnvelopeEditor.vue'
import type { EnvelopeData } from '@/components/controls/EnvelopeEditor.vue'

const props = defineProps<NodeProps>()
const flowsStore = useFlowsStore()
const nodesStore = useNodesStore()

const isCollapsed = ref(false)
const hoveredPort = ref<string | null>(null)

// Get definition from nodesStore
const definition = computed<NodeDefinition | null>(() => {
  const nodeType = (props.data?.nodeType as string) ?? 'envelope-visual'
  return nodesStore.getDefinition(nodeType) ?? props.data?.definition ?? null
})

const categoryColor = computed(() => {
  if (!definition.value) return 'var(--color-neutral-400)'
  return categoryMeta[definition.value.category]?.color ?? 'var(--color-neutral-400)'
})

const inputs = computed(() => definition.value?.inputs ?? [])
const outputs = computed(() => definition.value?.outputs ?? [])

// Envelope values
const envelopeData = computed<EnvelopeData>({
  get: () => ({
    attack: (props.data?.attack as number) ?? 0.01,
    decay: (props.data?.decay as number) ?? 0.1,
    sustain: (props.data?.sustain as number) ?? 0.5,
    release: (props.data?.release as number) ?? 0.3,
  }),
  set: (value: EnvelopeData) => {
    flowsStore.updateNodeData(props.id, {
      attack: value.attack,
      decay: value.decay,
      sustain: value.sustain,
      release: value.release,
    })
  },
})

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

function getTypeColor(type: string): string {
  return dataTypeMeta[type as keyof typeof dataTypeMeta]?.color ?? 'var(--color-neutral-400)'
}

function updateEnvelope(value: EnvelopeData) {
  envelopeData.value = value
}
</script>

<template>
  <div
    class="envelope-node"
    :class="{ selected: props.selected, collapsed: isCollapsed }"
    :style="{ '--port-count': Math.max(inputs.length, outputs.length, 1) }"
  >
    <!-- Input Handles -->
    <div class="handles-column handles-left">
      <div
        v-for="input in inputs"
        :key="input.id"
        class="handle-slot"
        @mouseenter="hoveredPort = `in-${input.id}`"
        @mouseleave="hoveredPort = null"
      >
        <Handle
          :id="input.id"
          type="target"
          :position="Position.Left"
          :style="{ background: getTypeColor(input.type) }"
          class="port-handle"
        />
        <div
          class="port-label port-label-left"
          :class="{ visible: hoveredPort === `in-${input.id}` || props.selected }"
        >
          <span class="label-text">{{ input.label }}</span>
          <span
            class="label-type"
            :style="{ color: getTypeColor(input.type) }"
          >{{ input.type }}</span>
        </div>
      </div>
    </div>

    <!-- Output Handles -->
    <div class="handles-column handles-right">
      <div
        v-for="output in outputs"
        :key="output.id"
        class="handle-slot"
        @mouseenter="hoveredPort = `out-${output.id}`"
        @mouseleave="hoveredPort = null"
      >
        <Handle
          :id="output.id"
          type="source"
          :position="Position.Right"
          :style="{ background: getTypeColor(output.type) }"
          class="port-handle"
        />
        <div
          class="port-label port-label-right"
          :class="{ visible: hoveredPort === `out-${output.id}` || props.selected }"
        >
          <span class="label-text">{{ output.label }}</span>
          <span
            class="label-type"
            :style="{ color: getTypeColor(output.type) }"
          >{{ output.type }}</span>
        </div>
      </div>
    </div>

    <!-- Node Content -->
    <div class="node-content">
      <!-- Header -->
      <div
        class="node-header"
        :style="{ borderLeftColor: categoryColor }"
      >
        <TrendingUp
          :size="14"
          class="header-icon"
        />
        <span class="node-title">Envelope</span>
        <button
          class="node-collapse-btn"
          @click.stop="toggleCollapse"
        >
          <ChevronDown
            v-if="!isCollapsed"
            :size="14"
          />
          <ChevronRight
            v-else
            :size="14"
          />
        </button>
      </div>

      <!-- Body -->
      <div
        v-if="!isCollapsed"
        class="node-body"
      >
        <!-- Envelope Editor -->
        <div
          class="envelope-container"
          @mousedown.stop
        >
          <EnvelopeEditor
            :model-value="envelopeData"
            :width="180"
            :height="80"
            accent-color="#22c55e"
            @update:model-value="updateEnvelope"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.envelope-node {
  position: relative;
  min-width: 200px;
  font-family: var(--font-mono);
  min-height: calc(32px + (var(--port-count, 1) * 20px));
}

/* Node content - the visible box */
.node-content {
  background: var(--color-neutral-0);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-default);
  box-shadow: 3px 3px 0 0 var(--color-neutral-300);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
  overflow: hidden;
}

.envelope-node.selected .node-content {
  border-color: var(--color-primary-400);
  box-shadow: 4px 4px 0 0 var(--color-primary-200);
}

.envelope-node:hover .node-content {
  box-shadow: 4px 4px 0 0 var(--color-neutral-400);
}

/* Handle columns */
.handles-column {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 2px;
  z-index: 10;
  padding-top: 16px;
}

.handles-left {
  left: 0;
}

.handles-right {
  right: 0;
}

.envelope-node.collapsed .handles-column {
  justify-content: center;
  padding-top: 0;
  gap: 0;
}

.envelope-node.collapsed .handle-slot {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: auto;
}

.envelope-node.collapsed .port-label {
  display: none;
}

.handle-slot {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

/* Port labels */
.port-label {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  font-size: 9px;
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-600);
  background: var(--color-neutral-0);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid var(--color-neutral-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 1000;
}

.port-label.visible {
  opacity: 1;
}

.port-label-left {
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.port-label-right {
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.label-text {
  color: var(--color-neutral-600);
}

.label-type {
  font-weight: var(--font-weight-bold);
  text-transform: lowercase;
  opacity: 0.85;
}

/* Header */
.node-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-200);
  border-left: 3px solid var(--color-neutral-400);
  border-radius: var(--radius-default) var(--radius-default) 0 0;
}

.envelope-node.collapsed .node-header {
  border-radius: var(--radius-default);
  border-bottom: none;
}

.header-icon {
  color: #22c55e;
}

.node-title {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-neutral-800);
}

.node-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  background: none;
  border: none;
  color: var(--color-neutral-400);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.node-collapse-btn:hover {
  color: var(--color-neutral-600);
}

/* Body */
.node-body {
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.envelope-container {
  display: flex;
  justify-content: center;
}

/* Handle styles */
:deep(.port-handle) {
  width: var(--node-port-size, 10px) !important;
  height: var(--node-port-size, 10px) !important;
  border: 2px solid var(--color-neutral-0) !important;
  border-radius: 50% !important;
  position: absolute !important;
}

:deep(.port-handle:hover) {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

:deep(.vue-flow__handle-left) {
  left: calc(var(--node-port-size, 10px) / -2) !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

:deep(.vue-flow__handle-right) {
  right: calc(var(--node-port-size, 10px) / -2) !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}
</style>
