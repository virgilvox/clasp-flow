# Math Category

> Mathematical operations on numeric values in LATCH.

**Category Color:** Amber (`#F59E0B`)
**Icon:** `calculator`

---

## Add

Add two numbers together.

### Info

Adds two numbers together and outputs the sum. This is one of the core arithmetic operations. Use it to combine values, apply offsets, or accumulate totals.

**Tips:**
- Chain with a constant node to add a fixed offset to a signal.
- Pair with multiply to build linear transformations (multiply then add).

**Works well with:** Subtract, Multiply, Constant, Smooth

| Property | Value |
|----------|-------|
| **ID** | `add` |
| **Icon** | `plus` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `number` | First operand |
| `b` | `number` | Second operand |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Sum of a + b |

### Controls
*None*

### Implementation
`result = a + b`

---

## Subtract

Subtract one number from another.

### Info

Subtracts the second input from the first and outputs the difference. This is one of the core arithmetic operations. Use it to compute offsets, deltas, or distances between values.

**Tips:**
- Follow with abs to get the unsigned distance between two values.
- Use to compute frame-to-frame deltas by subtracting the previous value from the current.

**Works well with:** Add, Absolute, Multiply, Smooth

| Property | Value |
|----------|-------|
| **ID** | `subtract` |
| **Icon** | `minus` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `number` | Minuend |
| `b` | `number` | Subtrahend |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Difference of a - b |

### Controls
*None*

### Implementation
`result = a - b`

---

## Multiply

Multiply two numbers.

### Info

Multiplies two numbers together and outputs the product. This is one of the core arithmetic operations. Use it for scaling values, applying gain, or computing areas and rates.

**Tips:**
- Multiply by -1 to negate a signal without using a subtract node.
- Chain with add to build linear equations of the form (a * x + b).

**Works well with:** Add, Divide, Constant, Clamp

| Property | Value |
|----------|-------|
| **ID** | `multiply` |
| **Icon** | `x` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `number` | First factor |
| `b` | `number` | Second factor |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Product of a * b |

### Controls
*None*

### Implementation
`result = a * b`

---

## Divide

Divide one number by another.

### Info

Divides the first input by the second and outputs the quotient. This is standard numeric division. Be aware that dividing by zero will produce Infinity or NaN.

**Tips:**
- Use a compare node to guard against division by zero before this node.
- Combine with modulo to get both the quotient and remainder of a division.

**Works well with:** Multiply, Modulo, Compare, Clamp

| Property | Value |
|----------|-------|
| **ID** | `divide` |
| **Icon** | `divide` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `number` | Dividend |
| `b` | `number` | Divisor |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Quotient of a / b |

### Controls
*None*

### Implementation
`result = a / b` (returns `Infinity` or `NaN` for division by zero)

---

## Modulo

Get the remainder of division.

### Info

Computes the remainder after dividing a value by a divisor. Supports standard, positive-only, and floor modes for different remainder conventions. Useful for creating repeating patterns and cyclic behavior from increasing values.

**Tips:**
- Use Positive mode to ensure the result is always non-negative.
- Combine with time to create looping counters or repeating animations.

**Works well with:** Divide, Wrap, Time, Quantize

| Property | Value |
|----------|-------|
| **ID** | `modulo` |
| **Icon** | `percent` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `number` | Value to divide |
| `divisor` | `number` | Divisor |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Remainder |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `divisor` | `number` | `1` | - | Default divisor if not connected |
| `mode` | `select` | `Standard` | options: Standard, Positive, Floor | Modulo mode |

### Implementation
- **Standard**: `value % divisor` (JavaScript default, sign follows dividend)
- **Positive**: `((value % divisor) + divisor) % divisor` (always positive result)
- **Floor**: `value - divisor * Math.floor(value / divisor)` (sign follows divisor)

---

## Clamp

Constrain a value between minimum and maximum bounds.

### Info

Constrains a value to stay within a minimum and maximum range. Values below the minimum are raised to the minimum, and values above the maximum are lowered to the maximum. Values already within range pass through unchanged.

**Tips:**
- Place after map-range to ensure the output never exceeds the target bounds.
- Use with lerp to keep interpolation parameters in the 0 to 1 range.

**Works well with:** Map Range, Lerp, Smooth, In Range, Wrap

| Property | Value |
|----------|-------|
| **ID** | `clamp` |
| **Icon** | `shrink` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `number` | Value to clamp |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Clamped value |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `min` | `number` | `0` | Minimum bound |
| `max` | `number` | `1` | Maximum bound |

### Implementation
`result = Math.max(min, Math.min(max, value))`

---

## Absolute

Get the absolute (positive) value.

### Info

Returns the absolute value of the input, converting negative numbers to positive. Zero and positive values pass through unchanged. Commonly used to get magnitude without regard to sign.

**Tips:**
- Use after subtract to get the distance between two values.
- Combine with compare to check if a value exceeds a threshold in either direction.

**Works well with:** Subtract, Compare, Clamp, Smooth

| Property | Value |
|----------|-------|
| **ID** | `abs` |
| **Icon** | `flip-horizontal` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `number` | Input value |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Absolute value |

### Controls
*None*

### Implementation
`result = Math.abs(value)`

---

## Random

Generate random numbers.

### Info

Generates a random number within a configurable minimum and maximum range. An optional seed input allows for reproducible random sequences. Each evaluation produces a new random value unless the seed is held constant.

**Tips:**
- Set a fixed seed to get the same random sequence every time for testing.
- Use clamp after this node if downstream logic requires strict bounds.

**Works well with:** Clamp, Quantize, Map Range, Trigger

| Property | Value |
|----------|-------|
| **ID** | `random` |
| **Icon** | `shuffle` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `seed` | `number` | Seed value (triggers new random on change) |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Random number in range |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `1` | Maximum value |

### Implementation
`result = min + Math.random() * (max - min)`

When seed input changes, a new random value is generated.

---

## Map Range

Remap a value from one range to another.

### Info

Rescales a value from one numeric range to another. For example, an input in the 0-1 range can be mapped to 0-100. The mapping is linear and does not clamp, so values outside the input range will extrapolate.

**Tips:**
- Follow with a clamp node if you need to prevent extrapolation beyond the output range.
- Use remap instead if you need built-in clamping and easing options.

**Works well with:** Clamp, Remap, Lerp, Smooth, In Range

| Property | Value |
|----------|-------|
| **ID** | `map-range` |
| **Icon** | `arrow-right-left` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `number` | Input value (required) |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Remapped value |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `inMin` | `number` | `0` | Input range minimum |
| `inMax` | `number` | `1` | Input range maximum |
| `outMin` | `number` | `0` | Output range minimum |
| `outMax` | `number` | `100` | Output range maximum |

### Implementation
```javascript
const normalized = (value - inMin) / (inMax - inMin)
result = outMin + normalized * (outMax - outMin)
```

---

## Smooth

Smooth value changes over time using linear interpolation.

### Info

Applies exponential smoothing to a value, gradually moving the output toward the input over time. Lower factor values produce slower, smoother transitions while higher values track the input more closely. Useful for dampening noisy or jittery signals.

**Tips:**
- Start with a factor around 0.1 and adjust based on how responsive you need the output to be.
- Place after any sensor or rapidly changing input to remove noise.

**Works well with:** Lerp, Clamp, Map Range, LFO, Remap

| Property | Value |
|----------|-------|
| **ID** | `smooth` |
| **Icon** | `trending-up` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `number` | Target value |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Smoothed value |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `factor` | `slider` | `0.1` | min: 0.01, max: 1, step: 0.01 | Smoothing factor (0=slow, 1=instant) |

### Implementation
Exponential smoothing (one-pole lowpass):
```javascript
current = current + factor * (target - current)
```

Lower factor = smoother (slower response)

---

## Trig

Trigonometric functions.

### Info

Applies trigonometric functions including sin, cos, tan, and their inverses and hyperbolic variants. The input is treated as radians by default, but a toggle lets you work in degrees instead. Useful for circular motion, oscillation, and angle calculations.

**Tips:**
- Enable Use Degrees if your angle source provides values in degrees rather than radians.
- Feed a time-based ramp into sin or cos to generate smooth oscillations.

**Works well with:** Multiply, Add, Time, LFO, Power/Root

| Property | Value |
|----------|-------|
| **ID** | `trig` |
| **Icon** | `waves` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `number` | Input angle/value |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Function result |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `function` | `select` | `sin` | options: sin, cos, tan, asin, acos, atan, sinh, cosh, tanh | Trig function |
| `degrees` | `toggle` | `false` | - | Input in degrees (vs radians) |

### Implementation
Applies `Math[function]()` to input. If `degrees` is true, converts input to radians first (for sin/cos/tan) or result to degrees (for asin/acos/atan).

---

## Power/Root

Power, root, and logarithm functions.

### Info

Applies power, root, and logarithmic functions to numeric values. Includes power, square root, cube root, natural log, log base 10, and exponential operations. Select the desired operation from the dropdown.

**Tips:**
- Use Sqrt for distance calculations after summing squared components.
- Apply Log or Ln to compress large value ranges into smaller ones.

**Works well with:** Multiply, Absolute, Map Range, Trig

| Property | Value |
|----------|-------|
| **ID** | `power` |
| **Icon** | `superscript` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `base` | `number` | Base value |
| `exponent` | `number` | Exponent (for power operation) |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `number` | Result of operation |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `operation` | `select` | `Power` | options: Power, Sqrt, Cbrt, Log, Log10, Ln, Exp | Operation type |
| `exponent` | `number` | `2` | - | Default exponent for power |

### Implementation
- **Power**: `Math.pow(base, exponent)`
- **Sqrt**: `Math.sqrt(base)`
- **Cbrt**: `Math.cbrt(base)` (cube root)
- **Log**: `Math.log(base) / Math.log(exponent)` (log with base)
- **Log10**: `Math.log10(base)`
- **Ln**: `Math.log(base)` (natural log)
- **Exp**: `Math.exp(base)` (e^base)

---

## Vector Math

3D vector operations.

### Info

Performs 3D vector operations on two input vectors, including addition, subtraction, cross product, normalization, scaling, interpolation, and dot product. Also outputs the magnitude of the result. Select the operation from the dropdown.

**Tips:**
- Use Normalize to get a unit-length direction vector from any input.
- Use Dot to measure the alignment between two direction vectors.

**Works well with:** Add, Multiply, Lerp, Trig, Smooth

| Property | Value |
|----------|-------|
| **ID** | `vector-math` |
| **Icon** | `move-3d` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `ax` | `number` | Vector A, X component |
| `ay` | `number` | Vector A, Y component |
| `az` | `number` | Vector A, Z component |
| `bx` | `number` | Vector B, X component |
| `by` | `number` | Vector B, Y component |
| `bz` | `number` | Vector B, Z component |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `x` | `number` | Result X component |
| `y` | `number` | Result Y component |
| `z` | `number` | Result Z component |
| `magnitude` | `number` | Result magnitude |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `operation` | `select` | `Add` | options: Add, Subtract, Cross, Normalize, Scale, Lerp, Dot | Vector operation |
| `scalar` | `number` | `1` | - | Scalar for Scale/Lerp operations |

### Implementation
- **Add**: `A + B`
- **Subtract**: `A - B`
- **Cross**: `A × B` (cross product)
- **Normalize**: `A / |A|`
- **Scale**: `A * scalar`
- **Lerp**: `A + scalar * (B - A)`
- **Dot**: Returns dot product as magnitude, x/y/z are 0

---

## Usage Examples

### Frequency Modulation
```
[LFO] --value--> [Multiply/a]
[Constant(100)] --> [Multiply/b]
[Multiply] --result--> [Add/a]
[Constant(440)] --> [Add/b]
[Add] --result--> [Oscillator/frequency]
```

### Normalizing Values
```
[Sensor] --raw--> [Map Range] --result--> [Visual Node]
                  (inMin: 0, inMax: 1023, outMin: 0, outMax: 1)
```

### Smooth Control Changes
```
[Slider] --value--> [Smooth] --result--> [Gain/gain]
                    (factor: 0.1)
```
