<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'
import { ChevronDown } from 'lucide-vue-next'
import { categoryMeta, dataTypeMeta, type NodeDefinition } from '@/stores/nodes'

const props = defineProps<NodeProps>()

const definition = computed<NodeDefinition | null>(() => {
  return props.data?.definition ?? null
})

const nodeLabel = computed(() => {
  return props.data?.label ?? props.data?.nodeType ?? 'Node'
})

const categoryColor = computed(() => {
  if (!definition.value) return 'var(--color-neutral-400)'
  return categoryMeta[definition.value.category]?.color ?? 'var(--color-neutral-400)'
})

const inputs = computed(() => definition.value?.inputs ?? [])
const outputs = computed(() => definition.value?.outputs ?? [])

function getTypeColor(type: string): string {
  return dataTypeMeta[type as keyof typeof dataTypeMeta]?.color ?? 'var(--color-neutral-400)'
}
</script>

<template>
  <div
    class="base-node"
    :class="{
      selected: props.selected,
    }"
  >
    <!-- Header -->
    <div class="node-header" :style="{ borderLeftColor: categoryColor }">
      <span class="node-title">{{ nodeLabel }}</span>
      <button class="node-collapse-btn">
        <ChevronDown />
      </button>
    </div>

    <!-- Body -->
    <div class="node-body">
      <!-- Inputs -->
      <div class="node-ports node-inputs">
        <div
          v-for="input in inputs"
          :key="input.id"
          class="node-port"
        >
          <Handle
            :id="input.id"
            type="target"
            :position="Position.Left"
            :style="{ background: getTypeColor(input.type) }"
            class="port-handle"
          />
          <span class="port-label">{{ input.label }}</span>
        </div>
      </div>

      <!-- Outputs -->
      <div class="node-ports node-outputs">
        <div
          v-for="output in outputs"
          :key="output.id"
          class="node-port"
        >
          <span class="port-label">{{ output.label }}</span>
          <Handle
            :id="output.id"
            type="source"
            :position="Position.Right"
            :style="{ background: getTypeColor(output.type) }"
            class="port-handle"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-node {
  min-width: var(--node-min-width);
  max-width: var(--node-max-width);
  background: var(--color-neutral-0);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-default);
  box-shadow: 3px 3px 0 0 var(--color-neutral-300);
  font-family: var(--font-mono);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.base-node.selected {
  border-color: var(--color-primary-400);
  box-shadow: 4px 4px 0 0 var(--color-primary-200);
}

.base-node:hover {
  box-shadow: 4px 4px 0 0 var(--color-neutral-400);
}

.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-200);
  border-left: 3px solid var(--color-neutral-400);
  border-radius: var(--radius-default) var(--radius-default) 0 0;
}

.node-title {
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
  width: 20px;
  height: 20px;
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

.node-collapse-btn svg {
  width: 14px;
  height: 14px;
}

.node-body {
  padding: var(--space-3);
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
}

.node-ports {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.node-inputs {
  align-items: flex-start;
}

.node-outputs {
  align-items: flex-end;
}

.node-port {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  position: relative;
}

.port-label {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-500);
  white-space: nowrap;
}

.node-inputs .port-label {
  margin-left: var(--space-2);
}

.node-outputs .port-label {
  margin-right: var(--space-2);
}

/* Handle styles */
:deep(.port-handle) {
  width: var(--node-port-size) !important;
  height: var(--node-port-size) !important;
  border: 2px solid var(--color-neutral-0) !important;
  border-radius: var(--radius-full) !important;
}

:deep(.vue-flow__handle-left) {
  left: calc(var(--node-port-size) / -2 - 1px) !important;
}

:deep(.vue-flow__handle-right) {
  right: calc(var(--node-port-size) / -2 - 1px) !important;
}
</style>
