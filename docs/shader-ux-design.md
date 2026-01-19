# Shader Node UX Design

## Current State Analysis

The shader node system is already well-implemented with:
- ✅ **Inline Preview** - TexturePreview component shows shader output in node
- ✅ **Dynamic Ports** - Uniforms become input ports automatically
- ✅ **Inline Controls** - Sliders/color pickers for uniform values
- ✅ **Shader Editor Modal** - Full GLSL editing with Monaco Editor
- ✅ **Preset System** - Pre-built shaders with categories

## Smart Node Design Philosophy Audit

### 1. Progressive Disclosure ⚠️ Partial
**Current**: Shows all controls at once
**Improvement**:
- Default to "Preset" mode with preset picker
- "Advanced" mode reveals code editing
- Collapse uniform controls into expandable section

### 2. Visual Feedback Always ✅ Good
**Current**: TexturePreview shows real-time shader output
**Improvement**:
- Add compilation status indicator
- Show errors inline (red border, error icon)

### 3. Smart Defaults ✅ Good
**Current**: Default preset provides working shader
**Improvement**:
- Remember last-used preset per user

### 4. Discovery Over Configuration ⚠️ Partial
**Current**: Preset dropdown is text-based
**Improvement**:
- Visual preset gallery with thumbnails
- Categorized preset browser

### 5. Graceful Degradation ✅ Good
**Current**: Platform checks already in place
**Improvement**: N/A

### 6. State Visibility ⚠️ Partial
**Current**: No error/status outputs
**Improvement**:
- Add `error` output (string)
- Add `compiling` output (boolean)
- Show error message in node footer

---

## Proposed UX Improvements

### Phase 1: Error State Visibility

**Goal**: Make shader compilation errors visible without opening the editor.

**Implementation**:
1. Add error state tracking in executor
2. Add `_error` output (already exists, just expose it)
3. Style node with error indication:
   - Red border when error
   - Error icon in header
   - Tooltip with error message

**Visual Design**:
```
┌─────────────────────────────┐
│ ⚠️ SHADER          [error]  │  <- Red header when error
├─────────────────────────────┤
│ [Shader Preview - blank/red]│
├─────────────────────────────┤
│ Preset: [waves ▾]           │
│ Error: u_foo undeclared     │  <- Error message shown
└─────────────────────────────┘
```

### Phase 2: Improved Preset Picker

**Goal**: Visual discovery of presets.

**Implementation**:
1. Replace dropdown with visual grid popup
2. Show thumbnail preview for each preset
3. Group by category with headers

**Visual Design**:
```
┌─────────────────────────────────────────┐
│ GENERATORS                              │
│ [grad] [noise] [plasma] [circles]       │
│ [waves] [voronoi]                       │
├─────────────────────────────────────────┤
│ EFFECTS                                 │
│ [chrom] [pixel] [vignette] [glitch]     │
│ [edge] [kaleid]                         │
├─────────────────────────────────────────┤
│ UTILITY                                 │
│ [solid] [uv] [pass]                     │
└─────────────────────────────────────────┘
```

### Phase 3: Shader Code Control Improvement

**Goal**: Better differentiation between preset and custom code.

**Current Flow**:
1. User selects preset
2. Preset code loaded into hidden "code" field
3. User can edit via "Edit Code" in properties panel

**Improved Flow**:
1. User selects preset → shows "Using Preset: waves"
2. User clicks "Customize" → copies preset to custom code
3. Custom mode shows "Edit Code" button
4. Clear indicator of preset vs custom mode

**Visual Design**:
```
Preset Mode:
┌─────────────────────────────┐
│ 🎨 SHADER                   │
├─────────────────────────────┤
│ [Preview]                   │
├─────────────────────────────┤
│ Preset: [waves ▾]           │
│ [✏️ Customize...]           │
├─────────────────────────────┤
│ Frequency: [====○===] 10.0  │
│ Amplitude: [==○======] 0.10 │
└─────────────────────────────┘

Custom Mode:
┌─────────────────────────────┐
│ 🎨 SHADER (Custom)          │
├─────────────────────────────┤
│ [Preview]                   │
├─────────────────────────────┤
│ [📝 Edit Code...]           │
│ [↩️ Revert to Preset]       │
├─────────────────────────────┤
│ u_brightness: [===○===] 0.5 │
└─────────────────────────────┘
```

### Phase 4: Quick Uniform Tweaking

**Goal**: Faster iteration on uniform values.

**Current**: Inline sliders in node
**Improvement**:
- Add number input next to slider for precision
- Add reset-to-default button per uniform
- Add link/unlink for vec2/vec3/vec4

**Visual Design**:
```
u_color: [R][G][B] 🔗  [↺]
          0.5 0.5 0.5

u_scale: [====○======] [5.0] [↺]
```

---

## Implementation Priority

1. **High Value, Low Effort**:
   - Error state visibility in node
   - Compilation status indicator

2. **High Value, Medium Effort**:
   - Visual preset picker popup
   - Preset vs Custom mode distinction

3. **Medium Value, High Effort**:
   - Preset thumbnails (requires pre-rendering)
   - Advanced uniform controls (link/unlink, reset)

---

## Technical Implementation Notes

### Error State Visibility

1. The executor already sets `_error` output
2. BaseNode needs to read and display `_error`
3. Add conditional styling based on error state

```typescript
// In BaseNode.vue
const nodeError = computed(() => {
  const metrics = runtimeStore.nodeMetrics.get(props.id)
  return metrics?.outputValues?.['_error'] as string | null
})
```

### Visual Preset Picker

1. Create `ShaderPresetPicker.vue` component
2. Pre-render preset thumbnails on first load (store in sessionStorage)
3. Use Teleport for popup positioning

### Preset vs Custom Mode

1. Track `isCustom` state in node data
2. "Customize" copies preset code to custom field
3. "Revert" clears custom and reselects preset

---

## Conclusion

The shader system has a solid foundation. The key improvements focus on:
1. **Visibility** - Making errors and status visible
2. **Discovery** - Visual preset browsing
3. **Clarity** - Clear preset vs custom mode

These changes follow the Smart Node Design Philosophy by prioritizing visual feedback, progressive disclosure, and discovery over configuration.
