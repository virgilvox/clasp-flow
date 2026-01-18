<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRuntimeStore } from '@/stores/runtime'
import { getShaderRenderer } from '@/services/visual/ShaderRenderer'

const props = withDefaults(defineProps<{
  nodeId: string
  width?: number
  height?: number
  showPlaceholder?: boolean
}>(), {
  width: 128,
  height: 96,
  showPlaceholder: true,
})

const runtimeStore = useRuntimeStore()
const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const hasTexture = ref(false)

// Get the texture from node outputs
const textureOutput = computed(() => {
  const metrics = runtimeStore.nodeMetrics.get(props.nodeId)
  if (!metrics?.outputValues) return null

  // Check for 'texture' or '_display' outputs
  return metrics.outputValues['texture'] ?? metrics.outputValues['_display'] ?? null
})

// Update preview from WebGL texture
function updatePreview() {
  if (!canvas.value || !ctx.value) return

  const texture = textureOutput.value

  if (!texture) {
    hasTexture.value = false
    // Clear to show placeholder
    ctx.value.fillStyle = '#1a1a1a'
    ctx.value.fillRect(0, 0, props.width, props.height)

    if (props.showPlaceholder) {
      ctx.value.fillStyle = '#666'
      ctx.value.font = '10px monospace'
      ctx.value.textAlign = 'center'
      ctx.value.fillText('No texture', props.width / 2, props.height / 2)
    }
    return
  }

  hasTexture.value = true

  // If it's already a canvas element, draw it directly
  if (texture instanceof HTMLCanvasElement) {
    ctx.value.drawImage(texture, 0, 0, props.width, props.height)
    return
  }

  // If it's a WebGL texture, we need to read from the shader renderer
  if (texture instanceof WebGLTexture) {
    const renderer = getShaderRenderer()
    const sourceCanvas = renderer.getCanvas()

    // Draw the renderer's canvas to our preview canvas
    ctx.value.drawImage(sourceCanvas, 0, 0, props.width, props.height)
  }
}

// Animation loop for continuous updates
let animationFrame: number | null = null

function startUpdateLoop() {
  const loop = () => {
    if (runtimeStore.isRunning) {
      updatePreview()
    }
    animationFrame = requestAnimationFrame(loop)
  }
  loop()
}

function stopUpdateLoop() {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    updatePreview()
    startUpdateLoop()
  }
})

onUnmounted(() => {
  stopUpdateLoop()
})

// Update when node changes
watch(() => props.nodeId, () => {
  updatePreview()
})

// Update when runtime status changes
watch(() => runtimeStore.isRunning, (running) => {
  if (!running) {
    updatePreview()
  }
})
</script>

<template>
  <div class="texture-preview" :style="{ width: `${width}px`, height: `${height}px` }">
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
      class="preview-canvas"
    />
    <div v-if="!hasTexture && showPlaceholder" class="placeholder">
      <span>No texture</span>
    </div>
  </div>
</template>

<style scoped>
.texture-preview {
  position: relative;
  background: var(--color-neutral-900);
  border: 1px solid var(--color-neutral-700);
  overflow: hidden;
}

.preview-canvas {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-500);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  pointer-events: none;
}
</style>
