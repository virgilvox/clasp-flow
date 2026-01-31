# String Category

> Text manipulation and formatting nodes in LATCH.

**Category Color:** Emerald (`#10B981`)
**Icon:** `type`

---

## String Concat

Concatenate multiple strings.

### Info

Joins up to four strings together with an optional separator between them. Empty inputs are skipped. This is the simplest way to combine multiple text values into one output string.

**Tips:**
- Set the separator to a newline character to join lines of text.
- Leave unused inputs disconnected and they will be ignored.

**Works well with:** String Template, String Split, String Trim, String Case

| Property | Value |
|----------|-------|
| **ID** | `string-concat` |
| **Icon** | `plus` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `a` | `string` | First string |
| `b` | `string` | Second string |
| `c` | `string` | Third string |
| `d` | `string` | Fourth string |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `string` | Combined string |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `separator` | `text` | `''` | Separator between strings |

### Implementation
Joins all non-empty input strings with the specified separator. Empty inputs are skipped.

---

## String Split

Split string into parts.

### Info

Splits a string into an array of parts using a separator. Outputs the array, the first element, and the total count of parts. An optional limit controls the maximum number of splits.

**Tips:**
- Split by newline to break multi-line text into individual lines.
- Use the count output to determine how many tokens were found before processing the array.

**Works well with:** String Concat, String Replace, String Contains, JSON Parse

| Property | Value |
|----------|-------|
| **ID** | `string-split` |
| **Icon** | `scissors` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `input` | `string` | String to split |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `parts` | `array` | Array of string parts |
| `first` | `string` | First part |
| `count` | `number` | Number of parts |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `separator` | `text` | `,` | - | Split delimiter |
| `limit` | `number` | `0` | min: 0 | Max parts (0 = unlimited) |

### Implementation
Uses `String.split()` with optional limit. Useful for parsing CSV data or extracting parts from structured strings.

---

## String Replace

Replace text in a string.

### Info

Replaces occurrences of a search string or regex pattern within the input. Can replace the first match or all matches. The search and replace values can come from either the controls or the connected inputs.

**Tips:**
- Enable the Use Regex toggle to use patterns like \d+ for matching numbers.
- Connect dynamic search and replace values from other nodes to do data-driven substitution.

**Works well with:** Regex Match, String Contains, String Template, String Concat

| Property | Value |
|----------|-------|
| **ID** | `string-replace` |
| **Icon** | `replace` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `input` | `string` | Source string |
| `search` | `string` | Text to find |
| `replace` | `string` | Replacement text |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `string` | Modified string |
| `_error` | `string` | Regex error (if any) |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `search` | `text` | `''` | Search pattern |
| `replace` | `text` | `''` | Replacement text |
| `useRegex` | `toggle` | `false` | Treat search as regex |
| `replaceAll` | `toggle` | `true` | Replace all occurrences |

### Implementation
Uses `String.replace()` or `String.replaceAll()`. When regex mode enabled, creates RegExp from search pattern with appropriate flags.

---

## String Slice

Extract a portion of a string.

### Info

Extracts a substring from the input using start and end indices. Negative indices count from the end of the string. Also outputs the length of the extracted portion.

**Tips:**
- Set end to -1 to slice from the start index through the rest of the string.
- Combine with String Length to dynamically calculate slice boundaries.

**Works well with:** String Length, String Contains, String Split, Expression

| Property | Value |
|----------|-------|
| **ID** | `string-slice` |
| **Icon** | `slice` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `input` | `string` | Source string |
| `start` | `number` | Start index |
| `end` | `number` | End index |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `string` | Extracted substring |
| `length` | `number` | Result length |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `start` | `number` | `0` | Start index (0-based) |
| `end` | `number` | `-1` | End index (-1 = end of string) |

### Implementation
Uses `String.slice()`. Negative indices count from end of string. End index is exclusive.

---

## String Case

Convert string case.

### Info

Converts a string between different casing conventions. Supports uppercase, lowercase, title case, camelCase, snake_case, and kebab-case. Useful for formatting identifiers, labels, or display text.

**Tips:**
- Use snake_case or kebab-case modes to normalize user input into valid identifiers.
- Chain with String Template to format case-converted values into larger strings.

**Works well with:** String Template, String Concat, String Replace, String Trim

| Property | Value |
|----------|-------|
| **ID** | `string-case` |
| **Icon** | `case-upper` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `input` | `string` | Source string |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `result` | `string` | Converted string |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `mode` | `select` | `UPPER` | options: UPPER, lower, Title, camelCase, snake_case, kebab-case | Case conversion mode |

### Implementation
Converts string case:
- **UPPER**: All uppercase
- **lower**: All lowercase
- **Title**: First Letter Of Each Word Capitalized
- **camelCase**: firstWordLowerRestCapitalized
- **snake_case**: words_separated_by_underscores
- **kebab-case**: words-separated-by-hyphens
