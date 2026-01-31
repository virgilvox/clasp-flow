# Timing Category

> Time-based nodes, oscillators, and clock sources in LATCH.

**Category Color:** Orange (`#F97316`)
**Icon:** `clock`

---

## Time

Provides current time, delta time, and frame count.

### Info

Outputs the current elapsed time in seconds, the delta time between frames, and the current frame number. These values update every frame and are the primary way to drive continuous animations.

**Tips:**
- Use the delta output to make animations frame-rate independent by multiplying movement values by it.
- The time output grows without bound, so use modulo via an expression node if you need a repeating cycle.
- Feed the frame output into a modulo expression to trigger something every Nth frame.

**Works well with:** Expression, Shader, LFO, Smooth, Map Range

| Property | Value |
|----------|-------|
| **ID** | `time` |
| **Icon** | `clock` |
| **Version** | 1.0.0 |

### Inputs
*None*

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `time` | `number` | Time in seconds since flow started |
| `delta` | `number` | Time since last frame (seconds) |
| `frame` | `number` | Current frame number |

### Controls
*None*

### Implementation
Uses the execution engine's timing system:
- `time`: `performance.now() / 1000` relative to flow start
- `delta`: Difference between current and previous frame time
- `frame`: Incrementing frame counter

---

## LFO

Low Frequency Oscillator - generates periodic waveforms.

### Info

Generates a continuous oscillating value at a given frequency, amplitude, and offset. Supports sine, square, triangle, and sawtooth waveforms. Commonly used to animate parameters like color, position, or shader uniforms over time.

**Tips:**
- Use the offset control to shift the output range so it stays positive when feeding into parameters that do not accept negative values.
- Square waveform at low frequency works well as an on/off toggle signal.
- Connect the output to a map-range node to rescale the LFO to any arbitrary range.

**Works well with:** Map Range, Shader, Smooth, Blend, Color Correction

| Property | Value |
|----------|-------|
| **ID** | `lfo` |
| **Icon** | `waves` |
| **Version** | 1.0.0 |

### Inputs
*None*

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `number` | Current oscillator value |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `frequency` | `number` | `1` | Oscillation frequency in Hz |
| `amplitude` | `number` | `1` | Output amplitude multiplier |
| `offset` | `number` | `0` | DC offset added to output |
| `waveform` | `select` | `sine` | Waveform type (sine, square, triangle, sawtooth) |

### Implementation
```javascript
const phase = (time * frequency) % 1
let value
switch (waveform) {
  case 'sine':     value = Math.sin(phase * Math.PI * 2); break
  case 'square':   value = phase < 0.5 ? 1 : -1; break
  case 'triangle': value = 1 - Math.abs(phase - 0.5) * 4; break
  case 'sawtooth': value = phase * 2 - 1; break
}
result = value * amplitude + offset
```

Output range: `[-amplitude + offset, amplitude + offset]`

---

## Start

Fires a trigger once when the flow starts running.

### Info

Fires a single trigger when the flow begins running. This is useful for initialization tasks like loading assets, setting default values, or kicking off a sequence that should begin automatically.

**Tips:**
- Connect to a delay node if you need initialization to happen slightly after startup rather than immediately.
- Use it to trigger an image-loader or video-player so media is ready as soon as the flow starts.
- Only fires once per flow start; stopping and restarting the flow will fire it again.

**Works well with:** Delay, Image Loader, Video Player, Toggle, Counter

| Property | Value |
|----------|-------|
| **ID** | `start` |
| **Icon** | `play` |
| **Version** | 1.0.0 |

### Inputs
*None*

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `trigger` | `trigger` | Fires once on flow start |

### Controls
*None*

### Implementation
On the first execution frame, outputs a trigger signal. Subsequent frames output nothing.

---

## Interval

Fires triggers at regular time intervals.

### Info

Emits a trigger output repeatedly at a fixed time interval. The interval is adjustable in milliseconds and can be toggled on and off. This is the go-to node for polling, periodic updates, or any repeating action.

**Tips:**
- Very short intervals (under 50ms) can cause performance issues if the downstream chain is expensive.
- Use the enabled input to gate the interval from another node rather than removing connections.
- Pair with counter to build a simple clock that tracks how many ticks have elapsed.

**Works well with:** Counter, Delay, Trigger, Toggle, Expression

| Property | Value |
|----------|-------|
| **ID** | `interval` |
| **Icon** | `timer` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `enabled` | `boolean` | Enable/disable the interval |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `trigger` | `trigger` | Fires at each interval |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `interval` | `number` | `1000` | min: 10, max: 60000 | Interval in milliseconds |
| `enabled` | `toggle` | `true` | - | Default enabled state |

### Implementation
Uses `setInterval()` internally or frame-based timing to fire triggers at the specified interval when enabled.

---

## Delay

Delay a value by a specified time.

### Info

Passes any incoming value through to its output after a configurable delay in milliseconds. Useful for staggering events, creating echo-like timing patterns, or offsetting signals in a chain.

**Tips:**
- Chain multiple delay nodes with different times to create a spread of staggered triggers from a single source.
- Set delay to 0 to use it as a simple pass-through for debugging signal flow.
- Feeding a trigger through delay and back into the same chain can create repeating loops, but watch for runaway feedback.

**Works well with:** Trigger, Interval, LFO, Smooth, Counter

| Property | Value |
|----------|-------|
| **ID** | `delay` |
| **Icon** | `clock` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `any` | Value to delay |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `any` | Delayed value |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `delay` | `number` | `500` | min: 0, max: 10000 | Delay in milliseconds |

### Implementation
Maintains a queue of timestamped values. On each frame, outputs values whose delay time has elapsed.

---

## Timer

Stopwatch timer with start, stop, and reset controls.

### Info

A stopwatch-style timer that counts elapsed seconds when running. It can be started, stopped, and reset via trigger inputs. The running output indicates whether the timer is currently active.

**Tips:**
- Use the elapsed output with a clamp node to create a one-shot animation that plays for a fixed duration.
- Send a reset trigger followed by a start trigger to cleanly restart the timer from zero.
- Combine with an expression node to convert elapsed seconds into a countdown by subtracting from a target duration.

**Works well with:** Clamp, Expression, Start, Trigger, Map Range

| Property | Value |
|----------|-------|
| **ID** | `timer` |
| **Icon** | `timer` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `start` | `trigger` | Start the timer |
| `stop` | `trigger` | Stop/pause the timer |
| `reset` | `trigger` | Reset timer to zero |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `elapsed` | `number` | Elapsed time in seconds |
| `running` | `boolean` | Whether timer is currently running |

### Controls
*None*

### Implementation
Maintains internal state for:
- Start timestamp
- Accumulated time (for pause/resume)
- Running state

Responds to input triggers to control state.

---

## Metronome

Musical tempo source with beat and bar triggers.

### Info

A musical clock that emits beat and bar triggers at a given BPM. It outputs the current beat number, bar number, and a phase value from 0 to 1 within each beat. Subdivision and swing controls let you dial in rhythmic feel.

**Tips:**
- Use the phase output with a map-range node to create smooth animations that lock to the beat.
- Swing only affects subdivided beats, so set subdivision to 1/8 or 1/16 to hear its effect.
- Feed the bar trigger into a step-sequencer reset input to keep patterns aligned across changes.

**Works well with:** Step Sequencer, Beat Detect, Envelope, Counter, LFO

| Property | Value |
|----------|-------|
| **ID** | `metronome` |
| **Icon** | `timer` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `start` | `trigger` | Start the metronome |
| `stop` | `trigger` | Stop the metronome |
| `bpm` | `number` | BPM override |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `beat` | `trigger` | Fires on each beat |
| `bar` | `trigger` | Fires on each bar (first beat of measure) |
| `beatNum` | `number` | Current beat number (1-based, resets at bar) |
| `barNum` | `number` | Current bar number (1-based) |
| `phase` | `number` | Beat phase (0-1, for smooth animation) |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `bpm` | `number` | `120` | min: 20, max: 300 | Beats per minute |
| `beatsPerBar` | `number` | `4` | min: 1, max: 16 | Time signature numerator |
| `subdivision` | `select` | `1` | options: 1, 1/2, 1/4, 1/8, 1/16 | Beat subdivision |
| `swing` | `slider` | `0` | min: 0, max: 100 | Swing amount (%) |
| `running` | `toggle` | `true` | - | Default running state |

### Implementation
High-precision timing using Web Audio API's clock or `performance.now()`:
- Calculates beat duration from BPM
- Applies subdivision for faster triggers
- Swing affects alternate beats' timing
- Phase output enables smooth inter-beat animation

---

## Step Sequencer

Step-based pattern sequencer for rhythm and automation.

### Info

A pattern sequencer that advances through a configurable number of steps on each incoming clock trigger. Each step holds a value and a gate state. Supports forward, backward, ping-pong, and random playback modes.

**Tips:**
- Feed the clock input from a metronome beat output to keep the sequence locked to tempo.
- Use the value output to drive shader uniforms or color parameters for rhythmic visual changes.
- Ping-pong mode doubles the effective pattern length without needing twice as many steps.

**Works well with:** Metronome, Shader, Envelope, Counter, LFO

| Property | Value |
|----------|-------|
| **ID** | `step-sequencer` |
| **Icon** | `grid-3x3` |
| **Version** | 1.0.0 |
| **Custom UI** | Yes (`StepSequencerNode.vue`) |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `clock` | `trigger` | Advance to next step |
| `reset` | `trigger` | Reset to first step |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `gate` | `trigger` | Fires when active step is triggered |
| `value` | `number` | Value of current step (0-1) |
| `step` | `number` | Current step number |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `steps` | `number` | `8` | min: 1, max: 64 | Number of steps |
| `mode` | `select` | `Forward` | options: Forward, Backward, Ping-Pong, Random | Playback mode |
| `stepValues` | `data` | `[]` | - | Step values array (edited via UI) |

### Implementation
Custom UI component with:
- Visual grid of steps
- Click to toggle step on/off
- Drag to set step value (0-1)
- Current step highlight

Playback modes:
- **Forward**: 0, 1, 2, 3, ... n, 0, 1, ...
- **Backward**: n, n-1, ... 1, 0, n, ...
- **Ping-Pong**: 0, 1, ... n, n-1, ... 1, 0, ...
- **Random**: Random step each trigger

---

## Usage Examples

### Basic Animation
```
[Time] --time--> [Multiply/a]
[Constant(0.5)] -> [Multiply/b]
[Multiply] --result--> [Trig/sin] --result--> [Transform 2D/translateX]
```

### Rhythmic Triggers
```
[Metronome] --beat--> [Envelope/trigger]
            --bar---> [Counter/increment]
```

### Delayed Reaction
```
[Trigger] --trigger--> [Delay/value]
[Delay] --value--> [HTTP Request/trigger]
```

### Step Sequencer Pattern
```
[Metronome/beat] --> [Step Sequencer/clock]
[Step Sequencer/gate] --> [Envelope/trigger]
[Step Sequencer/value] --> [Map Range] --> [Oscillator/frequency]
```

### LFO Modulation
```
[LFO] --value--> [Map Range] --result--> [Filter/frequency]
(freq: 0.2, waveform: sine)
(inMin: -1, inMax: 1, outMin: 200, outMax: 2000)
```
