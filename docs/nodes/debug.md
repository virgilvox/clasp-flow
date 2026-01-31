# Debug Category

> Visualization and debugging tools for inspecting data flow in LATCH.

**Category Color:** Purple (`#8B5CF6`)
**Icon:** `bug`

---

## Console

Log values to the browser's developer console.

### Info

Prints the incoming value to the browser developer console. Useful for quick debugging when you need to inspect raw data flowing through a connection. Set a label to distinguish logs from different Console nodes.

**Tips:**
- Disable "On Change" to stop continuous logging of high-frequency signals like audio or LFOs.
- Open the browser DevTools console to see the output since it does not display inside the node itself.

**Works well with:** Monitor, JSON Parse, JSON Stringify, Type Of

| Property | Value |
|----------|-------|
| **ID** | `console` |
| **Icon** | `terminal` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `any` | Value to log |

### Outputs
*None*

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `label` | `text` | `'Log'` | Prefix label for log messages |
| `logOnChange` | `toggle` | `true` | Only log when value changes |

### Implementation
Logs values using `console.log()` with the configured label prefix. When `logOnChange` is enabled, uses deep equality comparison to avoid flooding the console.

---

## Monitor

Display input values directly in the node body.

### Info

Displays the current value of any input directly on the node. It also passes the value through to its output, so you can insert it inline without breaking a connection. The simplest way to see what a signal is doing.

**Tips:**
- Insert a Monitor between two connected nodes to inspect values without rewiring anything.
- Works with any data type including numbers, strings, booleans, and objects.

**Works well with:** Console, Graph, Oscilloscope, Changed, Type Of

| Property | Value |
|----------|-------|
| **ID** | `monitor` |
| **Icon** | `eye` |
| **Version** | 1.0.0 |
| **Custom UI** | Yes (`MonitorNode.vue`) |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `any` | Value to display |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `any` | Pass-through of input value |

### Controls
*None*

### Implementation
Custom Vue component that renders the incoming value inline. Handles different types:
- Numbers: Formatted with precision
- Strings: Displayed as-is (truncated if long)
- Booleans: Shows true/false with color
- Objects/Arrays: JSON formatted
- null/undefined: Shows placeholder

Acts as a pass-through, outputting the same value it receives.

---

## Oscilloscope

Visualize signal waveforms over time.

### Info

Draws a scrolling waveform of a numeric signal or audio input over time. Use it to inspect the shape and timing of any continuous signal. Accepts both plain number values and audio connections.

**Tips:**
- Increase the time scale to see more of the waveform history in the display.
- Lower the amplitude if the signal clips beyond the visible area.
- Connect the audio input for Web Audio signals and the signal input for regular numeric streams.

**Works well with:** LFO, Oscillator, Audio Analyzer, Equalizer, Envelope

| Property | Value |
|----------|-------|
| **ID** | `oscilloscope` |
| **Icon** | `activity` |
| **Version** | 1.0.0 |
| **Custom UI** | Yes (`OscilloscopeNode.vue`) |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `signal` | `number` | Numeric signal to display |
| `audio` | `audio` | Audio signal to display waveform |

### Outputs
*None*

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `timeScale` | `slider` | `1` | min: 0.25, max: 4, step: 0.25 | Horizontal scale (samples visible) |
| `amplitude` | `slider` | `1` | min: 0.1, max: 2, step: 0.1 | Vertical amplitude scale |

### Implementation
Custom Vue component with Canvas 2D rendering:
- For numeric signals: Records samples in a ring buffer, renders as line graph
- For audio: Uses Web Audio `AnalyserNode.getTimeDomainData()` to get waveform

Renders a retro-style oscilloscope with:
- Grid lines
- Center line
- Green phosphor-like trace
- Auto-scaling based on amplitude control

---

## Graph

Plot X/Y values with multiple data series.

### Info

Plots one or more X/Y data points on a 2D chart. Supports line and scatter modes. Use it to visualize the relationship between two signals or to trace a path over time.

**Tips:**
- Increase the point count control to add more input pairs for comparing multiple data series.
- Disable auto scale and set manual axis ranges when you need a fixed reference frame.
- Feed an LFO into X and another into Y to visualize Lissajous figures.

**Works well with:** Oscillator, LFO, Smooth, Map Range, XY Pad

| Property | Value |
|----------|-------|
| **ID** | `graph` |
| **Icon** | `line-chart` |
| **Version** | 1.0.0 |
| **Custom UI** | Yes (`GraphNode.vue`) |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `x0` | `number` | X value for point 0 |
| `y0` | `number` | Y value for point 0 |
| (dynamic) | `number` | Additional x1/y1, x2/y2, etc. based on pointCount |

### Outputs
*None*

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `pointCount` | `number` | `1` | min: 1, max: 8 | Number of data points to plot |
| `displayMode` | `select` | `line` | options: line, scatter | How to render the data |
| `showGrid` | `toggle` | `true` | - | Show grid lines |
| `autoScale` | `toggle` | `true` | - | Auto-adjust axis ranges |

### Implementation
Custom Vue component that dynamically generates input ports based on `pointCount`. Uses Canvas 2D to render:
- Line mode: Connects points with lines (history over time)
- Scatter mode: Plots individual X/Y points

Features:
- Configurable grid
- Auto-scaling axes
- Multiple series with different colors

---

## Equalizer

Visualize audio frequency spectrum as animated bars.

### Info

Shows the frequency spectrum of an audio signal as animated bars. Connect any audio source to see a real-time breakdown of low, mid, and high frequencies. Helpful for verifying filter or EQ behavior at a glance.

**Tips:**
- Lower the smoothing value to make the bars react faster to transients.
- Use "spectrum" color mode to map bar color to frequency, making it easier to spot dominant bands.

**Works well with:** Audio Analyzer, Filter, Parametric EQ, Audio Input, Oscilloscope

| Property | Value |
|----------|-------|
| **ID** | `equalizer` |
| **Icon** | `bar-chart-3` |
| **Version** | 1.0.0 |
| **Custom UI** | Yes (`EqualizerNode.vue`) |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal to analyze |

### Outputs
*None*

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `barCount` | `slider` | `16` | min: 8, max: 32, step: 4 | Number of frequency bars |
| `colorMode` | `select` | `gradient` | options: gradient, spectrum, solid | Bar coloring mode |
| `smoothing` | `slider` | `0.8` | min: 0, max: 0.95, step: 0.05 | Temporal smoothing factor |

### Implementation
Custom Vue component using Web Audio API:

1. Creates an `AnalyserNode` connected to the audio input
2. Calls `getByteFrequencyData()` on each animation frame
3. Bins the frequency data into the configured number of bars
4. Renders bars with fall-off animation using Canvas 2D

Color modes:
- `gradient`: Green to red based on amplitude
- `spectrum`: Rainbow colors across frequency range
- `solid`: Single color for all bars

---

## Usage Examples

### Debugging Numeric Values
```
[LFO] --value--> [Monitor]
      --value--> [Next Node]
```

### Audio Visualization
```
[Audio Input] --audio--> [Oscilloscope]
              --audio--> [Equalizer]
```

### Watching Expressions
```
[Expression] --result--> [Console]
             --result--> [Graph]
```

### Multi-Channel Plotting
```
[LFO (sin)] --value--> [Graph/y0]
[LFO (cos)] --value--> [Graph/y1]
[Time] --time--> [Graph/x0, x1]
```
