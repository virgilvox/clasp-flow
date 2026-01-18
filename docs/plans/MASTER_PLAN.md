# LATCH - Master Project Plan

**Project**: LATCH - Live Art Tool for Creative Humans
**Organization**: LumenCanvas
**Version**: 0.1.0
**Last Updated**: 2026-01-17
**Status**: Phase 9 Complete + UX Polish + Debug Nodes (Graph, Equalizer, Enhanced Oscilloscope)

---

## Executive Summary

LATCH (Live Art Tool for Creative Humans) is an ambitious open-source visual flow/node programming environment that combines the best features of TouchDesigner, PureData, Max/MSP, Node-RED, and nodes.io. It runs as both a web application and an Electron desktop app, enabling creative professionals to build complex audio-visual pipelines, IoT integrations, AI workflows, and interactive experiences through an intuitive node-based interface.

### Key Differentiators
- **Dual Runtime**: Web browser + Electron (with hardware access)
- **Universal Data Flow**: Video, audio, shaders, data, IoT, AI - all interconnected
- **Beginner-Friendly, Expert-Capable**: Simple to start, unlimited depth
- **WASM-Powered**: Leverage ffmpeg, AI models, and custom binaries
- **Future-Proof**: CLASP protocol integration, containerization support

---

## Table of Contents

1. [Vision & Goals](#vision--goals)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Project Phases](#project-phases)
5. [Node Categories](#node-categories)
6. [Key Features](#key-features)
7. [Design System](#design-system)
8. [Testing Strategy](#testing-strategy)
9. [Build & Deployment](#build--deployment)
10. [Risk Assessment](#risk-assessment)
11. [Progress Tracking](#progress-tracking)

---

## Vision & Goals

### Mission Statement
Create the most powerful, accessible, and extensible visual programming environment for creatives, enabling anyone from beginners to experts to build complex audio-visual experiences, IoT systems, and AI-powered applications.

### Primary Goals
1. **Accessibility**: Zero-code entry point for beginners
2. **Power**: Unlimited capability for advanced users
3. **Performance**: Real-time audio/video processing at 60fps
4. **Extensibility**: Drop-in custom nodes, WASM modules, Blockly scripts
5. **Portability**: Web + Desktop with graceful capability degradation
6. **Community**: Open-source with strong ecosystem support

### Target Users
- Visual artists and VJs
- Audio engineers and musicians
- Creative coders and generative artists
- IoT developers and hardware hackers
- AI/ML experimenters
- Educators and students
- Live performance artists

---

## Technology Stack

### Core Framework
| Layer | Technology | Rationale |
|-------|------------|-----------|
| UI Framework | Vue 3 + TypeScript | Reactive, component-based, excellent DX |
| Node Editor | Vue Flow | Native Vue 3, React Flow feature parity |
| State Management | Pinia | Official Vue store, TypeScript support |
| Styling | Tailwind CSS + Custom CSS | Design system tokens, rapid iteration |
| Build Tool | Vite | Fast HMR, native ESM, excellent plugin ecosystem |
| Desktop | Electron Forge | Official tooling, multi-platform builds |

### Execution Engine
| Component | Technology | Purpose |
|-----------|------------|---------|
| Graph Engine | Custom TypeScript | Flow execution, cycle detection, topological sort |
| Worker Pool | Web Workers | Parallel node execution |
| Audio Engine | Tone.js + Web Audio API | Synthesis, effects, scheduling |
| Audio Analysis | Meyda.js + web-audio-beat-detector | Feature extraction, BPM detection |
| Video Processing | ffmpeg.wasm | Encoding, decoding, filters |
| Graphics | WebGL2 + WebGPU (where available) | Shaders, 3D rendering |
| AI/ML | Transformers.js + ONNX Runtime | Browser-based inference |

### Communication & I/O
| Protocol | Web Support | Electron Support |
|----------|-------------|------------------|
| HTTP/REST | Full | Full |
| WebSocket | Full | Full |
| MQTT | Full (via ws) | Full (native TCP) |
| OSC | Limited | Full |
| MIDI | Web MIDI API | Full |
| Serial | Web Serial API (Chrome) | Full (serialport) |
| BLE | Web Bluetooth API | Full |
| File System | Limited (File System Access API) | Full |

### Storage
| Type | Technology | Use Case |
|------|------------|----------|
| Local State | IndexedDB (Dexie.js) | Flows, assets, cache |
| Settings | localStorage | User preferences |
| Cloud Sync | Optional (future) | Cross-device sync |

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLASP Flow App                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Editor    │  │   Control   │  │      Landing/Home       │ │
│  │    View     │  │    Panel    │  │         View            │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                     │                │
│  ┌──────┴────────────────┴─────────────────────┴──────────────┐ │
│  │                    Vue 3 + Vue Flow UI Layer               │ │
│  └────────────────────────────┬───────────────────────────────┘ │
│                               │                                 │
│  ┌────────────────────────────┴───────────────────────────────┐ │
│  │                      Pinia State Store                     │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │ │
│  │  │  Flows  │ │  Nodes  │ │ Runtime │ │    Settings     │  │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘  │ │
│  └────────────────────────────┬───────────────────────────────┘ │
│                               │                                 │
│  ┌────────────────────────────┴───────────────────────────────┐ │
│  │                    Execution Engine                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │ │
│  │  │    Graph    │  │   Worker    │  │    Message Bus      │ │ │
│  │  │  Scheduler  │  │    Pool     │  │   (EventEmitter)    │ │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │ │
│  └────────────────────────────┬───────────────────────────────┘ │
│                               │                                 │
│  ┌────────────────────────────┴───────────────────────────────┐ │
│  │                    Node Registry                            │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ │ │
│  │  │ Audio  │ │ Video  │ │Shaders │ │  Data  │ │  Custom  │ │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘ │ │
│  └────────────────────────────┬───────────────────────────────┘ │
│                               │                                 │
│  ┌────────────────────────────┴───────────────────────────────┐ │
│  │                Platform Abstraction Layer                   │ │
│  │  ┌─────────────────────┐  ┌─────────────────────────────┐  │ │
│  │  │   Web Capabilities  │  │   Electron Capabilities     │  │ │
│  │  │   - Web APIs        │  │   - Node.js APIs            │  │ │
│  │  │   - WASM            │  │   - Native modules          │  │ │
│  │  │   - Workers         │  │   - File system             │  │ │
│  │  └─────────────────────┘  └─────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Node System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Node Definition                          │
├──────────────────────────────────────────────────────────────┤
│  {                                                            │
│    "id": "audio-input",                                       │
│    "name": "Audio Input",                                     │
│    "category": "inputs",                                      │
│    "icon": "microphone",                                      │
│    "description": "Capture audio from microphone/device",     │
│    "platforms": ["web", "electron"],                          │
│    "inputs": [],                                              │
│    "outputs": [                                               │
│      { "id": "audio", "type": "audio", "label": "Audio" },   │
│      { "id": "level", "type": "number", "label": "Level" },  │
│      { "id": "beat", "type": "trigger", "label": "Beat" }    │
│    ],                                                         │
│    "controls": [                                              │
│      { "id": "source", "type": "select", "label": "Source" } │
│    ],                                                         │
│    "executor": "AudioInputNode",                              │
│    "ui": "AudioInputNodeUI" // Optional custom component      │
│  }                                                            │
└──────────────────────────────────────────────────────────────┘
```

### Data Types & Connection Colors

| Data Type | Color | Line Style | Description |
|-----------|-------|------------|-------------|
| `trigger` | `#F59E0B` (Warning/Orange) | Solid thin | Event/bang signals |
| `number` | `#2AAB8A` (Primary/Teal) | Solid | Numeric values |
| `string` | `#8B5CF6` (Purple) | Solid | Text data |
| `boolean` | `#EF4444` (Red) | Dotted | True/false |
| `audio` | `#22C55E` (Green) | Thick solid | Audio buffers |
| `video` | `#3B82F6` (Blue) | Thick solid | Video frames |
| `texture` | `#EC4899` (Pink) | Dashed | WebGL textures |
| `data` | `#6B7280` (Gray) | Solid | Generic JSON |
| `any` | `#FFFFFF` (White) | Dotted | Universal connector |

### Connection Animation States
- **Idle**: Static line
- **Active (data flowing)**: Animated dash/pulse moving along line
- **Error**: Red highlight, pulsing
- **Selected**: Thicker stroke, glow effect

---

## Project Phases

### Phase 0: Foundation ✅ COMPLETE
**Goal**: Project setup, architecture, core infrastructure

- [x] Project scaffolding (Vite + Vue 3 + TypeScript)
- [x] Electron integration with Forge
- [x] Design system implementation (tokens.css, base.css, components.css)
- [x] Vue Flow integration and customization (BaseNode component)
- [x] Core state management (Pinia stores: flows, nodes, runtime, ui)
- [x] Node registry system (with demo nodes)
- [x] Platform abstraction layer (web/electron detection)
- [x] Testing infrastructure (Vitest - 16 tests passing)
- [x] CI/CD pipeline (GitHub Actions - ci.yml, release.yml)
- [x] Documentation structure
- [x] Layout components (AppHeader, AppSidebar, StatusBar)
- [x] Core views (EditorView, ControlPanelView, SettingsView)

### Phase 1: Core Editor ✅ COMPLETE
**Goal**: Functional node editor with basic nodes

- [x] Node canvas with zoom/pan (Vue Flow)
- [x] Node palette/library sidebar (AppSidebar)
- [x] Node search functionality (fuzzy matching)
- [x] Connection drawing and validation (type checking)
- [x] Node selection and multi-select
- [x] Copy/paste/duplicate nodes (Ctrl+C/V/X/D)
- [x] Undo/redo system (Ctrl+Z, Ctrl+Shift+Z)
- [x] Mini-map component (Vue Flow MiniMap)
- [x] Keyboard shortcuts (delete, select all, copy, paste, undo/redo)
- [x] Basic nodes: Debug, Monitor, Constant, Math (demo nodes registered)
- [x] IndexedDB persistence with Dexie.js (auto-save)

### Phase 2: Data Flow ✅ COMPLETE
**Goal**: Working execution engine with data types

- [x] Graph execution (topological sort - Kahn's algorithm)
- [x] Data type validation
- [x] Connection type checking
- [ ] Worker thread execution (deferred)
- [x] Flow controls (start/stop/pause)
- [x] Real-time value inspection
- [x] Error handling and display
- [ ] Performance monitoring (deferred)
- [x] Logic nodes: Compare, Switch, Gate, And, Or, Not, Select
- [x] Math nodes: Add, Subtract, Multiply, Divide, MapRange, Clamp, Abs, Smooth, Random
- [x] Input nodes: Constant, Slider, Trigger, Time, LFO
- [x] Debug nodes: Monitor, Console

### Phase 3: Audio System ✅ COMPLETE
**Goal**: Full audio input/output/synthesis

- [x] Audio context management (AudioManager service)
- [x] Audio Input node (microphone)
- [x] Audio Output node (speakers)
- [ ] Audio Player node (files) (deferred)
- [x] Audio Analysis node (Meyda integration - level, bass, mid, high)
- [ ] Beat Detection node (deferred)
- [x] Oscillator node (sine, square, triangle, sawtooth)
- [ ] Envelope node (ADSR) (deferred)
- [x] Filter node (LP, HP, BP, Notch)
- [x] Effects nodes: Delay with feedback, Gain
- [ ] Audio visualization worker (deferred)

### Phase 4: Visual System ✅ COMPLETE
**Goal**: Video and shader processing

- [x] Video Input node (webcam via WebcamCapture service)
- [ ] Video Player node (files) (deferred)
- [x] Display Output node (TextureDisplay, MainOutput)
- [x] Shader node (GLSL editor with ShaderEditorModal)
- [x] Shadertoy compatibility layer (iTime, iResolution, iMouse, iChannel0)
- [x] Uniform detection and binding
- [x] Texture node (Color generator)
- [x] Blend modes node (normal, multiply, screen, overlay, etc.)
- [ ] Color adjustment nodes (deferred)
- [ ] ffmpeg.wasm integration (deferred)
- [ ] Video export (deferred)

### Phase 4.5: UI Enhancement ✅ COMPLETE
**Goal**: Improve node UI and workflow

- [x] Right-side Properties Panel (node info, controls, texture preview)
- [x] Inline node controls (sliders, toggles, selects, numbers)
- [x] Texture preview thumbnails on visual nodes
- [x] MainOutput node with large live preview canvas
- [x] ShaderEditorModal with live preview and Shadertoy hints
- [x] Simplified AppSidebar (just node palette)
- [x] TexturePreview reusable component

### Phase 5: Connectivity ✅ CORE COMPLETE
**Goal**: External communication protocols

- [x] HTTP Request node (GET/POST/PUT/DELETE/PATCH)
- [x] WebSocket node (connect, send, receive)
- [ ] MQTT node (deferred)
- [ ] OSC node (deferred - Electron only)
- [x] MIDI Input/Output nodes (Web MIDI API)
- [ ] Serial node (deferred - Web Serial / Electron)
- [ ] BLE node (deferred - Web Bluetooth / Electron)
- [ ] CLASP protocol integration (deferred)
- [x] JSON Parse node (with path navigation)
- [x] JSON Stringify node (with pretty print)

### Phase 6: AI Integration ✅ COMPLETE
**Goal**: Browser-based AI capabilities

- [x] Transformers.js integration (@huggingface/transformers)
- [x] Text generation node (GPT-2)
- [x] Text embedding node (feature extraction)
- [x] Image classification node (ViT)
- [x] Object detection node (DETR)
- [x] Sentiment analysis node
- [x] Image captioning node
- [ ] Speech-to-text node (deferred - Whisper available)
- [ ] Text-to-speech node (deferred)
- [ ] Custom ONNX model node (deferred)

### Phase 7: Advanced Features ✅ COMPLETE
**Goal**: Power-user features

- [x] Function node (JavaScript sandbox with state management)
- [x] Expression node (inline math with trig/utility functions)
- [x] Template node (string interpolation)
- [x] Counter node (stateful counter with min/max/wrap)
- [x] Toggle node (flip-flop with set/reset)
- [x] Sample & Hold node (capture value on trigger)
- [x] Value Delay node (frame-based delay buffer)
- [x] Subflows (reusable node groups with input/output ports)
  - Create from selection (Ctrl+G)
  - Edit subflow (Ctrl+E)
  - Unpack to nodes (Ctrl+Shift+G)
- [x] Control Panel view (ControlPanelView.vue)
  - Exposed controls with groups
  - Live value display
  - Edit mode for layout
  - View switching (Editor/Controls)
- [x] Multi-flow support (FlowTabs.vue)
  - Tab bar with all main flows
  - Create, close, rename, duplicate flows
  - Context menu with right-click
  - Persistence integration
- [ ] Blockly integration node (deferred)
- [ ] Custom node creation wizard (deferred - Phase 8)
- [ ] Node auto-discovery from folder (deferred - Phase 8)
- [ ] Flow linking (deferred)

### Phase 8: Custom Nodes ✅ COMPLETE
**Goal**: Extensible node system

- [x] Custom node loader system (CustomNodeLoader.ts)
- [x] Node package format specification (definition.json + executor.js)
- [x] Hot-reload support for custom nodes (file watcher)
- [x] Example custom nodes (double-value, random-range)
- [x] Node auto-discovery from folder
- [ ] Node development documentation (deferred)
- [ ] Node creation wizard UI (deferred)

### Phase 9: 3D System ✅ COMPLETE
**Goal**: 3D graphics capabilities

- [x] 3D Scene node
- [x] 3D Camera node (perspective/orthographic)
- [x] 3D Geometry nodes (Box, Sphere, Plane, Cylinder, Torus)
- [x] 3D Transform node (position/rotation/scale)
- [x] 3D Material node (Standard, Basic, Phong, Physical)
- [x] 3D Light nodes (Ambient, Directional, Point, Spot)
- [x] GLTF/GLB loader node
- [x] 3D to 2D render node (Render 3D)
- [x] Group 3D node (combine objects)
- [x] 7 new data types (scene3d, object3d, geometry3d, material3d, camera3d, light3d, transform3d)
- [x] ThreeRenderer service with render targets

### Phase 10: Polish & Export
**Goal**: Production-ready experience

- [ ] Mobile responsive UI
- [ ] Touch gesture support
- [ ] Dark/light theme
- [ ] Accessibility (a11y)
- [ ] Flow export/import
- [ ] Standalone runtime export
- [ ] Example flows library
- [ ] Tutorial system
- [ ] User documentation
- [ ] Landing page

### Phase 11: Distribution
**Goal**: Public release

- [ ] GitHub Actions multi-platform builds
- [ ] Auto-update system (Electron)
- [ ] NPM package for embeddable editor
- [ ] Landing website
- [ ] Community guidelines
- [ ] Contributor documentation
- [ ] Alpha release
- [ ] Beta testing
- [ ] v1.0 release

---

## Node Categories

### Debug
- **Monitor**: Display any value
- **Console**: Log to console
- **Meter**: Visual value meter

### Inputs
- **Audio Input**: Microphone/device capture
- **MIDI Input**: MIDI device messages
- **Video Input**: Webcam capture
- **MQTT Input**: MQTT subscription
- **OSC Input**: OSC messages (Electron)
- **Serial Input**: Serial port (Chrome/Electron)
- **BLE Input**: Bluetooth LE data
- **Trigger**: Manual trigger button
- **Slider**: Value 0-1
- **XY Pad**: 2D position input
- **Toggle**: Boolean switch
- **Knob**: Rotary control
- **LFO**: Low-frequency oscillator
- **Time**: Current time values
- **Constant**: Static value

### Outputs
- **Display**: Render visual output
- **Audio Output**: Play audio
- **MIDI Output**: Send MIDI
- **MQTT Output**: MQTT publish
- **OSC Output**: OSC messages (Electron)
- **Serial Output**: Serial write
- **BLE Output**: Bluetooth write
- **Layer Property**: Modify shader layer
- **Shader Uniform**: Set shader uniform
- **Effect Property**: Modify effect
- **Filter Property**: Modify filter

### Math
- **Add**: Sum values
- **Subtract**: Difference
- **Multiply**: Product
- **Divide**: Quotient
- **Map Range**: Remap value range
- **Clamp**: Constrain value
- **Smooth**: Smooth changes
- **Expression**: Math expression eval
- **Random**: Random number
- **Noise**: Perlin/Simplex noise

### Logic
- **Compare**: >, <, ==, etc.
- **And**: Logical AND
- **Or**: Logical OR
- **Not**: Logical NOT
- **Switch**: Multi-way branch
- **Gate**: Pass/block signal
- **Select**: Choose input
- **Counter**: Increment/decrement
- **Delay**: Delay signal
- **Debounce**: Rate limit

### Audio
- **Audio Input**: Capture
- **Audio Output**: Playback
- **Audio Player**: File playback
- **Audio Analysis**: Frequency/amplitude
- **Beat Detect**: BPM/beat extraction
- **Oscillator**: Basic waveforms
- **Envelope**: ADSR envelope
- **Filter**: LP/HP/BP/Notch
- **Delay**: Audio delay
- **Reverb**: Reverberation
- **Distortion**: Overdrive/fuzz
- **Compressor**: Dynamic range
- **Gain**: Volume control
- **Pan**: Stereo position
- **Mixer**: Multi-input mix

### Video
- **Video Input**: Webcam
- **Video Player**: File playback
- **Display**: Render output
- **Blend**: Blend modes
- **Transform**: Scale/rotate/translate
- **Crop**: Crop region
- **Color Adjust**: HSL/RGB adjust
- **Chroma Key**: Green screen
- **Effect**: Built-in effects
- **Feedback**: Video feedback

### Shaders
- **Shader**: GLSL editor
- **Uniform**: Shader input
- **Texture**: Image/video to texture
- **Shader Library**: Preset shaders
- **Shadertoy**: Shadertoy compat

### Data
- **HTTP Request**: REST calls
- **WebSocket**: WS connection
- **JSON Parse**: Parse JSON
- **JSON Stringify**: Serialize JSON
- **Object Get**: Get property
- **Object Set**: Set property
- **Array Operations**: Map/filter/reduce
- **Template**: String templates
- **Storage**: IndexedDB read/write
- **File**: File operations (Electron)

### AI
- **Text Generate**: LLM inference
- **Text Embed**: Embeddings
- **Classify Image**: Image classification
- **Detect Objects**: Object detection
- **Transcribe**: Speech-to-text
- **Speak**: Text-to-speech
- **Custom Model**: ONNX/WASM model

### Code
- **Function**: JavaScript sandbox
- **Blockly**: Visual code blocks
- **Expression**: Inline expression
- **WASM**: Custom WASM binary

### 3D
- **3D Scene**: Scene container
- **3D Camera**: Perspective/ortho
- **3D Geometry**: Primitives
- **3D Transform**: Position/rotation/scale
- **3D Material**: PBR materials
- **3D Light**: Point/spot/directional
- **3D Load**: GLTF/GLB models
- **3D Render**: Scene to texture

---

## Key Features

### 1. Smart Platform Detection
```typescript
// Nodes declare platform compatibility
const nodeDefinition = {
  platforms: ['web', 'electron'],
  // or
  platforms: ['electron'], // Desktop only
  // or
  webFallback: 'LimitedSerialNode' // Graceful degradation
};
```

### 2. Custom Node System
```
custom-nodes/
├── my-node/
│   ├── definition.json    # Node spec
│   ├── executor.ts        # Logic
│   ├── ui.vue            # Optional custom UI
│   └── icon.svg          # Optional icon
```

### 3. Control Panel View
- Nodes can expose "controls" that appear in a separate panel
- Controls are draggable/resizable widgets
- Perfect for live performance interfaces

### 4. Connection Visualization
- **Color by type**: Each data type has distinct color
- **Animated flow**: Dash animation when data passes
- **Thickness**: Signal strength/frequency
- **Style**: Solid (continuous), dashed (intermittent), dotted (boolean)

### 5. Multi-Flow Support
- Multiple flows in tabs
- Flows can reference each other
- Subflows for reusable components

### 6. Export Options
- **Flow JSON**: Portable flow definitions
- **Standalone App**: Electron package with embedded runtime
- **Web Embed**: Embeddable player for websites
- **Copy/Paste**: System clipboard support

---

## Design System

Based on the provided CLASP Design System:

### Colors
- **Primary**: Teal (#2AAB8A family)
- **Neutral**: Gray scale (#1A1A1A to #FFFFFF)
- **Semantic**: Success (#22C55E), Warning (#F59E0B), Error (#EF4444)
- **Selection**: Soft yellow (#FEF9E7)

### Typography
- **Font**: JetBrains Mono, Space Mono
- **Style**: Technical, monospace, industrial
- **Case**: Uppercase for labels, headers

### Components
- Sharp corners (border-radius: 0 or minimal)
- Offset box shadows (3-4px solid)
- Protocol badges (CLASP, OSC, MIDI, DMX)
- Status indicators with color-coded states
- Dark header/sidebar with light content

### Nodes (Enhanced from Screenshots)
- Rounded corners (subtle) for nodes
- Icon + title header
- Collapsible body
- Circular ports on edges
- Type-colored port indicators

---

## Testing Strategy

### Unit Tests (Vitest)
- Execution engine logic
- Node executors
- State management
- Utility functions
- Target: 80%+ coverage

### Component Tests (Vue Test Utils)
- Node components
- Panel components
- Form controls
- Dialogs/modals

### Integration Tests (Playwright)
- Flow creation workflows
- Node connection
- Import/export
- Audio/video (where possible)

### E2E Tests (Playwright)
- Full user journeys
- Multi-platform (web, Electron)
- Performance benchmarks

### Manual Testing
- Audio/video quality
- Hardware integration (MIDI, Serial)
- Cross-browser compatibility

---

## Build & Deployment

### Web Build
```bash
npm run build:web
# Outputs to dist/web/
# Deploy to Vercel/Netlify/GitHub Pages
```

### Electron Build (via GitHub Actions)
```yaml
# .github/workflows/build.yml
platforms:
  - windows (x64, arm64)
  - macos (x64, arm64)
  - linux (x64, arm64, AppImage, deb, rpm)
```

### Release Process
1. Version bump in package.json
2. Generate changelog
3. Create GitHub release
4. GitHub Actions builds all platforms
5. Auto-update notification for existing users

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| WebGPU adoption slow | Medium | Low | WebGL2 fallback ready |
| Audio latency issues | High | Medium | Web Audio tuning, Electron priority |
| WASM memory limits | Medium | Medium | Lazy loading, cleanup |
| Cross-browser compat | Medium | High | Progressive enhancement |
| Electron security | High | Medium | Context isolation, sandboxing |
| Scope creep | High | High | Strict phase gating |
| Performance at scale | High | Medium | Worker pools, virtualization |

---

## Progress Tracking

### Current Phase: 9 Complete
### Current Status: 3D system implemented with ThreeRenderer service, 17 node types, 7 new data types. Ready for Phase 10 (Polish & Export) or additional testing/deferred features.

### Milestone Checklist

#### Phase 0: Foundation ✅
- [x] Research complete
- [x] Architecture documented
- [x] Master plan created
- [x] Project scaffolded
- [x] Core infrastructure
- [x] CI/CD pipeline
- [x] Basic tests (16 passing)
- [x] TypeScript compilation clean
- [x] Web build verified

#### Phase 1: Core Editor ✅
- [x] Vue Flow canvas working
- [x] Node palette sidebar with fuzzy search
- [x] Demo nodes registered
- [x] Connection type validation
- [x] Node selection system (single + multi-select)
- [x] Undo/redo with command pattern
- [x] Keyboard shortcuts (Ctrl+Z/Y/A/C/V/X/D, Delete)
- [x] IndexedDB persistence with Dexie.js
- [x] Copy/paste/duplicate nodes
- [x] 56 unit tests passing

#### Phase 2: Data Flow Engine (Core) ✅
- [x] ExecutionEngine with topological sort (Kahn's algorithm)
- [x] Node executor system with built-in executors
- [x] Math executors: Add, Subtract, Multiply, Divide, MapRange, Clamp, Abs, Smooth, Random
- [x] Logic executors: Compare, And, Or, Not, Gate, Select, Switch
- [x] Input executors: Constant, Slider, Trigger, Time, LFO
- [x] Debug executors: Monitor, Console
- [x] Start/stop/pause playback controls
- [x] Real-time value inspection on nodes
- [x] Animated edges showing data flow
- [x] Runtime store for FPS, metrics, errors
- [x] Provide/inject for engine controls
- [ ] Worker thread pool (deferred)
- [ ] Performance monitoring UI (deferred)

#### Phase 3: Audio System (Core) ✅
- [x] Tone.js and Meyda.js installed
- [x] AudioManager service (context, devices, mic access)
- [x] Oscillator executor (sine, square, triangle, sawtooth)
- [x] Audio Input executor (microphone)
- [x] Audio Output executor (speakers)
- [x] Audio Analyzer executor (level, bass, mid, high)
- [x] Gain executor
- [x] Filter executor (lowpass, highpass, bandpass, notch)
- [x] Delay executor (feedback delay)
- [x] Audio node definitions in EditorView
- [ ] Beat detection (deferred)
- [ ] MIDI input/output (deferred)
- [ ] Audio file player (deferred)

#### Phase 4: Visual System ✅
- [x] ShaderRenderer service (WebGL2, Shadertoy compatibility)
- [x] WebcamCapture service
- [x] Shader executor with live GLSL editing
- [x] Webcam executor
- [x] Color generator executor
- [x] Texture Display executor
- [x] Blend executor (normal, multiply, screen, overlay, add, darken, lighten)
- [x] MainOutput executor for final render
- [x] Visual node definitions in EditorView
- [x] Vue Flow markRaw fixes for component reactivity
- [x] Persistence migration for visual node types

#### Phase 4.5: UI Enhancement ✅
- [x] PropertiesPanel.vue - Right-side panel with node info, controls, preview
- [x] TexturePreview.vue - Reusable canvas for texture preview
- [x] MainOutputNode.vue - Special viewer node with large preview
- [x] ShaderEditorModal.vue - Full shader editor with live preview
- [x] BaseNode.vue inline controls (sliders, toggles, selects, numbers)
- [x] BaseNode.vue texture preview thumbnails (120x80)
- [x] AppSidebar.vue simplified to node palette only
- [x] UI store restructured (propertiesPanelOpen, shaderEditor state)
- [x] 56 unit tests passing

#### Phase 5: Connectivity ✅
- [x] Connectivity executors file created
- [x] HTTP Request node (GET/POST/PUT/DELETE/PATCH with headers, body)
- [x] WebSocket node (connect, disconnect, send, receive)
- [x] MIDI Input node (notes, velocity, CC messages)
- [x] MIDI Output node (send notes with velocity)
- [x] JSON Parse node (with path navigation like "data.items[0]")
- [x] JSON Stringify node (with pretty print option)
- [x] Connectivity node definitions in EditorView
- [x] 56 unit tests passing

#### Phase 6: AI Integration ✅
- [x] Transformers.js installed (@huggingface/transformers)
- [x] AIInference service (model loading, caching, multiple tasks)
- [x] AI executors (6 node types)
- [x] Text Generation node (Xenova/gpt2)
- [x] Image Classification node (Xenova/vit-base-patch16-224)
- [x] Sentiment Analysis node (Xenova/distilbert-base)
- [x] Image Captioning node (Xenova/vit-gpt2-image-captioning)
- [x] Feature Extraction/Embedding node (Xenova/all-MiniLM-L6-v2)
- [x] Object Detection node (Xenova/detr-resnet-50)
- [x] AI node definitions in EditorView
- [x] 56 unit tests passing

#### Phase 7: Advanced Features ✅
- [x] Code executors created (Function, Expression, Template, Counter, Toggle, Sample-Hold, Value-Delay)
- [x] Function node with JavaScript sandbox
- [x] Expression node for inline math
- [x] Counter, Toggle, Sample & Hold, Value Delay nodes
- [x] Subflow system (isSubflow, subflowInputs, subflowOutputs)
- [x] Subflow executors (subflow-input, subflow-output, subflow)
- [x] Create/edit/unpack subflow actions
- [x] Keyboard shortcuts (Ctrl+G, Ctrl+E, Ctrl+Shift+G)
- [x] Control Panel view (ControlPanelView.vue)
- [x] ExposedControl and ControlPanelGroup system
- [x] View switching (Editor/Controls)
- [x] Control exposure UI in PropertiesPanel
- [x] Multi-flow support (FlowTabs.vue)
- [x] Tab context menu (rename, duplicate, close)
- [x] Tab persistence (save/delete to database)
- [x] 56 unit tests passing

#### Phase 8: Custom Nodes ✅
- [x] CustomNodeLoader service created
- [x] Definition validator module (validator.ts)
- [x] Executor compiler module (compiler.ts)
- [x] IPC handlers for file operations (main process)
- [x] Preload bindings for customNodes API
- [x] File watcher for hot-reload support
- [x] Example custom nodes (double-value, random-range)
- [x] Node package format: definition.json + executor.js
- [x] Auto-discovery from custom-nodes folder
- [x] EditorView integration
- [x] 56 unit tests passing

#### Phase 9: 3D System ✅
- [x] Three.js installed (three, @types/three)
- [x] ThreeRenderer service created
- [x] 3D executors file (3d.ts) with 17 node types
- [x] 7 new data types (scene3d, object3d, geometry3d, material3d, camera3d, light3d, transform3d)
- [x] Scene 3D executor (object collection, background, grid)
- [x] Camera 3D executor (perspective/orthographic)
- [x] Render 3D executor (scene to texture)
- [x] Geometry executors: Box, Sphere, Plane, Cylinder, Torus
- [x] Transform 3D executor (position/rotation/scale)
- [x] Material 3D executor (Standard, Basic, Phong, Physical)
- [x] Group 3D executor (combine objects)
- [x] Light executors: Ambient, Directional, Point, Spot
- [x] GLTF Loader executor
- [x] Type compatibility in connections.ts
- [x] 17 node definitions in EditorView
- [x] 56 unit tests passing

### Session Handoff
See: [docs/handoff/SESSION_HANDOFF.md](../handoff/SESSION_HANDOFF.md)

---

## Related Documents

- [Architecture Deep Dive](../architecture/ARCHITECTURE.md)
- [Node Specification](../architecture/NODE_SPEC.md)
- [Execution Engine](../architecture/EXECUTION_ENGINE.md)
- [Platform Abstraction](../architecture/PLATFORM_LAYER.md)
- [Session Handoff](../handoff/SESSION_HANDOFF.md)
- [User Guide](../user-guide/README.md)

---

## References & Resources

### Inspiration
- [TouchDesigner](https://derivative.ca/) - Real-time visual development
- [Node-RED](https://nodered.org/) - Flow-based IoT programming
- [Max/MSP](https://cycling74.com/) - Audio/visual patching
- [PureData](https://puredata.info/) - Open-source visual programming
- [nodes.io](https://nodes.io/) - Web-based creative coding

### Libraries
- [Vue Flow](https://vueflow.dev/) - Vue 3 flowchart library
- [Tone.js](https://tonejs.github.io/) - Web Audio framework
- [Meyda.js](https://meyda.js.org/) - Audio feature extraction
- [Transformers.js](https://huggingface.co/docs/transformers.js/) - Browser ML
- [ffmpeg.wasm](https://ffmpegwasm.netlify.app/) - Video processing
- [Google Blockly](https://developers.google.com/blockly) - Visual code blocks

### APIs
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
- [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)

---

*This document is the single source of truth for the CLASP Flow project. Update it as decisions are made and progress is achieved.*
