# Logic Category

> Boolean and conditional logic operations in LATCH.

**Category Color:** Red (`#EF4444`)
**Icon:** `git-branch`

---

## Compare

Compare two values using comparison operators.

### Info

Compares two numeric values using a selectable operator and outputs a boolean result. Supports equality, inequality, greater-than, and less-than checks. Use this for threshold detection and conditional branching.

**Tips:**
- Feed the boolean result into a gate or switch to route values based on the comparison.
- Use the >= or <= operators for inclusive threshold checks.

**Works well with:** Gate, Switch, In Range, Clamp, Equals

| Property | Value |
|----------|-------|
| **ID** | `compare` |
| **Icon** | `git-compare` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `number` | First value |
| `b` | `number` | Second value |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `boolean` | Comparison result |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `operator` | `select` | `==` | options: ==, !=, >, >=, <, <= | Comparison operator |

### Implementation
- `==`: `a === b` (strict equality)
- `!=`: `a !== b`
- `>`: `a > b`
- `>=`: `a >= b`
- `<`: `a < b`
- `<=`: `a <= b`

---

## And

Logical AND of two boolean values.

### Info

Outputs true only when both inputs are true. This is the standard boolean AND operation used to require multiple conditions to be satisfied simultaneously.

**Tips:**
- Chain multiple And nodes together to require more than two conditions.
- Combine with Not to build NAND logic.

**Works well with:** Or, Not, Gate, Compare

| Property | Value |
|----------|-------|
| **ID** | `and` |
| **Icon** | `circle-dot` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `boolean` | First operand |
| `b` | `boolean` | Second operand |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `boolean` | True if both inputs are true |

### Controls
*None*

### Implementation
`result = a && b`

---

## Or

Logical OR of two boolean values.

### Info

Outputs true when at least one of the two inputs is true. This is the standard boolean OR operation. Use it to allow multiple conditions to independently trigger the same behavior.

**Tips:**
- Chain multiple Or nodes to combine more than two conditions.
- Combine with Not to create NOR logic.

**Works well with:** And, Not, Gate, Compare

| Property | Value |
|----------|-------|
| **ID** | `or` |
| **Icon** | `circle` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `boolean` | First operand |
| `b` | `boolean` | Second operand |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `boolean` | True if either input is true |

### Controls
*None*

### Implementation
`result = a || b`

---

## Not

Logical NOT (inversion) of a boolean value.

### Info

Inverts a boolean value, turning true into false and false into true. This is the standard logical NOT operation. Use it to negate conditions or reverse the behavior of boolean signals.

**Tips:**
- Place after compare or equals to invert a condition without changing the operator.
- Combine with And to build NAND logic gates.

**Works well with:** And, Or, Compare, Equals, Gate

| Property | Value |
|----------|-------|
| **ID** | `not` |
| **Icon** | `circle-off` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `boolean` | Value to invert |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `boolean` | Inverted value |

### Controls
*None*

### Implementation
`result = !value`

---

## Gate

Pass or block values based on a condition.

### Info

Passes a value through when the gate is open and blocks it when the gate is closed. The gate state is controlled by the boolean Gate input or the Open toggle. This is the simplest way to conditionally allow or stop data flow.

**Tips:**
- Connect a compare or equals node to the Gate input for dynamic control.
- Use the toggle control to manually override the gate during testing.

**Works well with:** Compare, And, Or, Pass If, Latch

| Property | Value |
|----------|-------|
| **ID** | `gate` |
| **Icon** | `door-open` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `any` | Value to pass through |
| `gate` | `boolean` | Gate control signal |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `any` | Value if gate is open, otherwise undefined |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `open` | `toggle` | `true` | Default gate state |

### Implementation
```javascript
const isOpen = gateInput ?? openControl
result = isOpen ? value : undefined
```

When gate is closed, the output is `undefined` (no value flows).

---

## Switch

Select between two values based on a condition.

### Info

Outputs one of two values depending on a boolean condition. When the condition is true, the True input is forwarded. When false, the False input is forwarded. This is the basic if/else building block for data flow.

**Tips:**
- Feed the output of compare or equals into the condition input for threshold-based switching.
- Use select instead when you need to choose from more than two options.

**Works well with:** Compare, Equals, Select, Gate, Not

| Property | Value |
|----------|-------|
| **ID** | `switch` |
| **Icon** | `git-branch` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `condition` | `boolean` | Selection condition |
| `true` | `any` | Value when condition is true |
| `false` | `any` | Value when condition is false |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `any` | Selected value |

### Controls
*None*

### Implementation
`result = condition ? trueInput : falseInput`

A ternary operator in node form.

---

## Select

Select one of multiple inputs by index.

### Info

Picks one of up to four inputs based on a numeric index. Index 0 selects input A, index 1 selects B, and so on. This is useful for cycling through values or building lookup-style selection from a numeric source.

**Tips:**
- Use modulo before the index input to cycle through inputs in a loop.
- Combine with quantize to snap a continuous signal to discrete selection steps.

**Works well with:** Switch, Modulo, Quantize, Compare

| Property | Value |
|----------|-------|
| **ID** | `select` |
| **Icon** | `list` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `index` | `number` | Index to select (0-3) |
| `a` | `any` | Option 0 |
| `b` | `any` | Option 1 |
| `c` | `any` | Option 2 |
| `d` | `any` | Option 3 |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `any` | Selected input value |

### Controls
*None*

### Implementation
```javascript
const inputs = [a, b, c, d]
const idx = Math.floor(Math.max(0, Math.min(3, index)))
result = inputs[idx]
```

Index is clamped to 0-3 and floored to integer.

---

## Usage Examples

### Conditional Routing
```
[Compare] --result--> [Switch/condition]
[Source A] ---------> [Switch/true]
[Source B] ---------> [Switch/false]
[Switch] --result--> [Destination]
```

### Threshold Detection
```
[Audio Analyzer/level] --> [Compare/a]
[Constant(0.5)] --------> [Compare/b]
                          (operator: >)
[Compare] --result--> [Gate/gate]
[Trigger Source] ---> [Gate/value]
[Gate] --result--> [Action]
```

### Multiple Condition Logic
```
[Condition A] --> [And/a]
[Condition B] --> [And/b]
[And] --result--> [Or/a]
[Condition C] --> [Or/b]
[Or] --result--> [Final Gate]
```

### State Machine with Select
```
[Counter/count] --> [Select/index]
[State 0 Value] --> [Select/a]
[State 1 Value] --> [Select/b]
[State 2 Value] --> [Select/c]
[State 3 Value] --> [Select/d]
[Select] --result--> [Output]
```

### Toggle Gate
```
[Toggle/value] --> [Gate/gate]
[Data Source] ---> [Gate/value]
[Gate] --result--> [Destination]
```
