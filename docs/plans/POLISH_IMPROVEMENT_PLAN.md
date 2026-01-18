# CLASP Flow - Polish & Improvement Plan

**Created**: 2026-01-17
**Status**: COMPLETED
**Purpose**: Address gaps, bugs, and UX improvements identified in comprehensive audit
**Completed**: 2026-01-17

---

## Executive Summary

This plan addresses critical issues discovered during a deep audit of the CLASP Flow application, plus UI/UX improvements to match professional node-based editors like nodes.io, TouchDesigner, and Max/MSP.

---

## Part 1: Critical Bug Fixes

### 1.1 Delete Key Not Working [CRITICAL]
**Issue**: Delete key is explicitly disabled in EditorView.vue (line 2460: `:delete-key-code="null"`)
**Files**: `src/renderer/views/EditorView.vue`
**Fix**:
- Remove the null assignment to delete-key-code
- OR Add Delete/Backspace handler to `handleKeyDown` function
- Add delete button to node context menu
- Add delete button to Properties Panel header

### 1.2 Orphaned Exposed Controls [CRITICAL]
**Issue**: When nodes are deleted, their exposed controls remain in UI store
**Files**:
- `src/renderer/stores/ui.ts` (has `cleanupExposedControls` but never called)
- `src/renderer/stores/flows.ts` (needs to call cleanup on node removal)
- `src/renderer/views/EditorView.vue` (should cleanup on `onNodesChange`)
**Fix**:
- Call `uiStore.cleanupExposedControls(activeNodeIds)` in `onNodesChange` when deletions occur

### 1.3 Control Panel Not Showing Controls
**Issue**: Exposed controls not appearing in Control Panel view
**Investigation**:
- Check if `exposedControls` array is being populated
- Check if node IDs match between flows and exposedControls
- Check if control definitions are being resolved
**Fix**: Debug and fix the data flow from expose → storage → display

---

## Part 2: UI/UX Improvements

### 2.1 Properties Panel Styling Fix [HIGH]
**Issue**: White background extends past panel header
**Files**: `src/renderer/components/layout/PropertiesPanel.vue`
**Fix**:
- Add proper `overflow: hidden` or height constraints
- Ensure background only fills actual content area
- Fix `--radius-none` CSS variable references (lines 541, 626, 639)

### 2.2 Node Palette Redesign [HIGH]
**Current**: Flat list with category pill filters
**Desired**: Collapsible sections by category + dropdown filter by tag
**Files**: `src/renderer/components/layout/AppSidebar.vue`
**Changes**:
1. Replace pill filter with dropdown `<select>` at top
2. Group nodes by category in collapsible sections
3. Each section header shows category name, color, count, collapse toggle
4. Persist collapsed states in UI store

### 2.3 Control Node Redesign [HIGH]
**Reference**: nodes.io screenshots provided
**Files**:
- `src/renderer/components/nodes/BaseNode.vue`
- May need new specialized node components

**Changes needed**:
1. **Constant Node**:
   - Show large # icon with prominent value input
   - Colored border matching category

2. **Trigger Node**:
   - TYPE dropdown (Boolean/Number)
   - VALUE toggle (TRUE/FALSE with colored backgrounds)
   - Large TRIGGER button (orange/coral color)
   - Shows "Output: true/false"
   - When collapsed: becomes JUST the trigger button

3. **Slider Node**:
   - Prominent slider across full width
   - Value display on right
   - MIN/MAX inputs below slider

4. **Monitor Node**:
   - Pink/rose accent color
   - Display area showing input value
   - Dashed border style

5. **General improvements**:
   - Ports show type labels (0→1, bool, float, any, pulse)
   - Icons in node headers
   - Better typography and spacing

### 2.4 Shader Editor Monaco Integration [MEDIUM]
**Issue**: Uses basic `<textarea>` instead of Monaco Editor
**Files**: `src/renderer/components/modals/ShaderEditorModal.vue`
**Changes**:
1. Install `monaco-editor` package
2. Replace textarea with Monaco Editor component
3. Configure GLSL syntax highlighting
4. Add autocomplete for Shadertoy uniforms (iTime, iResolution, etc.)
5. Better error display with line highlighting

---

## Part 3: Node Compatibility Fixes

### 3.1 Orphan Data Types
- **geometry3d**: No producers - either create geometry nodes or remove type
- **video**: webcam outputs video but nothing consumes it
- **light3d**: Works via coercion but confusing
- **transform3d**: Output never consumed

### 3.2 Type Mismatches
- **envelope node**: Outputs `audio` but should output `number` (it's a control signal)
- **AI image nodes**: Accept `data` instead of `texture` - disconnect from visual pipeline
- **color node**: Outputs individual numbers, should output `data` color object

### 3.3 Missing Utility Nodes
- Type conversion nodes (number→string, texture→data for AI, etc.)
- Array manipulation nodes

---

## Part 4: Implementation Tasks

### Phase 1: Critical Bugs (Priority: P0)
- [x] Enable delete key in EditorView
- [x] Add delete button to Properties Panel
- [x] Fix exposed controls cleanup on node deletion
- [x] Debug and fix Control Panel display issue (added localStorage persistence)
- [x] Fix Properties Panel styling overflow

### Phase 2: Node Palette (Priority: P1)
- [x] Convert pill filters to dropdown
- [x] Implement collapsible category sections
- [x] Add node count badges per section
- [x] Persist collapse state (using local ref, can extend to UI store)

### Phase 3: Control Nodes (Priority: P1)
- [x] Create TriggerNode.vue specialized component
- [ ] Create ConstantNode.vue specialized component (deferred)
- [ ] Create SliderNode.vue specialized component (deferred)
- [x] Update BaseNode.vue with improved styling
- [x] Add icons to node headers (category-based icons)
- [x] Add type labels to ports

### Phase 4: Shader Editor (Priority: P2)
- [x] Install monaco-editor
- [x] Create MonacoEditor wrapper component
- [x] Replace textarea with Monaco in ShaderEditorModal
- [x] Add GLSL syntax highlighting
- [x] Add Shadertoy uniform autocomplete

### Phase 5: Node Compatibility (Priority: P2)
- [x] Reviewed envelope node output type (audio output is correct for GainNode)
- [x] Added texture→data converter node for AI pipeline
- [x] Documented type compatibility in connections.ts

---

## Reference Screenshots Analysis

Based on provided reference images (nodes.io style):

### Color Palette
- **Purple accents**: #7C3AED (primary actions, trigger type)
- **Green accents**: #10B981 (true/success states)
- **Orange accents**: #F97316 (trigger buttons)
- **Pink accents**: #EC4899 (monitor/debug nodes)
- **Blue accents**: #3B82F6 (input ports)
- **Background**: Warm beige/cream (#F5F0E8)
- **Node background**: White (#FFFFFF)
- **Borders**: Soft gray (#E5E7EB)

### Node Design Patterns
1. **Header**: Icon + Label + Collapse chevron (right aligned)
2. **Border**: 3px left border in category color
3. **Ports**:
   - Circles with type labels
   - Dashed lines for optional connections
   - Solid lines for active connections
4. **Controls**: Full-width, generous padding
5. **Shadow**: Subtle offset shadow (2-3px)

### Special Node Behaviors
- **Trigger collapsed**: Shows ONLY the trigger button (no header)
- **Constant**: Large centered value input
- **Monitor**: Dashed border, prominent value display
- **Audio**: Frequency visualization bars

---

## Success Criteria

1. Delete key removes selected nodes
2. Control Panel shows exposed controls correctly
3. Node palette has collapsible sections with dropdown filter
4. Properties panel doesn't overflow
5. Trigger node matches reference design (especially collapsed state)
6. Shader editor has syntax highlighting via Monaco
7. All node types have proper input/output compatibility

---

## Files to Modify

| File | Changes |
|------|---------|
| `EditorView.vue` | Delete key handling, node deletion cleanup |
| `PropertiesPanel.vue` | Styling fixes, delete button |
| `AppSidebar.vue` | Collapsible sections, dropdown filter |
| `BaseNode.vue` | Improved styling, icons, port labels |
| `TriggerNode.vue` | NEW - Specialized trigger component |
| `ConstantNode.vue` | NEW - Specialized constant component |
| `ShaderEditorModal.vue` | Monaco editor integration |
| `ui.ts` | Sidebar collapse states persistence |
| `flows.ts` | Node deletion cleanup integration |
| `package.json` | Add monaco-editor dependency |

---

## Estimated Effort

| Phase | Complexity | Tasks |
|-------|------------|-------|
| Phase 1 (Critical) | Medium | 5 |
| Phase 2 (Palette) | Medium | 4 |
| Phase 3 (Nodes) | High | 6 |
| Phase 4 (Monaco) | Medium | 5 |
| Phase 5 (Compat) | Low | 4 |

---

*Plan created after comprehensive audit of application code, reference screenshot analysis, and user feedback.*
