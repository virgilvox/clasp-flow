# CLASP Flow - Architecture Deep Dive

**Document Version**: 1.0
**Last Updated**: 2026-01-17

---

## Overview

This document provides detailed technical architecture for CLASP Flow, covering the module structure, data flow patterns, and implementation guidelines.

---

## Directory Structure

```
clasp-flow/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Continuous integration
│   │   ├── build-web.yml       # Web deployment
│   │   ├── build-electron.yml  # Desktop builds
│   │   └── release.yml         # Release automation
│   └── ISSUE_TEMPLATE/
├── docs/
│   ├── plans/                  # Project planning
│   ├── architecture/           # Technical docs
│   ├── handoff/               # Session continuity
│   └── user-guide/            # End-user docs
├── src/
│   ├── main/                  # Electron main process
│   │   ├── index.ts
│   │   ├── ipc/               # IPC handlers
│   │   ├── services/          # Native services
│   │   │   ├── serial.ts
│   │   │   ├── midi.ts
│   │   │   ├── osc.ts
│   │   │   └── filesystem.ts
│   │   └── preload.ts
│   ├── renderer/              # Vue application
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── assets/
│   │   │   ├── styles/
│   │   │   │   ├── tokens.css    # Design tokens
│   │   │   │   ├── components.css
│   │   │   │   └── utilities.css
│   │   │   └── icons/
│   │   ├── components/
│   │   │   ├── common/        # Shared UI components
│   │   │   │   ├── Button.vue
│   │   │   │   ├── Badge.vue
│   │   │   │   ├── Input.vue
│   │   │   │   ├── Select.vue
│   │   │   │   ├── Panel.vue
│   │   │   │   ├── Tabs.vue
│   │   │   │   └── Modal.vue
│   │   │   ├── editor/        # Node editor components
│   │   │   │   ├── NodeCanvas.vue
│   │   │   │   ├── NodePalette.vue
│   │   │   │   ├── NodeSearch.vue
│   │   │   │   ├── MiniMap.vue
│   │   │   │   ├── ConnectionLine.vue
│   │   │   │   └── SelectionBox.vue
│   │   │   ├── nodes/         # Node UI components
│   │   │   │   ├── BaseNode.vue
│   │   │   │   ├── NodePort.vue
│   │   │   │   ├── NodeHeader.vue
│   │   │   │   ├── NodeBody.vue
│   │   │   │   └── controls/
│   │   │   │       ├── NumberInput.vue
│   │   │   │       ├── SliderControl.vue
│   │   │   │       ├── SelectControl.vue
│   │   │   │       ├── ToggleControl.vue
│   │   │   │       ├── XYPadControl.vue
│   │   │   │       ├── ColorPicker.vue
│   │   │   │       └── CodeEditor.vue
│   │   │   ├── panels/        # Side panels
│   │   │   │   ├── PropertiesPanel.vue
│   │   │   │   ├── ControlPanel.vue
│   │   │   │   └── InspectorPanel.vue
│   │   │   └── layout/        # App layout
│   │   │       ├── AppHeader.vue
│   │   │       ├── AppSidebar.vue
│   │   │       ├── StatusBar.vue
│   │   │       └── TabBar.vue
│   │   ├── composables/       # Vue composables
│   │   │   ├── useNodeEditor.ts
│   │   │   ├── useAudioContext.ts
│   │   │   ├── useKeyboard.ts
│   │   │   ├── useClipboard.ts
│   │   │   ├── useHistory.ts
│   │   │   └── usePlatform.ts
│   │   ├── stores/            # Pinia stores
│   │   │   ├── flows.ts       # Flow management
│   │   │   ├── nodes.ts       # Node registry
│   │   │   ├── runtime.ts     # Execution state
│   │   │   ├── settings.ts    # User preferences
│   │   │   ├── ui.ts          # UI state
│   │   │   └── history.ts     # Undo/redo
│   │   ├── views/             # Route views
│   │   │   ├── EditorView.vue
│   │   │   ├── ControlPanelView.vue
│   │   │   ├── SettingsView.vue
│   │   │   └── HomeView.vue
│   │   └── router/
│   │       └── index.ts
│   ├── engine/                # Execution engine
│   │   ├── index.ts
│   │   ├── graph/
│   │   │   ├── Graph.ts       # Graph data structure
│   │   │   ├── Node.ts        # Node base class
│   │   │   ├── Edge.ts        # Connection class
│   │   │   ├── Port.ts        # Input/output port
│   │   │   └── Scheduler.ts   # Execution scheduler
│   │   ├── execution/
│   │   │   ├── Executor.ts    # Main executor
│   │   │   ├── WorkerPool.ts  # Worker management
│   │   │   ├── Context.ts     # Execution context
│   │   │   └── MessageBus.ts  # Event system
│   │   ├── types/
│   │   │   ├── DataType.ts    # Data type definitions
│   │   │   ├── NodeTypes.ts   # Node type interfaces
│   │   │   └── FlowTypes.ts   # Flow interfaces
│   │   └── workers/
│   │       ├── node.worker.ts # Generic node worker
│   │       ├── audio.worker.ts
│   │       └── video.worker.ts
│   ├── nodes/                 # Built-in nodes
│   │   ├── index.ts           # Node registry
│   │   ├── debug/
│   │   │   ├── MonitorNode.ts
│   │   │   └── ConsoleNode.ts
│   │   ├── inputs/
│   │   │   ├── AudioInputNode.ts
│   │   │   ├── TriggerNode.ts
│   │   │   ├── SliderNode.ts
│   │   │   ├── XYPadNode.ts
│   │   │   ├── LFONode.ts
│   │   │   ├── TimeNode.ts
│   │   │   └── ConstantNode.ts
│   │   ├── outputs/
│   │   │   ├── DisplayNode.ts
│   │   │   ├── AudioOutputNode.ts
│   │   │   └── ShaderUniformNode.ts
│   │   ├── math/
│   │   │   ├── AddNode.ts
│   │   │   ├── MultiplyNode.ts
│   │   │   ├── MapRangeNode.ts
│   │   │   └── ExpressionNode.ts
│   │   ├── logic/
│   │   │   ├── CompareNode.ts
│   │   │   ├── GateNode.ts
│   │   │   └── SwitchNode.ts
│   │   ├── audio/
│   │   │   ├── AudioAnalysisNode.ts
│   │   │   ├── BeatDetectNode.ts
│   │   │   ├── OscillatorNode.ts
│   │   │   └── FilterNode.ts
│   │   ├── video/
│   │   │   ├── VideoInputNode.ts
│   │   │   ├── VideoPlayerNode.ts
│   │   │   └── BlendNode.ts
│   │   ├── shaders/
│   │   │   ├── ShaderNode.ts
│   │   │   └── ShaderLibraryNode.ts
│   │   ├── data/
│   │   │   ├── HTTPRequestNode.ts
│   │   │   ├── WebSocketNode.ts
│   │   │   ├── MQTTNode.ts
│   │   │   └── JSONNode.ts
│   │   ├── ai/
│   │   │   ├── TextGenerateNode.ts
│   │   │   └── TranscribeNode.ts
│   │   ├── code/
│   │   │   ├── FunctionNode.ts
│   │   │   ├── BlocklyNode.ts
│   │   │   └── WASMNode.ts
│   │   └── connectivity/
│   │       ├── SerialNode.ts
│   │       ├── BLENode.ts
│   │       ├── MIDINode.ts
│   │       └── OSCNode.ts
│   ├── platform/              # Platform abstraction
│   │   ├── index.ts
│   │   ├── capabilities.ts    # Feature detection
│   │   ├── web/
│   │   │   ├── WebAudio.ts
│   │   │   ├── WebSerial.ts
│   │   │   ├── WebBluetooth.ts
│   │   │   └── WebMIDI.ts
│   │   └── electron/
│   │       ├── ElectronAudio.ts
│   │       ├── ElectronSerial.ts
│   │       ├── ElectronBluetooth.ts
│   │       ├── ElectronMIDI.ts
│   │       ├── ElectronOSC.ts
│   │       └── ElectronFS.ts
│   ├── storage/               # Data persistence
│   │   ├── index.ts
│   │   ├── db.ts              # IndexedDB (Dexie)
│   │   ├── FlowStorage.ts
│   │   ├── AssetStorage.ts
│   │   └── SettingsStorage.ts
│   └── utils/                 # Utilities
│       ├── id.ts              # ID generation
│       ├── color.ts           # Color utilities
│       ├── math.ts            # Math helpers
│       ├── debounce.ts
│       └── validation.ts
├── custom-nodes/              # User custom nodes (Electron)
├── public/
│   ├── favicon.ico
│   └── index.html
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── electron.vite.config.ts
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Core Systems

### 1. Node Registry System

The node registry is responsible for managing all available node types.

```typescript
// src/nodes/index.ts

interface NodeDefinition {
  id: string;
  name: string;
  category: NodeCategory;
  description: string;
  icon: string;
  platforms: ('web' | 'electron')[];
  webFallback?: string;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  controls: ControlDefinition[];
  executor: string;  // Class name
  ui?: string;       // Vue component name (optional)
  tags?: string[];   // For search
}

interface PortDefinition {
  id: string;
  type: DataType;
  label: string;
  default?: any;
  multi?: boolean;  // Allow multiple connections
}

interface ControlDefinition {
  id: string;
  type: ControlType;
  label: string;
  props?: Record<string, any>;
  exposable?: boolean;  // Can appear in control panel
}

type NodeCategory =
  | 'debug' | 'inputs' | 'outputs' | 'math' | 'logic'
  | 'audio' | 'video' | 'shaders' | 'data' | 'ai' | 'code'
  | '3d' | 'connectivity' | 'custom';

type DataType =
  | 'trigger' | 'number' | 'string' | 'boolean'
  | 'audio' | 'video' | 'texture' | 'data' | 'any';

type ControlType =
  | 'number' | 'slider' | 'select' | 'toggle' | 'text'
  | 'color' | 'xy-pad' | 'code' | 'file' | 'button';

class NodeRegistry {
  private nodes: Map<string, NodeDefinition> = new Map();
  private executors: Map<string, typeof BaseNodeExecutor> = new Map();
  private components: Map<string, Component> = new Map();

  register(definition: NodeDefinition, executor: typeof BaseNodeExecutor, component?: Component): void;
  unregister(id: string): void;
  get(id: string): NodeDefinition | undefined;
  getAll(): NodeDefinition[];
  getByCategory(category: NodeCategory): NodeDefinition[];
  search(query: string): NodeDefinition[];
  isAvailable(id: string, platform: 'web' | 'electron'): boolean;
  createExecutor(id: string, context: ExecutionContext): BaseNodeExecutor;
  getComponent(id: string): Component;
}
```

### 2. Execution Engine

The execution engine manages the flow graph and coordinates node execution.

```typescript
// src/engine/graph/Graph.ts

class FlowGraph {
  id: string;
  name: string;
  nodes: Map<string, NodeInstance>;
  edges: Map<string, Edge>;

  addNode(definition: NodeDefinition, position: Position): NodeInstance;
  removeNode(nodeId: string): void;
  connect(sourceNode: string, sourcePort: string, targetNode: string, targetPort: string): Edge;
  disconnect(edgeId: string): void;
  getTopologicalOrder(): NodeInstance[];
  detectCycles(): boolean;
  serialize(): FlowJSON;
  static deserialize(json: FlowJSON): FlowGraph;
}

// src/engine/execution/Executor.ts

class FlowExecutor {
  private graph: FlowGraph;
  private workerPool: WorkerPool;
  private messageBus: MessageBus;
  private running: boolean = false;
  private context: ExecutionContext;

  constructor(graph: FlowGraph);

  async start(): Promise<void>;
  async stop(): Promise<void>;
  async pause(): Promise<void>;
  async resume(): Promise<void>;

  // Triggered nodes (trigger type inputs)
  trigger(nodeId: string, portId: string, value: any): void;

  // Continuous execution loop
  private async executionLoop(): Promise<void>;

  // Execute single node
  private async executeNode(node: NodeInstance): Promise<void>;

  // Propagate outputs to connected inputs
  private propagate(node: NodeInstance, outputs: Map<string, any>): void;

  // Error handling
  private handleError(node: NodeInstance, error: Error): void;

  // Performance monitoring
  getMetrics(): ExecutionMetrics;
}

// src/engine/execution/Context.ts

interface ExecutionContext {
  platform: 'web' | 'electron';
  audioContext: AudioContext;
  capabilities: PlatformCapabilities;
  settings: RuntimeSettings;

  // Resource management
  requestTexture(width: number, height: number): WebGLTexture;
  releaseTexture(texture: WebGLTexture): void;
  requestAudioBuffer(samples: number): AudioBuffer;
  releaseAudioBuffer(buffer: AudioBuffer): void;
}
```

### 3. Node Executor Base Class

All nodes inherit from this base class.

```typescript
// src/engine/graph/Node.ts

abstract class BaseNodeExecutor {
  readonly id: string;
  readonly definition: NodeDefinition;
  protected context: ExecutionContext;
  protected state: Map<string, any> = new Map();

  constructor(id: string, definition: NodeDefinition, context: ExecutionContext);

  // Called when node is added to flow
  async initialize(): Promise<void>;

  // Called when node is removed from flow
  async dispose(): Promise<void>;

  // Main execution - called each frame or on trigger
  abstract execute(inputs: Map<string, any>): Promise<Map<string, any>>;

  // Handle control value changes
  onControlChange(controlId: string, value: any): void;

  // State management
  getState(key: string): any;
  setState(key: string, value: any): void;

  // Utility methods
  protected log(message: string): void;
  protected emit(event: string, data: any): void;
}

// Example: MapRangeNode

class MapRangeNode extends BaseNodeExecutor {
  async execute(inputs: Map<string, any>): Promise<Map<string, any>> {
    const value = inputs.get('value') ?? 0;
    const inMin = inputs.get('inMin') ?? this.getState('inMin') ?? 0;
    const inMax = inputs.get('inMax') ?? this.getState('inMax') ?? 1;
    const outMin = inputs.get('outMin') ?? this.getState('outMin') ?? 0;
    const outMax = inputs.get('outMax') ?? this.getState('outMax') ?? 1;

    // Map value from input range to output range
    const normalized = (value - inMin) / (inMax - inMin);
    const mapped = normalized * (outMax - outMin) + outMin;

    return new Map([['value', mapped]]);
  }
}
```

### 4. Worker Pool

Offload heavy computations to web workers.

```typescript
// src/engine/execution/WorkerPool.ts

class WorkerPool {
  private workers: Worker[] = [];
  private queue: Task[] = [];
  private busy: Set<Worker> = new Set();

  constructor(size: number = navigator.hardwareConcurrency || 4);

  async execute<T>(task: Task): Promise<T>;
  terminate(): void;

  private getAvailableWorker(): Worker | null;
  private processQueue(): void;
}

interface Task {
  type: 'node' | 'audio' | 'video' | 'wasm';
  nodeId: string;
  inputs: any;
  code?: string;  // For function nodes
}

// src/engine/workers/node.worker.ts

self.onmessage = async (event: MessageEvent<Task>) => {
  const { type, nodeId, inputs, code } = event.data;

  try {
    let result: any;

    switch (type) {
      case 'node':
        // Execute node logic
        result = await executeNodeLogic(nodeId, inputs);
        break;
      case 'wasm':
        // Execute WASM binary
        result = await executeWASM(inputs);
        break;
    }

    self.postMessage({ success: true, nodeId, result });
  } catch (error) {
    self.postMessage({ success: false, nodeId, error: error.message });
  }
};
```

### 5. Platform Abstraction Layer

Unified API for platform-specific features.

```typescript
// src/platform/index.ts

interface PlatformCapabilities {
  serial: boolean;
  bluetooth: boolean;
  midi: boolean;
  osc: boolean;
  filesystem: boolean;
  nativeAudio: boolean;
  gpu: 'webgl2' | 'webgpu' | 'none';
}

interface PlatformServices {
  serial: SerialService;
  bluetooth: BluetoothService;
  midi: MIDIService;
  osc: OSCService;
  filesystem: FileSystemService;
  audio: AudioService;
}

function detectPlatform(): 'web' | 'electron' {
  return typeof window !== 'undefined' &&
         window.process?.type === 'renderer'
    ? 'electron'
    : 'web';
}

function getCapabilities(): PlatformCapabilities {
  const platform = detectPlatform();

  if (platform === 'electron') {
    return {
      serial: true,
      bluetooth: true,
      midi: true,
      osc: true,
      filesystem: true,
      nativeAudio: true,
      gpu: 'webgpu',  // Or detect
    };
  }

  return {
    serial: 'serial' in navigator,
    bluetooth: 'bluetooth' in navigator,
    midi: 'requestMIDIAccess' in navigator,
    osc: false,  // No native OSC in browser
    filesystem: 'showOpenFilePicker' in window,
    nativeAudio: false,
    gpu: detectGPU(),
  };
}

function createServices(platform: 'web' | 'electron'): PlatformServices {
  if (platform === 'electron') {
    return {
      serial: new ElectronSerial(),
      bluetooth: new ElectronBluetooth(),
      midi: new ElectronMIDI(),
      osc: new ElectronOSC(),
      filesystem: new ElectronFS(),
      audio: new ElectronAudio(),
    };
  }

  return {
    serial: new WebSerial(),
    bluetooth: new WebBluetooth(),
    midi: new WebMIDI(),
    osc: new NoOpOSC(),  // Or websocket bridge
    filesystem: new WebFileSystem(),
    audio: new WebAudio(),
  };
}
```

### 6. Storage Layer

Persistent storage using IndexedDB.

```typescript
// src/storage/db.ts

import Dexie from 'dexie';

class ClaspFlowDB extends Dexie {
  flows!: Dexie.Table<FlowRecord, string>;
  assets!: Dexie.Table<AssetRecord, string>;
  settings!: Dexie.Table<SettingRecord, string>;

  constructor() {
    super('clasp-flow');

    this.version(1).stores({
      flows: 'id, name, updatedAt',
      assets: 'id, type, flowId',
      settings: 'key',
    });
  }
}

interface FlowRecord {
  id: string;
  name: string;
  description?: string;
  data: FlowJSON;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AssetRecord {
  id: string;
  type: 'image' | 'video' | 'audio' | 'model' | 'shader';
  name: string;
  flowId?: string;  // null = global asset
  data: Blob | ArrayBuffer;
  metadata?: Record<string, any>;
}

// src/storage/FlowStorage.ts

class FlowStorage {
  private db: ClaspFlowDB;

  async save(flow: FlowGraph): Promise<void>;
  async load(id: string): Promise<FlowGraph>;
  async delete(id: string): Promise<void>;
  async list(): Promise<FlowRecord[]>;
  async export(id: string): Promise<string>;  // JSON
  async import(json: string): Promise<FlowGraph>;
  async duplicate(id: string): Promise<FlowGraph>;
}
```

---

## State Management

### Pinia Stores

```typescript
// src/renderer/stores/flows.ts

export const useFlowsStore = defineStore('flows', {
  state: () => ({
    flows: [] as FlowRecord[],
    activeFlowId: null as string | null,
    activeFlow: null as FlowGraph | null,
    dirty: false,
  }),

  getters: {
    currentFlow: (state) => state.activeFlow,
    flowList: (state) => state.flows,
    hasUnsavedChanges: (state) => state.dirty,
  },

  actions: {
    async loadFlows() { /* ... */ },
    async createFlow(name: string) { /* ... */ },
    async openFlow(id: string) { /* ... */ },
    async saveFlow() { /* ... */ },
    async deleteFlow(id: string) { /* ... */ },

    // Graph mutations
    addNode(definition: NodeDefinition, position: Position) { /* ... */ },
    removeNode(nodeId: string) { /* ... */ },
    connect(source: PortRef, target: PortRef) { /* ... */ },
    disconnect(edgeId: string) { /* ... */ },
    updateNodePosition(nodeId: string, position: Position) { /* ... */ },
    updateNodeControl(nodeId: string, controlId: string, value: any) { /* ... */ },
  },
});

// src/renderer/stores/runtime.ts

export const useRuntimeStore = defineStore('runtime', {
  state: () => ({
    status: 'stopped' as 'stopped' | 'running' | 'paused',
    fps: 0,
    nodeMetrics: new Map<string, NodeMetrics>(),
    errors: [] as RuntimeError[],
  }),

  actions: {
    async start() { /* ... */ },
    async stop() { /* ... */ },
    async pause() { /* ... */ },
    async resume() { /* ... */ },
    clearErrors() { /* ... */ },
  },
});

// src/renderer/stores/ui.ts

export const useUIStore = defineStore('ui', {
  state: () => ({
    sidebarOpen: true,
    sidebarPanel: 'nodes' as 'nodes' | 'properties' | 'controls',
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedNodes: [] as string[],
    hoveredNode: null as string | null,
    inspectedNode: null as string | null,
    theme: 'dark' as 'dark' | 'light',
  }),

  actions: {
    toggleSidebar() { /* ... */ },
    setSidebarPanel(panel: string) { /* ... */ },
    setZoom(zoom: number) { /* ... */ },
    setPan(pan: Position) { /* ... */ },
    selectNodes(nodeIds: string[]) { /* ... */ },
    clearSelection() { /* ... */ },
  },
});
```

---

## Connection Rendering

### Enhanced Connection Lines

```typescript
// src/renderer/components/editor/ConnectionLine.vue

interface ConnectionLineProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  dataType: DataType;
  isActive: boolean;  // Data currently flowing
  isSelected: boolean;
  isError: boolean;
}

const lineStyles: Record<DataType, LineStyle> = {
  trigger: { color: '#F59E0B', width: 2, dash: '' },
  number: { color: '#2AAB8A', width: 2, dash: '' },
  string: { color: '#8B5CF6', width: 2, dash: '' },
  boolean: { color: '#EF4444', width: 2, dash: '4 4' },
  audio: { color: '#22C55E', width: 4, dash: '' },
  video: { color: '#3B82F6', width: 4, dash: '' },
  texture: { color: '#EC4899', width: 3, dash: '8 4' },
  data: { color: '#6B7280', width: 2, dash: '' },
  any: { color: '#FFFFFF', width: 2, dash: '2 2' },
};

// Animation for active connections
const animationOffset = ref(0);
onMounted(() => {
  if (props.isActive) {
    const animate = () => {
      animationOffset.value = (animationOffset.value + 1) % 20;
      requestAnimationFrame(animate);
    };
    animate();
  }
});
```

```vue
<template>
  <g class="connection-line">
    <!-- Background line (for hover area) -->
    <path
      :d="path"
      fill="none"
      :stroke="'transparent'"
      :stroke-width="12"
      class="connection-hover-area"
    />

    <!-- Main line -->
    <path
      :d="path"
      fill="none"
      :stroke="lineStyle.color"
      :stroke-width="isSelected ? lineStyle.width + 2 : lineStyle.width"
      :stroke-dasharray="lineStyle.dash"
      :stroke-dashoffset="isActive ? animationOffset : 0"
      :class="{
        'connection-active': isActive,
        'connection-selected': isSelected,
        'connection-error': isError,
      }"
    />

    <!-- Active flow indicator (animated dots) -->
    <circle
      v-if="isActive"
      :r="3"
      :fill="lineStyle.color"
      class="flow-indicator"
    >
      <animateMotion
        :dur="'0.5s'"
        repeatCount="indefinite"
        :path="path"
      />
    </circle>
  </g>
</template>
```

---

## Custom Node Development

### Node Definition File

```json
// custom-nodes/my-color-node/definition.json
{
  "id": "my-color-node",
  "name": "Color Mixer",
  "category": "custom",
  "description": "Mix two colors with a blend factor",
  "icon": "palette",
  "version": "1.0.0",
  "author": "Your Name",
  "platforms": ["web", "electron"],
  "inputs": [
    { "id": "color1", "type": "string", "label": "Color 1", "default": "#FF0000" },
    { "id": "color2", "type": "string", "label": "Color 2", "default": "#0000FF" },
    { "id": "blend", "type": "number", "label": "Blend", "default": 0.5 }
  ],
  "outputs": [
    { "id": "result", "type": "string", "label": "Result" },
    { "id": "rgb", "type": "data", "label": "RGB" }
  ],
  "controls": [
    { "id": "color1", "type": "color", "label": "Color 1" },
    { "id": "color2", "type": "color", "label": "Color 2" },
    { "id": "blend", "type": "slider", "label": "Blend", "props": { "min": 0, "max": 1, "step": 0.01 } }
  ]
}
```

### Node Executor

```typescript
// custom-nodes/my-color-node/executor.ts

import { BaseNodeExecutor } from '@clasp-flow/engine';

export class MyColorNode extends BaseNodeExecutor {
  async execute(inputs: Map<string, any>): Promise<Map<string, any>> {
    const color1 = inputs.get('color1') ?? this.getState('color1') ?? '#FF0000';
    const color2 = inputs.get('color2') ?? this.getState('color2') ?? '#0000FF';
    const blend = inputs.get('blend') ?? this.getState('blend') ?? 0.5;

    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    const mixed = {
      r: Math.round(rgb1.r * (1 - blend) + rgb2.r * blend),
      g: Math.round(rgb1.g * (1 - blend) + rgb2.g * blend),
      b: Math.round(rgb1.b * (1 - blend) + rgb2.b * blend),
    };

    const result = this.rgbToHex(mixed);

    return new Map([
      ['result', result],
      ['rgb', mixed],
    ]);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }
}
```

### Custom UI Component (Optional)

```vue
<!-- custom-nodes/my-color-node/ui.vue -->
<template>
  <div class="my-color-node">
    <div class="color-preview" :style="{ background: previewColor }"></div>
    <div class="color-swatches">
      <div
        class="swatch"
        :style="{ background: color1 }"
        @click="$emit('control-change', 'color1', promptColor())"
      />
      <div
        class="swatch"
        :style="{ background: color2 }"
        @click="$emit('control-change', 'color2', promptColor())"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  color1: string;
  color2: string;
  blend: number;
  outputs: Map<string, any>;
}>();

const previewColor = computed(() => props.outputs.get('result') ?? '#888888');
</script>
```

---

## Testing Patterns

### Unit Test Example

```typescript
// tests/unit/nodes/MapRangeNode.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { MapRangeNode } from '@/nodes/math/MapRangeNode';
import { createMockContext } from '../helpers';

describe('MapRangeNode', () => {
  let node: MapRangeNode;

  beforeEach(() => {
    node = new MapRangeNode('test-id', MapRangeNode.definition, createMockContext());
  });

  it('should map value from input range to output range', async () => {
    const inputs = new Map([
      ['value', 0.5],
      ['inMin', 0],
      ['inMax', 1],
      ['outMin', 0],
      ['outMax', 100],
    ]);

    const outputs = await node.execute(inputs);

    expect(outputs.get('value')).toBe(50);
  });

  it('should handle inverted ranges', async () => {
    const inputs = new Map([
      ['value', 0.75],
      ['inMin', 0],
      ['inMax', 1],
      ['outMin', 100],
      ['outMax', 0],
    ]);

    const outputs = await node.execute(inputs);

    expect(outputs.get('value')).toBe(25);
  });

  it('should use state values when inputs are not connected', async () => {
    node.setState('inMin', 10);
    node.setState('inMax', 20);
    node.setState('outMin', 0);
    node.setState('outMax', 1);

    const inputs = new Map([['value', 15]]);
    const outputs = await node.execute(inputs);

    expect(outputs.get('value')).toBe(0.5);
  });
});
```

### E2E Test Example

```typescript
// tests/e2e/flow-creation.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Flow Creation', () => {
  test('should create a simple math flow', async ({ page }) => {
    await page.goto('/');

    // Create new flow
    await page.click('[data-testid="new-flow-button"]');

    // Add Constant node
    await page.click('[data-testid="node-palette"]');
    await page.fill('[data-testid="node-search"]', 'constant');
    await page.click('[data-testid="node-item-constant"]');
    await page.click('[data-testid="canvas"]', { position: { x: 200, y: 200 } });

    // Add Monitor node
    await page.fill('[data-testid="node-search"]', 'monitor');
    await page.click('[data-testid="node-item-monitor"]');
    await page.click('[data-testid="canvas"]', { position: { x: 500, y: 200 } });

    // Connect nodes
    await page.dragAndDrop(
      '[data-testid="port-constant-value-out"]',
      '[data-testid="port-monitor-value-in"]'
    );

    // Verify connection exists
    await expect(page.locator('[data-testid="connection-line"]')).toBeVisible();

    // Start flow
    await page.click('[data-testid="start-button"]');

    // Verify monitor shows value
    await expect(page.locator('[data-testid="monitor-value"]')).toHaveText('0');

    // Change constant value
    await page.click('[data-testid="node-constant"]');
    await page.fill('[data-testid="control-value"]', '42');

    // Verify monitor updates
    await expect(page.locator('[data-testid="monitor-value"]')).toHaveText('42');
  });
});
```

---

## Performance Guidelines

### 1. Render Optimization
- Use Vue's `v-memo` for node lists
- Virtualize large node canvases
- Debounce zoom/pan updates
- Use CSS transforms for node positions

### 2. Execution Optimization
- Offload heavy nodes to workers
- Batch texture operations
- Pool audio buffers
- Use transferable objects for worker communication

### 3. Memory Management
- Release unused textures
- Dispose audio nodes properly
- Limit undo history size
- Lazy-load large assets

### 4. Startup Optimization
- Code split by route
- Lazy-load node executors
- Progressive asset loading
- Service worker caching

---

## Security Considerations

### Electron Security
```typescript
// src/main/index.ts

const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    preload: path.join(__dirname, 'preload.js'),
  },
});
```

### Function Node Sandboxing
- Execute in isolated iframe or worker
- Limit available APIs
- Timeout protection
- Memory limits

### WASM Security
- Validate WASM signatures
- Memory limits
- No file system access (browser)

---

## Related Documents

- [Master Plan](../plans/MASTER_PLAN.md)
- [Node Specification](./NODE_SPEC.md)
- [Execution Engine Details](./EXECUTION_ENGINE.md)
- [Platform Layer](./PLATFORM_LAYER.md)
