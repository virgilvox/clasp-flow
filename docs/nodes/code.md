# Code Category

> Custom logic, scripting, and state management nodes in LATCH.

**Category Color:** Amber (`#F59E0B`)
**Icon:** `terminal`

---

## Function

Custom JavaScript function with sandboxed execution.

### Info

Runs custom JavaScript code in a sandboxed environment with up to four generic inputs. You can maintain state across frames and return values to downstream nodes. The error output fires when your code throws, making it possible to handle failures gracefully.

**Tips:**
- Use getState/setState to persist values between frames instead of relying on closures.
- Return an object with named keys to populate multiple outputs from a single function.
- Connect the error output to a console node during development to surface runtime issues quickly.

**Works well with:** Console, Expression, Trigger, Monitor

| Property | Value |
|----------|-------|
| **ID** | `function` |
| **Icon** | `code-2` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `any` | Input A |
| `b` | `any` | Input B |
| `c` | `any` | Input C |
| `d` | `any` | Input D |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `any` | Function result |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `code` | `code` | (see below) | JavaScript code |

**Default Code:**
```javascript
// Access inputs via: inputs.a, inputs.b, etc.
// Access time via: time, deltaTime, frame
// Use state: getState('key', default), setState('key', value)
// Return a value or object with multiple outputs

return inputs.a + inputs.b;
```

### Implementation
Executes JavaScript in a sandboxed environment. Provides access to inputs, timing variables, and persistent state APIs. Returns value becomes the `result` output.

---

## Expression

Inline math expression evaluator.

### Info

Evaluates a single-line math expression using up to four numeric inputs. Standard JavaScript Math functions like sin, cos, abs, and floor are available without the Math prefix. The built-in variable t provides elapsed time in seconds.

**Tips:**
- Use t for time-based expressions without needing an external oscillator.
- Chain multiple expression nodes for staged calculations rather than writing one complicated expression.
- The error output tells you about syntax problems at runtime, so connect it to a console during setup.

**Works well with:** Constant, Slider, Oscillator, Map Range

| Property | Value |
|----------|-------|
| **ID** | `expression` |
| **Icon** | `calculator` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `number` | Input A |
| `b` | `number` | Input B |
| `c` | `number` | Input C |
| `d` | `number` | Input D |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Expression result |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `expression` | `text` | `a + b` | placeholder: "e.g., sin(t) * a + b" | Math expression |

### Implementation
Parses and evaluates mathematical expressions with variables. Supports standard math functions (`sin`, `cos`, `tan`, `sqrt`, `pow`, etc.) and time variable `t`.

---

## Template

String template with variable interpolation.

### Info

Builds a string by replacing placeholders with live input values. Placeholders use double-brace syntax like {{a}} through {{d}}. Any input type is automatically converted to its string representation before insertion.

**Tips:**
- Use template output to drive a textbox or console node for formatted debug displays.
- Combine with json-parse to build structured string payloads from multiple data sources.
- Placeholders for disconnected inputs resolve to an empty string, so unused slots are safe to leave in the template.

**Works well with:** Textbox, Console, Concat, JSON Parse

| Property | Value |
|----------|-------|
| **ID** | `template` |
| **Icon** | `text-cursor-input` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `any` | Variable A |
| `b` | `any` | Variable B |
| `c` | `any` | Variable C |
| `d` | `any` | Variable D |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `output` | `string` | Interpolated string |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `template` | `text` | `Value: {{a}}` | placeholder: "Use {{varname}} for interpolation" | Template string |

### Implementation
Replaces `{{varname}}` placeholders with corresponding input values. Useful for formatting output strings or constructing messages.

---

## Counter

Increment/decrement counter with min/max bounds.

### Info

Maintains an integer count that responds to increment, decrement, and reset triggers. The normalized output gives a 0-1 value based on the min/max range. Wrap mode makes the counter loop back to the opposite bound when it exceeds a limit.

**Tips:**
- Connect a trigger node to increment for a manual step sequencer.
- Enable wrap mode and use normalized output to drive cyclic animations.
- Wire atMin and atMax to toggle or gate nodes to build conditional logic around boundaries.

**Works well with:** Trigger, Gate, Switch, Interval

| Property | Value |
|----------|-------|
| **ID** | `counter` |
| **Icon** | `list-ordered` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `increment` | `trigger` | Increment counter |
| `decrement` | `trigger` | Decrement counter |
| `reset` | `trigger` | Reset to min value |
| `set` | `number` | Set to specific value |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `count` | `number` | Current count |
| `normalized` | `number` | Count normalized to 0-1 |
| `atMin` | `boolean` | At minimum value |
| `atMax` | `boolean` | At maximum value |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Increment/decrement amount |
| `wrap` | `toggle` | `false` | Wrap around at bounds |

### Implementation
Maintains an integer or floating point count with configurable bounds. Optional wrap-around behavior allows cycling through values.

---

## Toggle

Flip-flop toggle with set/reset.

### Info

A flip-flop that alternates between true and false each time its trigger fires. Separate set and reset inputs allow forcing the state directly. The number output emits 1 or 0, which is convenient for math operations downstream.

**Tips:**
- Use the inverted output to drive two mutually exclusive signal paths without an extra node.
- Wire a beat-detect trigger into the toggle input for rhythm-synced on/off effects.
- Combine with a gate node to let signals through only while the toggle is active.

**Works well with:** Trigger, Gate, Beat Detect, Switch

| Property | Value |
|----------|-------|
| **ID** | `toggle` |
| **Icon** | `toggle-left` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `trigger` | `trigger` | Toggle state |
| `set` | `trigger` | Force true |
| `reset` | `trigger` | Force false |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `boolean` | Current state |
| `inverted` | `boolean` | Inverted state |
| `number` | `number` | State as 0 or 1 |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `initial` | `toggle` | `false` | Initial value |

### Implementation
Classic flip-flop logic. Toggle input flips state, set/reset force specific states. Useful for on/off control flow.

---

## Sample & Hold

Capture and hold value on trigger.

### Info

Captures the current value of its input only when the trigger fires, then holds that value until the next trigger. This is useful for freezing a continuously changing signal at a specific moment. The output stays constant between triggers regardless of input changes.

**Tips:**
- Pair with an interval node to sample a signal at a fixed rate.
- Use with a random or oscillator source to generate stepped random sequences.
- Chain multiple sample-hold nodes with offset triggers for a shift-register effect.

**Works well with:** Trigger, Interval, Oscillator, LFO

| Property | Value |
|----------|-------|
| **ID** | `sample-hold` |
| **Icon** | `clipboard` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `input` | `any` | Value to sample |
| `trigger` | `trigger` | Sample now |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `output` | `any` | Held value |

### Controls
*None*

### Implementation
Captures the current input value when triggered and holds it until the next trigger. Useful for freezing values at specific moments.

---

## Value Delay

Delay value by N frames.

### Info

Delays the pass-through of any value by a configurable number of frames. The node buffers incoming values and releases them after the specified frame count. This is useful for creating time-offset effects or comparing a signal with its past self.

**Tips:**
- Set frames to 1 to get the previous frame value, which is useful for computing velocity or change detection.
- Chain several value-delay nodes at different frame counts to build a visual trail or echo effect.
- Higher frame counts consume more memory, so keep the delay under 60 frames for complex flows.

**Works well with:** Subtract, Smooth, Compare, Expression

| Property | Value |
|----------|-------|
| **ID** | `value-delay` |
| **Icon** | `timer` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `input` | `any` | Value to delay |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `output` | `any` | Delayed value |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `frames` | `number` | `1` | min: 1, max: 300 | Delay in frames |

### Implementation
Maintains a circular buffer of past values. Output is the value from N frames ago. Useful for creating motion trails or comparing current vs past values.
