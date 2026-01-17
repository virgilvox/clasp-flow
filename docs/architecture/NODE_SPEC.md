# CLASP Flow - Node Specification

**Document Version**: 1.0
**Last Updated**: 2026-01-17

---

## Overview

This document defines the specification for creating nodes in CLASP Flow. Nodes are the fundamental building blocks of any flow, representing operations that transform, generate, or consume data.

---

## Node Definition Schema

### Complete Definition

```typescript
interface NodeDefinition {
  // Identity
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Display name
  version: string;               // Semantic version
  author?: string;               // Author/creator

  // Classification
  category: NodeCategory;        // Category for organization
  tags?: string[];               // Search tags
  description: string;           // Brief description
  documentation?: string;        // Extended markdown documentation

  // Visual
  icon: string;                  // Lucide icon name or custom SVG
  color?: string;                // Override category color

  // Platform
  platforms: Platform[];         // Where node can run
  webFallback?: string;          // Alternative node ID for web

  // Ports
  inputs: PortDefinition[];      // Input ports
  outputs: PortDefinition[];     // Output ports

  // Controls
  controls: ControlDefinition[]; // User-adjustable parameters

  // Implementation
  executor: string;              // Executor class name
  ui?: string;                   // Custom Vue component (optional)

  // Execution
  executionMode: ExecutionMode;  // How node is triggered
  workerEnabled?: boolean;       // Can run in worker thread
}

type NodeCategory =
  | 'debug'
  | 'inputs'
  | 'outputs'
  | 'math'
  | 'logic'
  | 'audio'
  | 'video'
  | 'shaders'
  | 'data'
  | 'ai'
  | 'code'
  | '3d'
  | 'connectivity'
  | 'custom';

type Platform = 'web' | 'electron';

type ExecutionMode =
  | 'continuous'   // Runs every frame
  | 'triggered'    // Runs when trigger input fires
  | 'reactive';    // Runs when any input changes
```

### Port Definition

```typescript
interface PortDefinition {
  id: string;                    // Unique within node
  type: DataType;                // Data type
  label: string;                 // Display label
  description?: string;          // Tooltip text

  // Behavior
  required?: boolean;            // Must be connected (default: false)
  multiple?: boolean;            // Allow multiple connections (default: false)
  default?: any;                 // Default value when not connected

  // Validation
  min?: number;                  // For numeric types
  max?: number;                  // For numeric types
  options?: string[];            // For enum/select types
}

type DataType =
  | 'trigger'    // Event signal (no data)
  | 'number'     // Numeric value
  | 'string'     // Text
  | 'boolean'    // True/false
  | 'audio'      // AudioBuffer or stream
  | 'video'      // VideoFrame or stream
  | 'texture'    // WebGL texture
  | 'data'       // JSON object
  | 'array'      // Array of values
  | 'any';       // Any type (universal)
```

### Control Definition

```typescript
interface ControlDefinition {
  id: string;                    // Unique within node
  type: ControlType;             // Control widget type
  label: string;                 // Display label
  description?: string;          // Tooltip text

  // Value
  default?: any;                 // Default value

  // Behavior
  exposable?: boolean;           // Can appear in control panel
  bindable?: boolean;            // Can be overridden by input port

  // Type-specific properties
  props?: ControlProps;
}

type ControlType =
  | 'number'     // Numeric input
  | 'slider'     // Range slider
  | 'knob'       // Rotary knob
  | 'xy-pad'     // 2D position
  | 'select'     // Dropdown
  | 'toggle'     // Boolean switch
  | 'button'     // Trigger button
  | 'text'       // Text input
  | 'textarea'   // Multi-line text
  | 'code'       // Code editor
  | 'color'      // Color picker
  | 'file'       // File selector
  | 'image'      // Image preview
  | 'meter'      // Read-only meter
  | 'waveform'   // Audio waveform display
  | 'custom';    // Custom Vue component

interface ControlProps {
  // Number/Slider/Knob
  min?: number;
  max?: number;
  step?: number;
  unit?: string;

  // Select
  options?: SelectOption[];

  // Code
  language?: string;
  height?: number;

  // File
  accept?: string;
  multiple?: boolean;

  // Custom
  component?: string;
}

interface SelectOption {
  value: any;
  label: string;
  icon?: string;
}
```

---

## Example Node Definitions

### Simple: Constant Node

```json
{
  "id": "constant",
  "name": "Constant",
  "version": "1.0.0",
  "category": "inputs",
  "description": "Output a constant value",
  "icon": "hash",
  "platforms": ["web", "electron"],
  "inputs": [],
  "outputs": [
    {
      "id": "value",
      "type": "number",
      "label": "Value"
    }
  ],
  "controls": [
    {
      "id": "value",
      "type": "number",
      "label": "Value",
      "default": 0,
      "exposable": true
    }
  ],
  "executor": "ConstantNode",
  "executionMode": "reactive"
}
```

### Medium: Map Range Node

```json
{
  "id": "map-range",
  "name": "Map Range",
  "version": "1.0.0",
  "category": "math",
  "description": "Remap a value from one range to another",
  "icon": "arrow-right-left",
  "platforms": ["web", "electron"],
  "inputs": [
    {
      "id": "value",
      "type": "number",
      "label": "Value",
      "required": true
    }
  ],
  "outputs": [
    {
      "id": "result",
      "type": "number",
      "label": "Result"
    }
  ],
  "controls": [
    {
      "id": "inMin",
      "type": "number",
      "label": "Input Min",
      "default": 0,
      "bindable": true
    },
    {
      "id": "inMax",
      "type": "number",
      "label": "Input Max",
      "default": 1,
      "bindable": true
    },
    {
      "id": "outMin",
      "type": "number",
      "label": "Output Min",
      "default": 0,
      "bindable": true
    },
    {
      "id": "outMax",
      "type": "number",
      "label": "Output Max",
      "default": 1,
      "bindable": true
    },
    {
      "id": "clamp",
      "type": "toggle",
      "label": "Clamp",
      "default": false
    }
  ],
  "executor": "MapRangeNode",
  "executionMode": "reactive"
}
```

### Complex: Audio Input Node

```json
{
  "id": "audio-input",
  "name": "Audio Input",
  "version": "1.0.0",
  "category": "audio",
  "description": "Capture audio from microphone or audio device",
  "icon": "mic",
  "platforms": ["web", "electron"],
  "inputs": [],
  "outputs": [
    {
      "id": "audio",
      "type": "audio",
      "label": "Audio"
    },
    {
      "id": "level",
      "type": "number",
      "label": "Level"
    },
    {
      "id": "bass",
      "type": "number",
      "label": "Bass"
    },
    {
      "id": "mid",
      "type": "number",
      "label": "Mid"
    },
    {
      "id": "treble",
      "type": "number",
      "label": "Treble"
    },
    {
      "id": "beat",
      "type": "trigger",
      "label": "Beat"
    }
  ],
  "controls": [
    {
      "id": "source",
      "type": "select",
      "label": "Source",
      "default": "default",
      "props": {
        "options": [
          { "value": "default", "label": "Default Device" }
        ]
      }
    },
    {
      "id": "gain",
      "type": "slider",
      "label": "Gain",
      "default": 1,
      "props": {
        "min": 0,
        "max": 2,
        "step": 0.01
      },
      "exposable": true
    },
    {
      "id": "fftSize",
      "type": "select",
      "label": "FFT Size",
      "default": 2048,
      "props": {
        "options": [
          { "value": 512, "label": "512" },
          { "value": 1024, "label": "1024" },
          { "value": 2048, "label": "2048" },
          { "value": 4096, "label": "4096" }
        ]
      }
    },
    {
      "id": "smoothing",
      "type": "slider",
      "label": "Smoothing",
      "default": 0.8,
      "props": {
        "min": 0,
        "max": 1,
        "step": 0.01
      }
    }
  ],
  "executor": "AudioInputNode",
  "ui": "AudioInputNodeUI",
  "executionMode": "continuous",
  "workerEnabled": false
}
```

### Shader Node

```json
{
  "id": "shader",
  "name": "Shader",
  "version": "1.0.0",
  "category": "shaders",
  "description": "Custom GLSL fragment shader",
  "icon": "code",
  "platforms": ["web", "electron"],
  "inputs": [
    {
      "id": "texture0",
      "type": "texture",
      "label": "Texture 0"
    }
  ],
  "outputs": [
    {
      "id": "texture",
      "type": "texture",
      "label": "Output"
    }
  ],
  "controls": [
    {
      "id": "code",
      "type": "code",
      "label": "Fragment Shader",
      "default": "void main() {\n  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}",
      "props": {
        "language": "glsl",
        "height": 300
      }
    },
    {
      "id": "width",
      "type": "number",
      "label": "Width",
      "default": 1920,
      "props": {
        "min": 1,
        "max": 4096
      }
    },
    {
      "id": "height",
      "type": "number",
      "label": "Height",
      "default": 1080,
      "props": {
        "min": 1,
        "max": 4096
      }
    }
  ],
  "executor": "ShaderNode",
  "ui": "ShaderNodeUI",
  "executionMode": "continuous"
}
```

---

## Node Executor Implementation

### Base Class

```typescript
// src/engine/graph/Node.ts

export abstract class BaseNodeExecutor {
  readonly id: string;
  readonly instanceId: string;
  readonly definition: NodeDefinition;
  protected context: ExecutionContext;
  protected state: Map<string, any> = new Map();
  protected disposed: boolean = false;

  constructor(
    instanceId: string,
    definition: NodeDefinition,
    context: ExecutionContext
  ) {
    this.id = definition.id;
    this.instanceId = instanceId;
    this.definition = definition;
    this.context = context;
  }

  // Lifecycle
  async initialize(): Promise<void> {}
  async dispose(): Promise<void> {
    this.disposed = true;
    this.state.clear();
  }

  // Execution
  abstract execute(inputs: NodeInputs): Promise<NodeOutputs>;

  // Control changes
  onControlChange(controlId: string, value: any): void {
    this.setState(controlId, value);
  }

  // State management
  protected getState<T>(key: string, defaultValue?: T): T {
    return this.state.get(key) ?? defaultValue;
  }

  protected setState(key: string, value: any): void {
    this.state.set(key, value);
  }

  // Utilities
  protected getControlValue(controlId: string, inputs: NodeInputs): any {
    // Input connection takes precedence over control value
    if (inputs.has(controlId)) {
      return inputs.get(controlId);
    }
    return this.getState(controlId);
  }

  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    this.context.logger[level](`[${this.definition.name}:${this.instanceId}] ${message}`);
  }

  protected emit(event: string, data: any): void {
    this.context.messageBus.emit(`node:${this.instanceId}:${event}`, data);
  }
}

type NodeInputs = Map<string, any>;
type NodeOutputs = Map<string, any>;
```

### Example: Map Range Executor

```typescript
// src/nodes/math/MapRangeNode.ts

import { BaseNodeExecutor } from '@engine/graph/Node';

export class MapRangeNode extends BaseNodeExecutor {
  static definition = {
    id: 'map-range',
    // ... full definition
  };

  async execute(inputs: Map<string, any>): Promise<Map<string, any>> {
    const value = inputs.get('value') ?? 0;
    const inMin = this.getControlValue('inMin', inputs) ?? 0;
    const inMax = this.getControlValue('inMax', inputs) ?? 1;
    const outMin = this.getControlValue('outMin', inputs) ?? 0;
    const outMax = this.getControlValue('outMax', inputs) ?? 1;
    const clamp = this.getState('clamp') ?? false;

    // Avoid division by zero
    if (inMax === inMin) {
      return new Map([['result', outMin]]);
    }

    // Map value
    const normalized = (value - inMin) / (inMax - inMin);
    let result = normalized * (outMax - outMin) + outMin;

    // Optionally clamp
    if (clamp) {
      const min = Math.min(outMin, outMax);
      const max = Math.max(outMin, outMax);
      result = Math.max(min, Math.min(max, result));
    }

    return new Map([['result', result]]);
  }
}
```

### Example: Audio Input Executor

```typescript
// src/nodes/audio/AudioInputNode.ts

import { BaseNodeExecutor } from '@engine/graph/Node';
import Meyda from 'meyda';

export class AudioInputNode extends BaseNodeExecutor {
  private stream: MediaStream | null = null;
  private analyser: MeydaAnalyzer | null = null;
  private features: AudioFeatures | null = null;
  private beatDetector: BeatDetector | null = null;

  async initialize(): Promise<void> {
    const deviceId = this.getState('source') ?? 'default';

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId === 'default'
          ? true
          : { deviceId: { exact: deviceId } },
      });

      const audioContext = this.context.audioContext;
      const source = audioContext.createMediaStreamSource(this.stream);

      this.analyser = Meyda.createMeydaAnalyzer({
        audioContext,
        source,
        bufferSize: this.getState('fftSize') ?? 2048,
        featureExtractors: ['rms', 'spectralCentroid', 'energy'],
        callback: (features: AudioFeatures) => {
          this.features = features;
        },
      });

      this.analyser.start();
      this.beatDetector = new BeatDetector(audioContext, source);

      this.log('Audio input initialized');
    } catch (error) {
      this.log(`Failed to initialize audio: ${error}`, 'error');
      throw error;
    }
  }

  async dispose(): Promise<void> {
    this.analyser?.stop();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.beatDetector?.dispose();
    await super.dispose();
  }

  async execute(inputs: Map<string, any>): Promise<Map<string, any>> {
    const outputs = new Map<string, any>();

    if (!this.features) {
      return outputs;
    }

    const gain = this.getState('gain') ?? 1;
    const smoothing = this.getState('smoothing') ?? 0.8;

    // Calculate band levels
    const level = this.features.rms * gain;
    const bass = this.calculateBand(this.features, 20, 250) * gain;
    const mid = this.calculateBand(this.features, 250, 4000) * gain;
    const treble = this.calculateBand(this.features, 4000, 20000) * gain;

    // Smooth values
    outputs.set('level', this.smooth('level', level, smoothing));
    outputs.set('bass', this.smooth('bass', bass, smoothing));
    outputs.set('mid', this.smooth('mid', mid, smoothing));
    outputs.set('treble', this.smooth('treble', treble, smoothing));

    // Beat detection
    if (this.beatDetector?.isBeat()) {
      outputs.set('beat', true);  // Trigger
    }

    return outputs;
  }

  private smooth(key: string, value: number, factor: number): number {
    const prev = this.getState(`smooth_${key}`) ?? value;
    const smoothed = prev * factor + value * (1 - factor);
    this.setState(`smooth_${key}`, smoothed);
    return smoothed;
  }

  private calculateBand(
    features: AudioFeatures,
    lowHz: number,
    highHz: number
  ): number {
    // Implementation depends on available features
    return features.energy ?? 0;
  }
}
```

---

## Custom Node UI Components

### Base Template

```vue
<!-- Custom node UI template -->
<template>
  <div class="custom-node-ui">
    <!-- Your custom content -->
    <slot name="header" />
    <slot name="body" />
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

interface Props {
  // Node instance data
  nodeId: string;
  definition: NodeDefinition;

  // Control values (reactive)
  controls: Record<string, any>;

  // Output values (reactive, read-only)
  outputs: Record<string, any>;

  // Connection info
  connectedInputs: string[];
  connectedOutputs: string[];
}

interface Emits {
  (e: 'control-change', controlId: string, value: any): void;
  (e: 'trigger', outputId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Update control value
function updateControl(id: string, value: any) {
  emit('control-change', id, value);
}

// Trigger an output
function trigger(outputId: string) {
  emit('trigger', outputId);
}
</script>
```

### Audio Input Custom UI

```vue
<!-- src/nodes/audio/AudioInputNodeUI.vue -->
<template>
  <div class="audio-input-ui">
    <!-- Source selector -->
    <div class="control-row">
      <label>Source</label>
      <select
        :value="controls.source"
        @change="updateControl('source', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="device in audioDevices" :key="device.deviceId" :value="device.deviceId">
          {{ device.label || 'Unknown Device' }}
        </option>
      </select>
    </div>

    <!-- Level meter -->
    <div class="level-meters">
      <div class="meter">
        <span class="meter-label">Level</span>
        <div class="meter-bar">
          <div class="meter-fill" :style="{ width: `${outputs.level * 100}%` }" />
        </div>
        <span class="meter-value">{{ outputs.level?.toFixed(3) }}</span>
      </div>
      <div class="meter">
        <span class="meter-label">Bass</span>
        <div class="meter-bar bass">
          <div class="meter-fill" :style="{ width: `${outputs.bass * 100}%` }" />
        </div>
        <span class="meter-value">{{ outputs.bass?.toFixed(3) }}</span>
      </div>
      <div class="meter">
        <span class="meter-label">Mid</span>
        <div class="meter-bar mid">
          <div class="meter-fill" :style="{ width: `${outputs.mid * 100}%` }" />
        </div>
        <span class="meter-value">{{ outputs.mid?.toFixed(3) }}</span>
      </div>
      <div class="meter">
        <span class="meter-label">Treble</span>
        <div class="meter-bar treble">
          <div class="meter-fill" :style="{ width: `${outputs.treble * 100}%` }" />
        </div>
        <span class="meter-value">{{ outputs.treble?.toFixed(3) }}</span>
      </div>
    </div>

    <!-- Beat indicator -->
    <div class="beat-indicator" :class="{ active: beatActive }">
      Beat
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  nodeId: string;
  controls: Record<string, any>;
  outputs: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'control-change', id: string, value: any): void;
}>();

const audioDevices = ref<MediaDeviceInfo[]>([]);
const beatActive = ref(false);

onMounted(async () => {
  // Get available audio devices
  const devices = await navigator.mediaDevices.enumerateDevices();
  audioDevices.value = devices.filter((d) => d.kind === 'audioinput');
});

// Flash beat indicator
watch(() => props.outputs.beat, (beat) => {
  if (beat) {
    beatActive.value = true;
    setTimeout(() => {
      beatActive.value = false;
    }, 100);
  }
});

function updateControl(id: string, value: any) {
  emit('control-change', id, value);
}
</script>

<style scoped>
.audio-input-ui {
  padding: var(--space-2);
}

.level-meters {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: var(--space-2) 0;
}

.meter {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.meter-label {
  width: 50px;
  font-size: 11px;
  text-transform: uppercase;
}

.meter-bar {
  flex: 1;
  height: 12px;
  background: var(--color-neutral-700);
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: var(--color-primary-400);
  transition: width 50ms ease-out;
}

.meter-bar.bass .meter-fill { background: #EF4444; }
.meter-bar.mid .meter-fill { background: #F59E0B; }
.meter-bar.treble .meter-fill { background: #3B82F6; }

.meter-value {
  width: 50px;
  font-size: 11px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.beat-indicator {
  padding: var(--space-2);
  text-align: center;
  background: var(--color-neutral-700);
  font-size: 11px;
  text-transform: uppercase;
  transition: background 100ms;
}

.beat-indicator.active {
  background: var(--color-warning);
}
</style>
```

---

## Node Auto-Discovery

### Custom Nodes Folder Structure

```
custom-nodes/
├── my-color-mixer/
│   ├── definition.json       # Required: Node definition
│   ├── executor.ts           # Required: Executor class
│   ├── ui.vue               # Optional: Custom UI component
│   ├── icon.svg             # Optional: Custom icon
│   └── README.md            # Optional: Documentation
├── my-data-processor/
│   └── ...
```

### Auto-Discovery Logic

```typescript
// src/nodes/discovery.ts

export async function discoverCustomNodes(
  basePath: string
): Promise<NodeDefinition[]> {
  const nodes: NodeDefinition[] = [];

  // Only in Electron
  if (!window.electronAPI) {
    return nodes;
  }

  const folders = await window.electronAPI.listDirectory(basePath);

  for (const folder of folders) {
    const defPath = `${basePath}/${folder}/definition.json`;

    try {
      const content = await window.electronAPI.readFile(defPath);
      const definition = JSON.parse(content) as NodeDefinition;

      // Validate required fields
      if (!definition.id || !definition.executor) {
        console.warn(`Invalid node definition in ${folder}`);
        continue;
      }

      // Mark as custom
      definition.category = 'custom';

      // Check for custom icon
      const iconPath = `${basePath}/${folder}/icon.svg`;
      if (await window.electronAPI.fileExists(iconPath)) {
        definition.icon = `custom:${folder}`;
      }

      nodes.push(definition);
    } catch (error) {
      console.warn(`Failed to load custom node from ${folder}:`, error);
    }
  }

  return nodes;
}
```

---

## Best Practices

### DO

1. **Use descriptive IDs**: `audio-frequency-analyzer` not `afa`
2. **Provide defaults**: Every control should have a sensible default
3. **Document thoroughly**: Include descriptions and tooltips
4. **Handle errors gracefully**: Don't crash on bad input
5. **Clean up resources**: Implement `dispose()` properly
6. **Use typed outputs**: Match declared types exactly
7. **Support both platforms**: Provide web fallbacks when possible

### DON'T

1. **Block the main thread**: Use workers for heavy computation
2. **Leak memory**: Release buffers, textures, streams
3. **Ignore dispose**: Always clean up in `dispose()`
4. **Hardcode values**: Use controls for configuration
5. **Assume platform**: Check capabilities before using

---

## Related Documents

- [Architecture](./ARCHITECTURE.md)
- [Execution Engine](./EXECUTION_ENGINE.md)
- [Master Plan](../plans/MASTER_PLAN.md)
