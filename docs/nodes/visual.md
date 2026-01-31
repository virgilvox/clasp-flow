# Visual Category

> Image/texture processing and shader effects using WebGL/Three.js in LATCH.

**Category Color:** Pink (`#EC4899`)
**Icon:** `image`

---

## Shader

Custom GLSL shader with dynamic uniform inputs.

### Info

Runs custom GLSL fragment shaders with automatic uniform detection. Declared uniforms become input ports so other nodes can feed values into the shader. Includes Shadertoy compatibility mode and a library of built-in presets for common effects and generators.

**Tips:**
- Start with a preset and modify the code to learn how the uniform-to-port system works.
- Disable Shadertoy mode if you want to write standard WebGL shaders with your own varying setup.
- Texture inputs iChannel0 through iChannel3 are always available regardless of what uniforms you declare.
- Connect a time node to a float uniform for animations that stay in sync with the rest of your flow.

**Works well with:** Time, LFO, Webcam, Blend, Texture Display

| Property | Value |
|----------|-------|
| **ID** | `shader` |
| **Icon** | `code` |
| **Version** | 3.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `iChannel0` | `texture` | Texture input channel 0 |
| `iChannel1` | `texture` | Texture input channel 1 |
| `iChannel2` | `texture` | Texture input channel 2 |
| `iChannel3` | `texture` | Texture input channel 3 |
| *(dynamic)* | varies | Generated from shader uniforms |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Rendered output texture |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `preset` | `select` | `custom` | Built-in shader presets |
| `code` | `code` | (default shader) | Fragment shader GLSL code |
| `vertexCode` | `code` | `''` | Optional vertex shader |
| `shadertoy` | `toggle` | `true` | Shadertoy compatibility mode |
| *(dynamic)* | varies | - | Generated from shader uniforms |

### Built-in Presets
- **Generators**: gradient, noise, plasma, circles, waves, voronoi
- **Effects**: chromatic-aberration, pixelate, vignette, glitch, edge-detect, kaleidoscope
- **Utility**: solid-color, uv-debug, passthrough
- **Artistic**: watercolor, halftone

### Implementation
Uses Three.js `ShaderMaterial` for WebGL rendering:
1. Parses GLSL code for `uniform` declarations
2. Generates dynamic input ports for user-defined uniforms
3. Provides Shadertoy-compatible built-in uniforms:
   - `iTime`: Time in seconds
   - `iResolution`: Output resolution
   - `iMouse`: Mouse position
   - `iChannel0-3`: Texture inputs

### Dynamic Uniform Detection
```glsl
uniform float u_brightness;  // -> creates number input
uniform vec3 u_color;        // -> creates data input
uniform sampler2D u_image;   // -> creates texture input
```

---

## Webcam

Capture video from camera.

### Info

Streams live video from a camera and outputs it as a continuously updating texture. Also provides a raw video element and the current resolution. This is the primary node for getting real-time camera input into a visual flow.

**Tips:**
- Disable the node when not in use to release the camera and free system resources.
- If you have multiple cameras, use the device selector to pick a specific one rather than relying on the default.
- The video element output can be fed into both shader and blend nodes simultaneously for parallel processing.

**Works well with:** Shader, Blend, Color Correction, Displacement, Texture Display

| Property | Value |
|----------|-------|
| **ID** | `webcam` |
| **Icon** | `camera` |
| **Version** | 1.0.0 |

### Inputs
*None*

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Video as texture |
| `video` | `video` | HTMLVideoElement |
| `width` | `number` | Video width |
| `height` | `number` | Video height |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `enabled` | `toggle` | `true` | - | Enable/disable capture |
| `device` | `select` | `default` | deviceType: 'video-input' | Camera device |

### Implementation
Uses `navigator.mediaDevices.getUserMedia()` to access camera. Creates a `VideoTexture` that updates each frame.

---

## Webcam Snapshot

Capture snapshots from webcam on trigger.

### Info

Captures a single still frame from the webcam each time it receives a trigger. Unlike the continuous webcam node, this only updates on demand. Outputs the captured texture, raw image data, and dimensions.

**Tips:**
- Connect an interval node to the trigger input to capture frames at a controlled rate lower than full video.
- Use the captured trigger output to chain actions that should happen only after a new frame is taken.
- The imageData output carries raw pixel data suitable for analysis nodes or the function node.

**Works well with:** Interval, Blend, Shader, Start, Color Correction

| Property | Value |
|----------|-------|
| **ID** | `webcam-snapshot` |
| **Icon** | `camera` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `trigger` | `trigger` | Capture snapshot |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Captured image as texture |
| `imageData` | `data` | Image data for AI processing |
| `width` | `number` | Image width |
| `height` | `number` | Image height |
| `captured` | `trigger` | Fires when capture completes |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `device` | `select` | `default` | deviceType: 'video-input' | Camera device |
| `resolution` | `select` | `720p` | options: 480p, 720p, 1080p | Capture resolution |
| `mirror` | `toggle` | `false` | - | Mirror horizontally |

### Implementation
Maintains a hidden video stream. On trigger, draws current frame to canvas and creates texture/imageData from it.

---

## Color

Create RGBA color values with individual channel control.

### Info

Creates an RGBA color value from individual channel sliders or numeric inputs. Outputs both the combined color object and separate R, G, B, A channel values. Useful as a color source for shaders and visual effects.

**Tips:**
- Connect LFO nodes to individual channels to create animated color cycling without writing shader code.
- Use the separate channel outputs to feed different parts of a flow with the same base color values.
- Set alpha below 1.0 when using this as a tint layer through a blend node in normal mode.

**Works well with:** Shader, Blend, LFO, Color Correction, Map Range

| Property | Value |
|----------|-------|
| **ID** | `color` |
| **Icon** | `palette` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `r` | `number` | Red channel override |
| `g` | `number` | Green channel override |
| `b` | `number` | Blue channel override |
| `a` | `number` | Alpha channel override |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `color` | `data` | Color object {r, g, b, a} |
| `r` | `number` | Red value (0-1) |
| `g` | `number` | Green value (0-1) |
| `b` | `number` | Blue value (0-1) |
| `a` | `number` | Alpha value (0-1) |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `r` | `slider` | `1` | min: 0, max: 1 | Red |
| `g` | `slider` | `1` | min: 0, max: 1 | Green |
| `b` | `slider` | `1` | min: 0, max: 1 | Blue |
| `a` | `slider` | `1` | min: 0, max: 1 | Alpha |

---

## Texture Display

Display a texture for preview.

### Info

Renders an input texture directly onto a visible canvas in the node. This is the simplest way to preview any texture output without routing it to the main output. It has no controls and no outputs.

**Tips:**
- Place one after each major processing step to visually debug your texture pipeline.
- This node does not pass the texture through, so branch the connection if you also need to continue the chain.
- Use it alongside the main-output node to compare intermediate results with the final render.

**Works well with:** Shader, Blend, Webcam, Main Output, Color Correction

| Property | Value |
|----------|-------|
| **ID** | `texture-display` |
| **Icon** | `monitor` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Texture to display |

### Outputs
*None*

### Controls
*None*

### Implementation
Renders the input texture to the node's preview area. Used for debugging/monitoring visual pipelines.

---

## Blend

Blend two textures using various blend modes.

### Info

Combines two texture inputs into a single output using a selectable blend mode and a mix slider. Supports normal, add, multiply, screen, and overlay modes. This is the standard way to layer visuals together.

**Tips:**
- Animate the mix value with an LFO to crossfade between two sources rhythmically.
- Add mode is useful for combining bright elements on dark backgrounds without washing out the image.
- Chain multiple blend nodes to composite more than two layers together.

**Works well with:** Shader, Webcam, Color Correction, LFO, Image Loader

| Property | Value |
|----------|-------|
| **ID** | `blend` |
| **Icon** | `layers` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `texture` | Base texture |
| `b` | `texture` | Blend texture |
| `mix` | `number` | Mix amount override |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Blended result |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `mix` | `slider` | `0.5` | min: 0, max: 1 | Blend amount |
| `mode` | `select` | `normal` | options: normal, add, multiply, screen, overlay | Blend mode |

### Implementation
Uses a shader that implements blend modes:
- **normal**: Linear interpolation
- **add**: `a + b`
- **multiply**: `a * b`
- **screen**: `1 - (1-a) * (1-b)`
- **overlay**: Conditional multiply/screen

---

## Blur

Apply Gaussian blur to texture.

### Info

Applies a Gaussian blur to the input texture. The radius controls how far the blur spreads, and the passes control determines quality. More passes produce a smoother result at the cost of performance.

**Tips:**
- Keep passes at 2 or 3 for a good balance between quality and speed; going above 5 rarely looks different.
- Animate the radius with an LFO for a pulsing depth-of-field effect.
- Use a small blur radius as a noise reduction step before feeding into edge detection or color correction.

**Works well with:** Shader, Blend, Color Correction, LFO, Displacement

| Property | Value |
|----------|-------|
| **ID** | `blur` |
| **Icon** | `droplet` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Input texture |
| `radius` | `number` | Blur radius override |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Blurred result |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `radius` | `slider` | `5` | min: 0, max: 50 | Blur radius (pixels) |
| `passes` | `number` | `2` | min: 1, max: 10 | Number of blur passes |

### Implementation
Uses separable Gaussian blur (horizontal then vertical passes) for efficiency. Multiple passes increase blur quality.

---

## Color Correction

Adjust brightness, contrast, saturation, hue, and gamma.

### Info

Adjusts brightness, contrast, saturation, hue, and gamma of an input texture. All parameters can be driven by external inputs, making it easy to animate color grading in real time.

**Tips:**
- Drive the hue input with an LFO for a continuously shifting color palette effect.
- Set saturation to 0 to convert any texture to grayscale before further processing.
- Small gamma adjustments (0.8 to 1.2) can significantly improve perceived contrast without clipping highlights.

**Works well with:** Webcam, Blend, Shader, LFO, Image Loader

| Property | Value |
|----------|-------|
| **ID** | `color-correction` |
| **Icon** | `palette` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Input texture |
| `brightness` | `number` | Brightness override |
| `contrast` | `number` | Contrast override |
| `saturation` | `number` | Saturation override |
| `hue` | `number` | Hue shift override |
| `gamma` | `number` | Gamma override |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Corrected result |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `brightness` | `slider` | `0` | min: -1, max: 1 | Brightness adjustment |
| `contrast` | `slider` | `1` | min: 0, max: 3 | Contrast multiplier |
| `saturation` | `slider` | `1` | min: 0, max: 3 | Saturation multiplier |
| `hue` | `slider` | `0` | min: -180, max: 180 | Hue rotation (degrees) |
| `gamma` | `slider` | `1` | min: 0.1, max: 3 | Gamma correction |

---

## Displacement

Displace texture using a displacement map.

### Info

Warps the input texture by using a second texture as a displacement map. The brightness values of the displacement map shift pixel positions in the source. Strength controls how far pixels are moved, and channel selects which map channels drive the displacement axes.

**Tips:**
- Feed a noise shader into the displacement map input for organic, fluid-like distortion.
- Animate the strength value with an LFO to pulse the distortion in and out.
- The rg channel mode gives independent horizontal and vertical displacement; use r for horizontal only.

**Works well with:** Shader, Blur, Webcam, LFO, Blend

| Property | Value |
|----------|-------|
| **ID** | `displacement` |
| **Icon** | `move` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Source texture |
| `displacement` | `texture` | Displacement map |
| `strength` | `number` | Strength override |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Displaced result |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `strength` | `slider` | `0.1` | min: 0, max: 1 | Displacement strength |
| `channel` | `select` | `rg` | options: r, rg, rgb | Channel(s) for displacement |

---

## Transform 2D

Apply 2D transforms to texture.

### Info

Applies scale, rotation, and translation transforms to a texture. All parameters accept external inputs so they can be animated. This is the standard way to reposition or resize a texture layer before blending or display.

**Tips:**
- Drive the rotation input with an LFO for a continuously spinning texture effect.
- Scale values below 1.0 shrink the texture, revealing the border; combine with blend to composite over a background.
- Translation values are normalized, so 0.5 moves the texture halfway across the frame.

**Works well with:** Blend, Shader, LFO, Webcam, Displacement

| Property | Value |
|----------|-------|
| **ID** | `transform-2d` |
| **Icon** | `move-3d` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Input texture |
| `scaleX` | `number` | Scale X override |
| `scaleY` | `number` | Scale Y override |
| `rotate` | `number` | Rotation override |
| `translateX` | `number` | Translate X override |
| `translateY` | `number` | Translate Y override |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Transformed result |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `scaleX` | `slider` | `1` | min: 0.1, max: 5 | Horizontal scale |
| `scaleY` | `slider` | `1` | min: 0.1, max: 5 | Vertical scale |
| `rotate` | `slider` | `0` | min: -180, max: 180 | Rotation (degrees) |
| `translateX` | `slider` | `0` | min: -1, max: 1 | Horizontal offset |
| `translateY` | `slider` | `0` | min: -1, max: 1 | Vertical offset |

---

## Image Loader

Load images from URL, file, or asset library.

### Info

Loads a still image from a URL, local file, or the built-in asset library and outputs it as a texture. Also provides the image dimensions and a loading state. Supports reload via trigger input.

**Tips:**
- Use the reload trigger input to swap images at runtime without rebuilding connections.
- Set cross-origin to none when loading local files to avoid unnecessary CORS restrictions.
- The loading output can gate downstream nodes so they only process after the image is ready.

**Works well with:** Blend, Shader, Displacement, Color Correction, Start

| Property | Value |
|----------|-------|
| **ID** | `image-loader` |
| **Icon** | `image` |
| **Version** | 1.1.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `url` | `string` | Image URL override |
| `trigger` | `trigger` | Reload image |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Loaded image as texture |
| `width` | `number` | Image width |
| `height` | `number` | Image height |
| `loading` | `boolean` | Loading state |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `assetId` | `asset-picker` | `null` | assetType: 'image' | Select from asset library |
| `url` | `text` | `''` | - | Direct URL input |
| `crossOrigin` | `select` | `anonymous` | options: anonymous, use-credentials, none | CORS mode |

---

## Video Player

Play video from URL.

### Info

Plays a video file from a URL and outputs its frames as a texture. Provides playback controls including play, pause, seek, loop, and playback rate. Also outputs current time, duration, and a normalized progress value.

**Tips:**
- Use the progress output (0 to 1) with map-range to sync other parameters to the video timeline.
- Set loop to true and connect a metronome to the seek input to create rhythmic video scrubbing.
- The video element output can be shared with other nodes that accept raw video for additional processing.

**Works well with:** Blend, Shader, Color Correction, Metronome, Texture Display

| Property | Value |
|----------|-------|
| **ID** | `video-player` |
| **Icon** | `play-circle` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `url` | `string` | Video URL override |
| `play` | `trigger` | Start playback |
| `pause` | `trigger` | Pause playback |
| `seek` | `number` | Seek to time (seconds) |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Video as texture |
| `video` | `video` | HTMLVideoElement |
| `playing` | `boolean` | Playing state |
| `time` | `number` | Current time (s) |
| `duration` | `number` | Total duration (s) |
| `progress` | `number` | Progress (0-1) |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `url` | `text` | `''` | - | Video URL |
| `autoplay` | `toggle` | `false` | - | Auto-start on load |
| `loop` | `toggle` | `true` | - | Loop playback |
| `playbackRate` | `number` | `1` | min: 0.25, max: 4 | Playback speed |
| `volume` | `slider` | `0.5` | min: 0, max: 1 | Audio volume |

---

## Rendering Architecture

The visual system uses Three.js for all GPU rendering operations:

### Texture Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    ThreeShaderRenderer                          │
├─────────────────────────────────────────────────────────────────┤
│ • Manages WebGLRenderer and WebGLRenderTargets                  │
│ • Compiles GLSL shaders to Three.js ShaderMaterial              │
│ • Renders shaders to render targets (THREE.Texture output)      │
│ • Provides renderToCanvas() for GPU → 2D canvas display         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ExecutionEngine                               │
├─────────────────────────────────────────────────────────────────┤
│ • Stores node outputs in nodeOutputs Map<nodeId, Map<port, val>>│
│ • THREE.Texture objects stored directly (not converted)         │
│ • Provides getNodeTexture() for direct texture access           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              MainOutputNode / TexturePreview                     │
├─────────────────────────────────────────────────────────────────┤
│ • Gets texture directly from ExecutionEngine                    │
│ • Uses ThreeShaderRenderer.renderToCanvas() for display         │
│ • Bypasses Vue reactivity (which loses texture identity)        │
└─────────────────────────────────────────────────────────────────┘
```

### Key Services

| Service | Location | Purpose |
|---------|----------|---------|
| `ThreeShaderRenderer` | `services/visual/ThreeShaderRenderer.ts` | GLSL shader compilation and rendering |
| `ThreeRenderer` | `services/visual/ThreeRenderer.ts` | 3D scene rendering |
| `UnifiedRenderer` | `services/visual/UnifiedRenderer.ts` | PixiJS 8 + Three.js shared context (future) |
| `TextureBridge` | `services/visual/TextureBridge.ts` | Texture format conversion (future) |

### Interop Scenarios

All visual pipelines ultimately output `THREE.Texture`:

1. **Shader → OUTPUT**: ShaderMaterial renders to WebGLRenderTarget → texture output
2. **Webcam → Shader → OUTPUT**: VideoTexture → shader iChannel0 input → processed output
3. **3D → Shader → OUTPUT**: ThreeRenderer scene → render target texture → shader input
4. **Multi-shader chains**: Shader A output → Shader B iChannel0 → final output
