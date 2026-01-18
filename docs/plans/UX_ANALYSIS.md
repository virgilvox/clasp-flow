# LATCH - Comprehensive UX Analysis

**Purpose**: Deep analysis of user workflows, TouchDesigner patterns, compositing architecture, and UX improvements needed. This document ensures continuity if context is lost.

---

## Executive Summary

LATCH needs improvements in:
1. **Data flow visualization** - Users can't see data flowing between nodes
2. **Signal visualization** - No oscilloscope/waveform display for debugging signals
3. **Texture pipeline** - 3D nodes need texture input support for webcam/shader textures
4. **Compositing** - Need clear patterns for combining 2D, 3D, and video
5. **Control Panel** - Works but users don't understand the expose workflow

---

## Critical Bugs Fixed This Session

1. **Handle positioning** - Handles were at bottom of nodes instead of centered. Fixed by making `.node-content` flex to fill `.base-node`.

2. **Control data not passing to executors** - ExecutionEngine was looking for `node.data.controls` but data is stored directly in `node.data`. Fixed by iterating over `node.data` entries instead.

3. **Control Panel workflow** - Works correctly but requires:
   - Select a node in Editor view
   - Open Properties Panel (right side)
   - Click the crosshair icon next to a control to "expose" it
   - Navigate to Controls view using header button
   - Exposed controls appear there

---

## TouchDesigner Patterns & Inspiration

### 1. Operator Types (TOPs, CHOPs, SOPs, MATs, DATs)
TouchDesigner separates operators by data type:
- **TOPs** (Texture Operators): Image/video processing
- **CHOPs** (Channel Operators): Audio/signal processing
- **SOPs** (Surface Operators): 3D geometry
- **MATs** (Materials): Shaders and materials
- **DATs** (Data Operators): Tables, scripts, text

**LATCH Equivalent**: We use color-coded data types (texture, audio, object3d, etc.) but don't enforce strict type separation. This is good - more flexible.

### 2. Cook/Execute Model
TouchDesigner "cooks" nodes on demand based on viewer connections. Nodes only execute when their output is needed.

**LATCH Current**: We execute ALL nodes every frame in topological order. This is simpler but less efficient. Consider lazy evaluation later.

### 3. Viewer Paradigm
TouchDesigner shows output in the node itself or in dedicated viewer windows.

**LATCH Current**:
- Main Output node shows texture output
- Monitor node shows data values
- **Needed**: TexturePreview on BaseNode already shows shader outputs

### 4. Network Navigation
TouchDesigner allows drilling into networks (subflows).

**LATCH Current**: We have subflows with Ctrl+G to create, Ctrl+E to edit. Good!

### 5. Parameter Binding
TouchDesigner lets you reference other parameters using expressions like `op('slider1')['value']`.

**LATCH Current**: No expression binding between parameters. This would be powerful but complex.

---

## User Workflow Analysis

### Workflow 1: Basic VJ Setup
**Goal**: React audio to visuals

```
[Audio Input] → [Analyzer] → [Audio levels: bass, mid, high]
                    ↓
[Shader] ← [Map Range] ← bass level
    ↓
[Main Output]
```

**Issues**:
- No visual feedback on audio levels without Monitor node
- Need oscilloscope to see waveform shape
- Shader parameters need to be easily connected to audio

### Workflow 2: 3D Scene with Texture
**Goal**: Apply webcam to 3D object

```
[Webcam] → [Texture] ← Material needs texture input!
               ↓
[Material 3D] → [Box 3D] → [Scene 3D] → [Render 3D] → [Main Output]
                              ↑
                    [Camera 3D]
                              ↑
                    [Lights]
```

**Issue**: Material 3D has `colorMap` input but it expects `texture` type. This SHOULD work. Need to verify connection compatibility.

### Workflow 3: Mixed Media Compositing
**Goal**: Composite 3D render with shader effect

```
[3D Scene] → [Render 3D] → [Blend] → [Main Output]
                              ↑
[Shader] ─────────────────────┘
```

**Current Status**: This SHOULD work since Render 3D outputs `texture` and Blend takes two `texture` inputs.

### Workflow 4: Live Performance
**Goal**: Control visuals with exposed parameters

```
1. Create nodes and connect
2. Select parameter controls
3. Click "Expose" in Properties Panel
4. Switch to Control Panel view
5. Adjust sliders during performance
```

**Issue**: Users don't discover the expose workflow. Consider:
- Auto-expose controls marked `exposable: true`
- Show "expose" icon directly on nodes
- Better onboarding

---

## Required New Features

### 1. Oscilloscope Node
**Purpose**: Visualize signal/waveform data over time

```typescript
{
  id: 'oscilloscope',
  name: 'Oscilloscope',
  category: 'debug',
  inputs: [
    { id: 'signal', type: 'number', label: 'Signal' },
  ],
  outputs: [],
  controls: [
    { id: 'timeScale', type: 'slider', label: 'Time Scale', default: 1 },
    { id: 'amplitude', type: 'slider', label: 'Amplitude', default: 1 },
    { id: 'triggerLevel', type: 'number', label: 'Trigger Level', default: 0 },
  ],
}
```

**UI Requirements**:
- Rolling line graph showing signal over last N samples
- Y-axis scale based on amplitude
- Trigger mode to stabilize display
- Green phosphor aesthetic

### 2. Spectrum Analyzer Node
**Purpose**: Visualize frequency data from audio

```typescript
{
  id: 'spectrum',
  name: 'Spectrum',
  category: 'debug',
  inputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
  ],
  outputs: [],
}
```

### 3. Texture Input for 3D Materials
**Verify**: Material 3D already has `colorMap`, `normalMap`, etc. inputs of type `texture`. The connection should work. If not, check `connections.ts` compatibility.

---

## UX Improvements Needed

### Node Design Principles

1. **Compact when possible**: Simple math nodes (Add, Multiply) should be minimal - just header with icon
2. **Expand on hover/selection**: Show labels only when needed
3. **Category colors**: Use consistently to help visual scanning
4. **Data type colors**: Use on handles to show what connects to what

### Specific Node Improvements

| Node | Current | Improvement |
|------|---------|-------------|
| Add/Subtract/etc | Compact header only | ✅ Already implemented |
| Monitor | Shows value | Add graph history option |
| Trigger | Full UI | ✅ Good - has collapsed mode |
| Shader | Preview + code button | ✅ Good |
| Main Output | Large preview | ✅ Good - has expand toggle |
| Audio Analyzer | No visualization | Add level meters |

### Connection UX

1. **Type hints**: When dragging a connection, highlight compatible inputs
2. **Auto-convert**: Allow number→trigger or string→number with auto-conversion
3. **Connection preview**: Show data value on hover over connection line

### Control Panel UX

1. **Auto-group by node**: Group controls by source node automatically
2. **MIDI learn**: Click control, move MIDI fader to bind
3. **OSC addressing**: Auto-generate OSC addresses for exposed controls

---

## Architecture Notes

### Data Flow
```
Node A outputs → stored in nodeOutputs Map
                    ↓
Edge connects A.output to B.input
                    ↓
Node B getNodeInputs() reads from A's outputs via edge lookup
                    ↓
Node B executor receives inputs Map
```

### Control Flow
```
User changes control value
         ↓
flowsStore.updateNodeData(nodeId, { controlId: value })
         ↓
node.data[controlId] = value
         ↓
Next frame: ExecutionEngine reads node.data into context.controls
         ↓
Executor uses ctx.controls.get('controlId')
```

### Special Node Components
These node types have dedicated Vue components instead of BaseNode:
- `main-output` → MainOutputNode.vue
- `trigger` → TriggerNode.vue
- `monitor` → MonitorNode.vue
- `xy-pad` → XYPadNode.vue

To add a new special component:
1. Create `MyNode.vue` in `components/nodes/`
2. Import in `EditorView.vue`
3. Add to `nodeTypes` object
4. Add to `specialNodeTypes` array in `flows.ts`
5. Add to `specialNodeTypes` in `usePersistence.ts` migration

---

## Implementation Priority

### Phase 10A: Signal Visualization
1. Create OscilloscopeNode.vue with canvas-based waveform display
2. Register oscilloscope executor that stores signal history
3. Add spectrum analyzer for audio

### Phase 10B: Compositing Verification
1. Verify Render 3D → Blend → Main Output pipeline works
2. Verify Webcam → Material 3D colorMap works
3. Add any missing type compatibilities

### Phase 10C: UX Polish
1. Add type-compatible highlighting during connection drag
2. Improve Control Panel discoverability
3. Add audio level meters to Audio Analyzer node

---

## Context Recovery Info

If context is lost, here's what to know:

### Current Session Work
- Fixed handle positioning (CSS flex)
- Fixed control data passing to executors (was looking at wrong property)
- Control Panel WORKS - users just need to expose controls via Properties Panel

### Key Files
- `BaseNode.vue` - Main node component, handles, labels
- `ExecutionEngine.ts` - Runs the flow, passes data between nodes
- `executors/index.ts` - All built-in node executors
- `flows.ts` - Flow state, node management
- `usePersistence.ts` - Save/load, migration logic
- `ControlPanelView.vue` - Performance control view
- `PropertiesPanel.vue` - Node inspection, expose controls

### Data Storage
- Controls: `node.data[controlId]` (directly on node data)
- Outputs: `runtimeStore.nodeMetrics.get(nodeId).outputValues`
- Exposed Controls: `uiStore.exposedControls` (persisted to localStorage)

---

*Last Updated: Session 2026-01-17*
