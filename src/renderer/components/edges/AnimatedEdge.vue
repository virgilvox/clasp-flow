<script setup lang="ts">
import { computed } from 'vue'
import { getSmoothStepPath, BaseEdge } from '@vue-flow/core'
import type { EdgeProps, Position } from '@vue-flow/core'
import { useRuntimeStore } from '@/stores/runtime'

const props = defineProps<EdgeProps>()
const runtimeStore = useRuntimeStore()

// Calculate the path for the edge
const pathData = computed(() => {
  return getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition as Position,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition as Position,
    borderRadius: 8,
  })
})

const isAnimated = computed(() => runtimeStore.isRunning)
const isSelected = computed(() => props.selected)
</script>

<template>
  <g class="edge-group" :class="{ selected: isSelected }">
    <!-- Invisible wider path for easier clicking -->
    <path
      :d="pathData[0]"
      fill="none"
      stroke="transparent"
      stroke-width="20"
      class="edge-interaction-area"
    />

    <!-- Selection highlight (behind main edge) -->
    <path
      v-if="isSelected"
      :d="pathData[0]"
      fill="none"
      stroke="var(--color-primary-300)"
      stroke-width="6"
      stroke-linecap="round"
      class="edge-selection"
    />

    <!-- Main edge -->
    <BaseEdge
      :id="id"
      :path="pathData[0]"
      :marker-end="markerEnd"
      :style="{
        stroke: isSelected ? 'var(--color-primary-500)' : 'var(--color-primary-400)',
        strokeWidth: isSelected ? 3 : 2,
      }"
    />

    <!-- Animated particle overlay when running -->
    <path
      v-if="isAnimated"
      :d="pathData[0]"
      fill="none"
      stroke="var(--color-primary-200)"
      stroke-width="4"
      stroke-linecap="round"
      class="edge-animation"
    />
  </g>
</template>

<style scoped>
.edge-group {
  cursor: pointer;
}

.edge-interaction-area {
  pointer-events: stroke;
}

.edge-group:hover :deep(.vue-flow__edge-path) {
  stroke: var(--color-primary-500);
  stroke-width: 3;
}

.edge-selection {
  opacity: 0.4;
}

.edge-group.selected :deep(.vue-flow__edge-path) {
  stroke: var(--color-primary-500);
}

.edge-animation {
  stroke-dasharray: 8 8;
  animation: flow 0.5s linear infinite;
  pointer-events: none;
}

@keyframes flow {
  from {
    stroke-dashoffset: 16;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>
