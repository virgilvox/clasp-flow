<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export interface EnvelopeData {
  attack: number   // 0-2 seconds
  decay: number    // 0-2 seconds
  sustain: number  // 0-1 level
  release: number  // 0-5 seconds
}

const props = withDefaults(defineProps<{
  modelValue: EnvelopeData
  width?: number
  height?: number
  accentColor?: string
}>(), {
  width: 200,
  height: 100,
  accentColor: '#ff6b35',
})

const emit = defineEmits<{
  'update:modelValue': [value: EnvelopeData]
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const isDragging = ref<'attack' | 'decay' | 'sustain' | 'release' | null>(null)

// Time scale configuration
const MAX_ATTACK = 2
const MAX_DECAY = 2
const MAX_RELEASE = 5
const TOTAL_TIME = MAX_ATTACK + MAX_DECAY + MAX_RELEASE

// Convert envelope values to pixel positions
const controlPoints = computed(() => {
  const w = props.width
  const h = props.height
  const padding = 12

  // Time positions normalized to width
  const attackEnd = padding + (props.modelValue.attack / TOTAL_TIME) * (w - padding * 2)
  const decayEnd = attackEnd + (props.modelValue.decay / TOTAL_TIME) * (w - padding * 2)
  const sustainWidth = (w - padding * 2) * 0.2 // Fixed sustain width for display
  const sustainEnd = decayEnd + sustainWidth
  const releaseEnd = w - padding

  // Vertical positions
  const top = padding
  const bottom = h - padding
  const sustainLevel = top + (1 - props.modelValue.sustain) * (bottom - top)

  return {
    start: { x: padding, y: bottom },
    attack: { x: attackEnd, y: top },
    decay: { x: decayEnd, y: sustainLevel },
    sustain: { x: sustainEnd, y: sustainLevel },
    release: { x: releaseEnd, y: bottom },
    padding,
    top,
    bottom,
  }
})

function draw() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const w = props.width
  const h = props.height
  const dpr = window.devicePixelRatio || 1

  canvas.value.width = w * dpr
  canvas.value.height = h * dpr
  canvas.value.style.width = w + 'px'
  canvas.value.style.height = h + 'px'
  ctx.scale(dpr, dpr)

  ctx.clearRect(0, 0, w, h)

  // Background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, w, h)

  // Grid lines
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = controlPoints.value.padding + (i / 4) * (h - controlPoints.value.padding * 2)
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }

  const pts = controlPoints.value

  // Draw envelope curve
  ctx.beginPath()
  ctx.moveTo(pts.start.x, pts.start.y)
  ctx.lineTo(pts.attack.x, pts.attack.y)
  ctx.lineTo(pts.decay.x, pts.decay.y)
  ctx.lineTo(pts.sustain.x, pts.sustain.y)
  ctx.lineTo(pts.release.x, pts.release.y)
  ctx.strokeStyle = props.accentColor
  ctx.lineWidth = 2
  ctx.stroke()

  // Fill under curve
  ctx.lineTo(pts.release.x, pts.bottom)
  ctx.lineTo(pts.start.x, pts.bottom)
  ctx.closePath()
  ctx.fillStyle = props.accentColor + '20'
  ctx.fill()

  // Draw control points
  const drawPoint = (x: number, y: number, isActive: boolean) => {
    ctx.beginPath()
    ctx.arc(x, y, isActive ? 7 : 5, 0, Math.PI * 2)
    ctx.fillStyle = isActive ? props.accentColor : '#1a1a1a'
    ctx.fill()
    ctx.strokeStyle = props.accentColor
    ctx.lineWidth = 2
    ctx.stroke()
  }

  drawPoint(pts.attack.x, pts.attack.y, isDragging.value === 'attack')
  drawPoint(pts.decay.x, pts.decay.y, isDragging.value === 'decay')
  drawPoint(pts.sustain.x, pts.sustain.y, isDragging.value === 'sustain')

  // Labels
  ctx.fillStyle = '#666'
  ctx.font = '9px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('A', pts.attack.x, h - 2)
  ctx.fillText('D', pts.decay.x, h - 2)
  ctx.fillText('S', pts.sustain.x, h - 2)
  ctx.fillText('R', pts.release.x, h - 2)
}

function hitTest(x: number, y: number): 'attack' | 'decay' | 'sustain' | 'release' | null {
  const pts = controlPoints.value
  const threshold = 12

  const dist = (px: number, py: number) => Math.sqrt((x - px) ** 2 + (y - py) ** 2)

  if (dist(pts.attack.x, pts.attack.y) < threshold) return 'attack'
  if (dist(pts.decay.x, pts.decay.y) < threshold) return 'decay'
  if (dist(pts.sustain.x, pts.sustain.y) < threshold) return 'sustain'

  return null
}

function onMouseDown(e: MouseEvent) {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const hit = hitTest(x, y)
  if (hit) {
    isDragging.value = hit
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    e.preventDefault()
  }
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value || !canvas.value) return

  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const w = props.width
  const h = props.height
  const padding = controlPoints.value.padding

  // Normalize positions
  const normX = Math.max(0, Math.min(1, (x - padding) / (w - padding * 2)))
  const normY = Math.max(0, Math.min(1, (y - padding) / (h - padding * 2)))

  const newValue = { ...props.modelValue }

  switch (isDragging.value) {
    case 'attack':
      // Attack controls horizontal position (time)
      newValue.attack = normX * MAX_ATTACK
      break
    case 'decay': {
      // Decay position is relative to attack end
      const attackNorm = props.modelValue.attack / TOTAL_TIME
      const decayNorm = Math.max(attackNorm, normX) - attackNorm
      newValue.decay = decayNorm * TOTAL_TIME
      newValue.decay = Math.min(MAX_DECAY, Math.max(0.001, newValue.decay))
      // Sustain level from Y position
      newValue.sustain = 1 - normY
      break
    }
    case 'sustain':
      // Only Y affects sustain level
      newValue.sustain = 1 - normY
      break
  }

  // Clamp values
  newValue.attack = Math.max(0.001, Math.min(MAX_ATTACK, newValue.attack))
  newValue.decay = Math.max(0.001, Math.min(MAX_DECAY, newValue.decay))
  newValue.sustain = Math.max(0, Math.min(1, newValue.sustain))
  newValue.release = Math.max(0.001, Math.min(MAX_RELEASE, newValue.release))

  emit('update:modelValue', newValue)
}

function onMouseUp() {
  isDragging.value = null
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

// Wheel to adjust release
function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY < 0 ? 0.1 : -0.1
  const newRelease = Math.max(0.001, Math.min(MAX_RELEASE, props.modelValue.release + delta))
  emit('update:modelValue', { ...props.modelValue, release: newRelease })
}

watch(() => props.modelValue, draw, { deep: true })

onMounted(() => {
  draw()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <div class="envelope-editor">
    <canvas
      ref="canvas"
      class="envelope-canvas"
      @mousedown="onMouseDown"
      @wheel="onWheel"
    />
    <div class="envelope-values">
      <span>A: {{ modelValue.attack.toFixed(2) }}s</span>
      <span>D: {{ modelValue.decay.toFixed(2) }}s</span>
      <span>S: {{ (modelValue.sustain * 100).toFixed(0) }}%</span>
      <span>R: {{ modelValue.release.toFixed(2) }}s</span>
    </div>
  </div>
</template>

<style scoped>
.envelope-editor {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.envelope-canvas {
  border: 1px solid #333;
  border-radius: 4px;
  cursor: crosshair;
}

.envelope-values {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono, 'SF Mono', Monaco, monospace);
  font-size: 9px;
  color: #666;
}
</style>
