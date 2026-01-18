# UI Redesign Plan: Node Visualization & Properties Panel

## Problem Analysis

### Current Issues

1. **No Visual Output**: Texture Display and visual nodes don't actually show anything
   - The `ShaderRenderer` creates an offscreen canvas that's never mounted to the DOM
   - `textureDisplayExecutor` outputs `_display: canvas` but nothing displays it

2. **Properties Panel Misplaced**: Properties panel is a tab in the left sidebar
   - Should be its own dedicated panel on the right side
   - Left sidebar should only have node palette

3. **No Node Controls**: Nodes only show ports and output values
   - No inline sliders, toggles, color pickers
   - No visual preview thumbnails for texture nodes

4. **Shader Editing UX**: Shader code is just a control property
   - No dedicated editor modal
   - No live preview while editing

## Design Solution

### New Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           AppHeader                                  │
├──────────────┬────────────────────────────────┬─────────────────────┤
│   AppSidebar │                                │   PropertiesPanel   │
│   (Nodes)    │         EditorView             │   (Right side)      │
│              │         (VueFlow)              │                     │
│   - Search   │                                │   - Node info       │
│   - Category │                                │   - Controls        │
│   - Palette  │                                │   - Code editor btn │
│              │                                │                     │
├──────────────┴────────────────────────────────┴─────────────────────┤
│                           StatusBar                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Changes

#### 1. New `PropertiesPanel.vue` (Right side)
- Shows when a node is selected
- Displays:
  - Node name, category, description
  - All controls with proper UI (sliders, toggles, selects, color pickers)
  - "Open Shader Editor" button for shader nodes
  - Large texture preview for visual nodes

#### 2. Modified `AppSidebar.vue`
- Remove Properties and Controls tabs
- Only show node palette with search/filter

#### 3. Modified `App.vue` Layout
- Add PropertiesPanel to the right of EditorView
- Collapsible with state in uiStore

#### 4. Enhanced `BaseNode.vue`
- Add inline preview canvas for texture-type outputs
- Add compact inline controls (slider, toggle)
- Visual indicator for texture data

#### 5. New `VisualNode.vue`
- Specialized node for visual/shader nodes
- Embedded texture preview thumbnail (64x64 or 96x96)
- Click thumbnail to see full size in properties panel

#### 6. New `ShaderEditorModal.vue`
- Full-screen modal for shader editing
- Monaco editor or CodeMirror for GLSL
- Split view: code left, preview right
- Real-time compilation feedback
- Shadertoy uniform hints

#### 7. New `MainOutput.vue` node
- Special "Output" node that's the final destination
- Large preview area (can be resized)
- Fullscreen button
- Recording/export options (future)

### Data Flow for Texture Display

```
ShaderRenderer (offscreen)
       │
       ▼
   WebGLTexture
       │
       ▼
Node outputs.set('texture', texture)
       │
       ▼
runtimeStore.nodeMetrics.outputValues['texture']
       │
       ▼
BaseNode/VisualNode reads texture
       │
       ▼
Render to mini-canvas via readPixels or copyTexImage2D
```

### UI Store Updates

```typescript
// Add to ui.ts
propertiesPanelOpen: boolean
propertiesPanelWidth: number
shaderEditorOpen: boolean
shaderEditorNodeId: string | null
```

## Implementation Order

### Phase 1: Right Properties Panel
1. Create `PropertiesPanel.vue`
2. Update `App.vue` layout
3. Update `AppSidebar.vue` to remove tabs
4. Update `ui.ts` store

### Phase 2: Node Controls
1. Create control components (NodeSlider, NodeToggle, NodeSelect, NodeColorPicker)
2. Add control rendering to PropertiesPanel
3. Wire controls to node data updates
4. Test control updates flow through execution

### Phase 3: Texture Visualization
1. Create texture preview utility (WebGL to canvas/ImageData)
2. Add preview thumbnail to VisualNode
3. Create large preview in PropertiesPanel
4. Add MainOutput node with viewport

### Phase 4: Shader Editor Modal
1. Install Monaco or CodeMirror
2. Create ShaderEditorModal.vue
3. Add GLSL syntax highlighting
4. Add live preview rendering
5. Add Shadertoy compatibility hints

### Phase 5: Polish & Testing
1. Write unit tests for new components
2. Add E2E tests for texture visualization
3. Update documentation
4. Performance optimization

## Files to Create

```
src/renderer/components/
├── layout/
│   └── PropertiesPanel.vue       # Right-side properties panel
├── nodes/
│   ├── VisualNode.vue            # Specialized visual node with preview
│   └── MainOutputNode.vue        # Main output destination
├── controls/
│   ├── NodeSlider.vue            # Slider control
│   ├── NodeToggle.vue            # Toggle/checkbox
│   ├── NodeSelect.vue            # Dropdown select
│   ├── NodeColorPicker.vue       # Color picker
│   ├── NodeNumberInput.vue       # Number input
│   └── NodeTextInput.vue         # Text input
├── modals/
│   └── ShaderEditorModal.vue     # Full shader editor
└── preview/
    └── TexturePreview.vue        # Reusable texture preview canvas
```

## Files to Modify

```
src/renderer/
├── App.vue                       # Add PropertiesPanel to layout
├── components/
│   ├── layout/
│   │   └── AppSidebar.vue        # Remove Properties/Controls tabs
│   └── nodes/
│       └── BaseNode.vue          # Add inline controls/preview option
├── stores/
│   └── ui.ts                     # Add properties panel state
├── views/
│   └── EditorView.vue            # Register VisualNode, MainOutput types
└── engine/
    └── executors/visual.ts       # Expose canvas for preview
```

## Success Criteria

1. Visual nodes show preview thumbnails on the node itself
2. Properties panel shows on right when node selected
3. Controls in properties panel update node values in real-time
4. Shader editor modal allows editing with live preview
5. MainOutput node provides a clear "final output" destination
6. All changes are covered by tests
7. Documentation updated
