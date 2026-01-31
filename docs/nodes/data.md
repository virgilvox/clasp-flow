# Data Category

> JSON parsing, serialization, and data conversion nodes in LATCH.

**Category Color:** Gray (`#6B7280`)
**Icon:** `database`

---

## JSON Parse

Parse JSON string to object.

### Info

Parses a JSON string into a structured object. Optionally extracts a nested value using a dot-notation path. If parsing fails, the error output provides the reason.

**Tips:**
- Use the path field to drill into deeply nested responses without needing separate Object Get nodes.
- Connect the error output to a Monitor node to debug malformed JSON from external sources.

**Works well with:** JSON Stringify, Object Get, HTTP Request, Monitor

| Property | Value |
|----------|-------|
| **ID** | `json-parse` |
| **Icon** | `braces` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `input` | `string` | JSON string |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `output` | `data` | Parsed object |
| `error` | `string` | Parse error message |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `path` | `text` | `''` | placeholder: "e.g., data.items[0]" | Optional path to extract |

### Implementation
Uses `JSON.parse()` with optional path extraction using dot notation. Supports array indexing (e.g., `items[0].name`). Invalid JSON produces error output instead of throwing.

---

## JSON Stringify

Convert object to JSON string.

### Info

Converts a JavaScript object into a JSON string. Supports pretty-printed output with indentation for readability. Useful for preparing data to send over HTTP, WebSocket, or MQTT connections.

**Tips:**
- Enable pretty print when sending output to a Monitor or Console for easier debugging.
- Pair with HTTP Request to serialize request bodies as JSON.

**Works well with:** JSON Parse, HTTP Request, WebSocket, MQTT

| Property | Value |
|----------|-------|
| **ID** | `json-stringify` |
| **Icon** | `braces` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `input` | `data` | Object to stringify |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `output` | `string` | JSON string |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `pretty` | `toggle` | `false` | Pretty print with indentation |

### Implementation
Uses `JSON.stringify()`. Pretty print adds 2-space indentation and newlines for readability. Handles circular references gracefully.

---

## Texture to Data

Convert texture to image data for AI processing.

### Info

Converts a GPU texture into CPU-accessible image data in one of several formats: raw ImageData, base64, or blob. Supports both single-shot capture via trigger and continuous frame extraction. Also outputs the image dimensions.

**Tips:**
- Enable continuous mode for real-time frame analysis, but be mindful of performance costs.
- Use base64 format when the image data needs to be sent as a string over HTTP or WebSocket.

**Works well with:** HTTP Request, JSON Stringify, WebSocket, Expression

| Property | Value |
|----------|-------|
| **ID** | `texture-to-data` |
| **Icon** | `image-down` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `texture` | `texture` | Source texture (required) |
| `trigger` | `trigger` | Capture now |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `data` | `data` | Image data in selected format |
| `width` | `number` | Image width |
| `height` | `number` | Image height |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `format` | `select` | `imageData` | options: imageData, base64, blob | Output format |
| `continuous` | `toggle` | `false` | - | Capture every frame |

### Implementation
Reads texture pixels from WebGL framebuffer. Output formats:
- **imageData**: Raw ImageData object (for Canvas/AI processing)
- **base64**: Base64-encoded PNG string
- **blob**: Blob object (for file operations)

Useful as bridge between visual pipeline and AI nodes.
