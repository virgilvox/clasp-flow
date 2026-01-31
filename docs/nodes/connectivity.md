# Connectivity Category

> Network and device communication protocols in LATCH.

**Category Color:** Teal (`#2AAB8A`)
**Icon:** `plug`

---

## Platform Requirements & Limitations

Some connectivity nodes have browser-specific requirements:

| Feature | Browser Support | Workaround |
|---------|-----------------|------------|
| **OSC (UDP)** | WebSocket only (browsers cannot use UDP) | Use an OSC/WebSocket bridge like CLASP Bridge |
| **Serial Port** | Chrome, Edge, Opera (Web Serial API) | Use Electron build for full support |
| **Bluetooth LE** | Chrome, Edge, Opera (Web Bluetooth API) | Use Electron build for full support |
| **MIDI** | Chrome, Edge, Opera, Safari (partial) | Firefox not supported; use Chrome or Electron |
| **HTTP Requests** | All browsers | CORS may block cross-origin requests |

**Electron Build:** Running LATCH as a desktop app via Electron removes most browser restrictions and enables full Serial, BLE, and native UDP support.

---

## HTTP Request

Make HTTP/REST API requests.

### Info

Makes HTTP and REST API requests with support for all standard methods and optional request templates. You can use a shared connection for base URL and authentication, or specify a full URL directly. Responses are output as parsed data along with the status code.

**Tips:**
- Use a connection with templates for APIs you call repeatedly to avoid duplicating URL and header configuration.
- Connect a trigger node to control when the request fires rather than letting it run on every input change.
- Check the Loading output to show a spinner or disable controls while a request is in flight.

**Works well with:** json-parse, json-stringify, trigger, function, console

| Property | Value |
|----------|-------|
| **ID** | `http-request` |
| **Icon** | `globe` |
| **Version** | 2.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `url` | `string` | Request URL |
| `headers` | `data` | Request headers object |
| `body` | `data` | Request body |
| `trigger` | `trigger` | Execute request |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `response` | `data` | Response data (parsed JSON or text) |
| `status` | `number` | HTTP status code |
| `error` | `string` | Error message |
| `loading` | `boolean` | Request in progress |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `url` | `text` | `https://api.example.com/data` | - | Request URL |
| `method` | `select` | `GET` | options: GET, POST, PUT, DELETE, PATCH | HTTP method |
| `timeout` | `number` | `30000` | min: 1000, max: 120000 | Request timeout in milliseconds |

### Implementation
Uses `fetch()` API with AbortController for timeout support. Automatically parses JSON responses. Headers and body can be provided as objects.

---

## WebSocket

Real-time bidirectional WebSocket connection.

### Info

Opens a persistent WebSocket connection for real-time bidirectional messaging. Uses a shared connection from the ConnectionManager so multiple nodes can share the same socket. Incoming messages appear on the Message output and you can send data through the Send input.

**Tips:**
- Use a shared connection ID to let multiple WebSocket nodes share a single socket.
- Connect a trigger to the Send Trigger input to control when outgoing messages are dispatched.
- Pair with json-parse to decode structured messages arriving as JSON strings.

**Works well with:** json-parse, json-stringify, mqtt, trigger, console

| Property | Value |
|----------|-------|
| **ID** | `websocket` |
| **Icon** | `radio` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `url` | `string` | WebSocket URL |
| `send` | `data` | Data to send |
| `connect` | `boolean` | Connect/disconnect |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `message` | `data` | Received message |
| `connected` | `boolean` | Connection state |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `url` | `text` | `wss://echo.websocket.org` | WebSocket URL |
| `autoConnect` | `toggle` | `false` | Connect on flow start |

### Implementation
Manages WebSocket lifecycle. Messages are parsed as JSON if possible, otherwise returned as strings.

---

## MIDI Input

Receive MIDI messages from devices.

### Info

Receives MIDI messages from connected hardware or virtual MIDI devices. Outputs include note number, velocity, note on/off state, and control change values. Set the channel to -1 to listen on all channels at once.

**Tips:**
- Set the channel to -1 to receive messages from all MIDI channels simultaneously.
- Use the CC Value output to map hardware knobs and faders to parameters in your flow.
- Pair with a MIDI Output node to build MIDI processing chains.

**Works well with:** midi-output, gain, oscillator, expression, monitor

| Property | Value |
|----------|-------|
| **ID** | `midi-input` |
| **Icon** | `music` |
| **Version** | 1.0.0 |

### Inputs
*None*

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `note` | `number` | MIDI note number (0-127) |
| `velocity` | `number` | Note velocity (0-127) |
| `noteOn` | `boolean` | Note on state |
| `cc` | `number` | Last CC number |
| `ccValue` | `number` | Last CC value (0-127) |
| `connected` | `boolean` | Device connected |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `enabled` | `toggle` | `true` | - | Enable MIDI listening |
| `channel` | `number` | `-1` | min: -1, max: 15 | MIDI channel (-1 = all) |

### Implementation
Uses Web MIDI API (`navigator.requestMIDIAccess()`). Listens to all connected MIDI input devices.

---

## MIDI Output

Send MIDI messages to devices.

### Info

Sends MIDI note messages to connected hardware or virtual MIDI devices. Provide a note number and velocity, then trigger the send. Useful for controlling synthesizers, lighting rigs, or any MIDI-compatible equipment from a flow.

**Tips:**
- Connect a trigger node to control the exact timing of note events.
- Use velocity values between 0 and 127 to control note dynamics.
- Combine with a MIDI Input node to create MIDI filtering or remapping flows.

**Works well with:** midi-input, trigger, expression, oscillator, function

| Property | Value |
|----------|-------|
| **ID** | `midi-output` |
| **Icon** | `music` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `note` | `number` | Note number to send |
| `velocity` | `number` | Note velocity |
| `trigger` | `trigger` | Send note |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `connected` | `boolean` | Device connected |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `channel` | `number` | `0` | min: 0, max: 15 | MIDI channel |

### Implementation
Sends MIDI note on/off messages via Web MIDI API.

---

## MQTT

MQTT publish/subscribe messaging via WebSocket.

### Info

Publishes and subscribes to MQTT topics using a shared connection. Incoming messages appear on the Message output along with the topic they arrived on. Supports QoS levels 0, 1, and 2 for different delivery guarantees.

**Tips:**
- Use QoS 0 for high-throughput sensor data where occasional lost messages are acceptable.
- Use QoS 2 when every message must be delivered exactly once.
- Connect the Topic output to a monitor node to debug which topics are active.

**Works well with:** json-parse, json-stringify, monitor, console, trigger

| Property | Value |
|----------|-------|
| **ID** | `mqtt` |
| **Icon** | `radio` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `url` | `string` | Broker URL |
| `topic` | `string` | Subscribe topic |
| `publish` | `data` | Data to publish |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `message` | `data` | Received message |
| `topic` | `string` | Message topic |
| `connected` | `boolean` | Connection state |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `url` | `text` | `ws://localhost:8083/mqtt` | Broker WebSocket URL |
| `topic` | `text` | `clasp/data` | Subscribe topic pattern |
| `connect` | `toggle` | `true` | Auto-connect |

### Implementation
Uses MQTT.js library over WebSocket. Supports topic wildcards (+ and #).

---

## OSC

Open Sound Control protocol over WebSocket.

### Info

Sends and receives Open Sound Control messages over a WebSocket bridge. You specify a host, port, and OSC address pattern. Incoming messages are split into their address and argument components for easy downstream processing.

**Tips:**
- Make sure an OSC-to-WebSocket bridge is running on the target host and port.
- Use address patterns like /mixer/fader1 to target specific parameters.
- Connect the Value output to a gain or expression node for real-time parameter control.

**Works well with:** midi-input, expression, gain, monitor, console

| Property | Value |
|----------|-------|
| **ID** | `osc` |
| **Icon** | `radio-tower` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `host` | `string` | Server host |
| `port` | `number` | Server port |
| `address` | `string` | OSC address pattern |
| `send` | `data` | Data to send |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `address` | `string` | Received message address |
| `args` | `data` | Message arguments array |
| `value` | `number` | First numeric argument |
| `connected` | `boolean` | Connection state |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `host` | `text` | `localhost` | - | Server host |
| `port` | `number` | `8080` | min: 1, max: 65535 | Server port |
| `address` | `text` | `/clasp` | - | Address pattern to listen |
| `connect` | `toggle` | `true` | - | Auto-connect |

### Implementation
OSC over WebSocket using osc.js library. Address patterns support wildcards.

---

## Serial Port

Serial port communication via Web Serial API.

### Info

Communicates with hardware over a serial port using the Web Serial API. Received data is available as raw bytes, parsed lines, or a numeric value. Common uses include reading from Arduino boards, microcontrollers, and other serial peripherals.

**Tips:**
- Select 115200 baud when working with modern Arduino boards that default to that speed.
- Use the Last Line output for line-delimited protocols like those from many sensor boards.
- Send text commands through the Send input to control serial devices interactively.

**Works well with:** json-parse, expression, monitor, console, trigger

| Property | Value |
|----------|-------|
| **ID** | `serial` |
| **Icon** | `usb` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `send` | `string` | Data to send |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `data` | `string` | Raw received data |
| `line` | `string` | Last complete line |
| `value` | `number` | Parsed numeric value |
| `connected` | `boolean` | Connection state |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `baudRate` | `select` | `9600` | options: 9600, 19200, 38400, 57600, 115200 | Baud rate |
| `connect` | `toggle` | `false` | - | Connect (prompts for device) |

### Implementation
Uses Web Serial API. User must interact to select port. Buffers incoming data and parses lines on newline.

---

## Bluetooth LE

Bluetooth Low Energy communication via Web Bluetooth API.

### Info

A simplified all-in-one Bluetooth LE node that handles scanning, connecting, and reading a single characteristic. Good for quick prototyping when you only need one value from one device. For more complex setups with multiple characteristics, use the dedicated BLE Scanner, Device, and Characteristic nodes instead.

**Tips:**
- Enter both the service UUID and characteristic UUID before toggling Connect.
- Use the dedicated BLE Scanner and BLE Characteristic nodes for multi-characteristic workflows.

**Works well with:** ble-scanner, ble-device, ble-characteristic, monitor

| Property | Value |
|----------|-------|
| **ID** | `ble` |
| **Icon** | `bluetooth` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `send` | `data` | Data to write |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `number` | Parsed numeric value |
| `text` | `string` | Text value |
| `rawValue` | `data` | Raw DataView |
| `deviceName` | `string` | Connected device name |
| `connected` | `boolean` | Connection state |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `serviceUUID` | `text` | `''` | BLE service UUID |
| `characteristicUUID` | `text` | `''` | BLE characteristic UUID |
| `connect` | `toggle` | `false` | Connect (prompts for device) |

### Implementation
Uses Web Bluetooth API. User must interact to pair device. Supports notifications for continuous data.

---

## BLE Scanner

Scan for Bluetooth LE devices and select one to connect.

### Info

Scans for nearby Bluetooth LE devices and lets the user select one. You can filter by standard service types, a custom UUID, or a device name prefix. The selected device reference is passed to a BLE Device node for connection.

**Tips:**
- Use a service filter to narrow results to relevant devices and speed up discovery.
- Set a name prefix filter when multiple devices of the same type are nearby.
- Trigger a new scan whenever you need to refresh the list of available devices.

**Works well with:** ble-device, ble-characteristic, trigger, console

| Property | Value |
|----------|-------|
| **ID** | `ble-scanner` |
| **Icon** | `bluetooth-searching` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `trigger` | `trigger` | Initiate device scan |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `device` | `data` | Selected BluetoothDevice object |
| `deviceName` | `string` | Device name |
| `deviceId` | `string` | Device ID |
| `scanning` | `boolean` | Scan in progress |
| `status` | `string` | Status message |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `serviceFilter` | `select` | `any` | Filter by service (any, Heart Rate, Battery, etc.) |
| `customServiceUUID` | `text` | `''` | Custom service UUID |
| `nameFilter` | `text` | `''` | Filter by device name prefix |

### Implementation
Initiates Web Bluetooth device picker. Connect the `device` output to BLE Device node's input.

---

## BLE Device

Connect to a Bluetooth LE device and enumerate its services.

### Info

Connects to a specific Bluetooth LE device and enumerates its services and characteristics. Pass in a device reference from a BLE Scanner node, and this node manages the connection lifecycle including optional auto-reconnect.

**Tips:**
- Enable Auto Reconnect to recover from dropped connections without manual intervention.
- Use the Service UUID filter to limit enumeration to a single service for faster discovery.
- Check the Connected output to gate downstream logic on active connection state.

**Works well with:** ble-scanner, ble-characteristic, monitor, gate

| Property | Value |
|----------|-------|
| **ID** | `ble-device` |
| **Icon** | `bluetooth-connected` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `device` | `data` | BluetoothDevice from BLE Scanner |
| `connect` | `trigger` | Connect to device |
| `disconnect` | `trigger` | Disconnect from device |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `services` | `data` | Array of available services |
| `characteristics` | `data` | Array of characteristics |
| `deviceName` | `string` | Connected device name |
| `deviceId` | `string` | Device ID |
| `connected` | `boolean` | Connection state |
| `status` | `string` | Status message |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `autoConnect` | `toggle` | `false` | Auto-connect when device received |
| `autoReconnect` | `toggle` | `true` | Auto-reconnect on disconnect |
| `serviceUUID` | `text` | `''` | Filter to specific service UUID |

### Implementation
Manages BLE device connection lifecycle. Enumerates services and characteristics for use with BLE Characteristic node.

---

## BLE Characteristic

Read, write, and subscribe to BLE characteristic values.

### Info

Reads, writes, and subscribes to individual BLE characteristic values on a connected device. You specify the service and characteristic UUIDs, pick a data format, and the node handles encoding and decoding automatically. Notifications push updated values as they arrive.

**Tips:**
- Enable notifications to receive continuous updates without polling.
- Use the Auto data format when working with standard Bluetooth SIG profiles.
- Connect a BLE Device node to the Device input before attempting reads or writes.

**Works well with:** ble-device, ble-scanner, monitor, json-parse

| Property | Value |
|----------|-------|
| **ID** | `ble-characteristic` |
| **Icon** | `radio-receiver` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `device` | `data` | BluetoothDevice from BLE Scanner |
| `read` | `trigger` | Read characteristic value |
| `write` | `data` | Data to write |
| `writeTrigger` | `trigger` | Execute write |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `any` | Parsed characteristic value |
| `rawValue` | `data` | Raw DataView |
| `text` | `string` | Value as UTF-8 text |
| `formatted` | `string` | Human-readable formatted value |
| `notified` | `trigger` | Fires on notification |
| `properties` | `data` | Characteristic properties |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `serviceUUID` | `text` | `''` | Service UUID (e.g., 180d) |
| `characteristicUUID` | `text` | `''` | Characteristic UUID (e.g., 2a37) |
| `dataFormat` | `select` | `auto` | Parse format (auto, uint8, int16, float32, utf8, etc.) |
| `enableNotifications` | `toggle` | `true` | Subscribe to value changes |
| `continuous` | `toggle` | `false` | Continuous polling read |

### Implementation
Provides full access to BLE characteristic operations. Supports standard GATT profiles with automatic formatting for common characteristics like Heart Rate, Battery Level, etc.

---

## CLASP Connection

Manage a named CLASP protocol connection.

### Info

Establishes and manages a named CLASP WebSocket connection that other CLASP nodes can share. Each connection has a unique ID so multiple nodes can reference the same session. Supports token-based authentication and automatic reconnection.

**Tips:**
- Give each connection a meaningful ID so other CLASP nodes can find it easily.
- Enable Auto Reconnect for long-running installations that need to survive network interruptions.
- Use the Token field when connecting to a server that requires authentication.

**Works well with:** clasp-subscribe, clasp-set, clasp-emit, clasp-get, clasp-stream

| Property | Value |
|----------|-------|
| **ID** | `clasp-connection` |
| **Icon** | `network` |
| **Version** | 1.0.0 |
| **Color** | `#6366f1` |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `url` | `string` | Server URL |
| `connect` | `trigger` | Connect trigger |
| `disconnect` | `trigger` | Disconnect trigger |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `connected` | `boolean` | Connection state |
| `status` | `string` | Status string |
| `error` | `string` | Error message |
| `session` | `string` | Session ID |
| `connectionId` | `string` | Connection ID |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `connectionId` | `text` | `default` | Unique ID for this connection |
| `url` | `text` | `ws://localhost:7330` | CLASP server URL |
| `name` | `text` | `latch` | Client name |
| `token` | `text` | `''` | Auth token (cpsk_...) |
| `autoConnect` | `toggle` | `true` | Auto-connect on start |
| `autoReconnect` | `toggle` | `true` | Auto-reconnect on disconnect |
| `reconnectDelay` | `number` | `5000` | Reconnect delay (ms) |

### Implementation
Manages CLASP WebSocket connection. Connection ID allows sharing across multiple CLASP nodes.

---

## CLASP Subscribe

Subscribe to CLASP address patterns.

### Info

Subscribes to one or more CLASP addresses using glob-style patterns and outputs values as they change. You can filter by signal type and throttle the update rate. The node stays subscribed for as long as the connection is active.

**Tips:**
- Use wildcard patterns like /lights/** to subscribe to an entire address subtree.
- Set a Max Rate to throttle high-frequency updates and reduce CPU load.
- Use the Change Threshold (epsilon) to ignore updates smaller than a given delta.

**Works well with:** clasp-connection, clasp-set, clasp-emit, monitor, json-parse

| Property | Value |
|----------|-------|
| **ID** | `clasp-subscribe` |
| **Icon** | `bell` |
| **Version** | 1.0.0 |
| **Color** | `#6366f1` |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `connectionId` | `string` | Connection ID |
| `pattern` | `string` | Address pattern |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `any` | Received value |
| `address` | `string` | Signal address |
| `type` | `string` | Signal type |
| `revision` | `number` | Value revision |
| `subscribed` | `boolean` | Subscription active |
| `updated` | `boolean` | Value updated this frame |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `connectionId` | `text` | `default` | - | Connection ID reference |
| `pattern` | `text` | `/**` | - | Address pattern (supports wildcards) |
| `types` | `select` | `all` | options: all, param, event, stream, gesture | Signal type filter |
| `maxRate` | `number` | `0` | min: 0, max: 120 | Rate limit (Hz, 0=unlimited) |
| `epsilon` | `number` | `0` | min: 0, max: 1 | Change threshold |

---

## CLASP Set

Set a CLASP parameter value.

### Info

Writes a value to a CLASP parameter address. The value persists on the server until changed again, making this the right choice for durable state like brightness levels or configuration values. Pair with CLASP Subscribe on other clients to observe the change.

**Tips:**
- Use the trigger input to control exactly when the value is written.
- Combine with an expression node to transform values before sending.
- Use CLASP Emit instead when you need a fire-and-forget event that does not persist.

**Works well with:** clasp-connection, clasp-get, clasp-subscribe, expression

| Property | Value |
|----------|-------|
| **ID** | `clasp-set` |
| **Icon** | `edit-3` |
| **Version** | 1.0.0 |
| **Color** | `#6366f1` |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `connectionId` | `string` | Connection ID |
| `address` | `string` | Parameter address |
| `value` | `any` | Value to set |
| `trigger` | `trigger` | Send trigger |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `sent` | `boolean` | Message sent |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `connectionId` | `text` | `default` | Connection ID reference |
| `address` | `text` | `/param` | Parameter address |

---

## CLASP Emit

Emit a CLASP event (one-time trigger).

### Info

Sends a one-shot CLASP event to a specified address. Events are fire-and-forget signals that do not persist state on the server. Use this for cues, triggers, and other momentary actions.

**Tips:**
- Connect a trigger input to control exactly when the event fires.
- Use address patterns like /cue/fire to organize events by category.
- Attach a payload for events that need to carry data along with the trigger.

**Works well with:** clasp-connection, clasp-subscribe, trigger, function

| Property | Value |
|----------|-------|
| **ID** | `clasp-emit` |
| **Icon** | `zap` |
| **Version** | 1.0.0 |
| **Color** | `#6366f1` |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `connectionId` | `string` | Connection ID |
| `address` | `string` | Event address |
| `payload` | `any` | Event payload |
| `trigger` | `trigger` | Emit trigger |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `sent` | `boolean` | Event sent |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `connectionId` | `text` | `default` | Connection ID reference |
| `address` | `text` | `/event` | Event address |

---

## CLASP Get

Get current value of a CLASP parameter.

### Info

Fetches the current value of a single CLASP parameter on demand. Unlike Subscribe, this performs a one-time read each time it is triggered. Use it when you need a snapshot of a parameter rather than continuous updates.

**Tips:**
- Connect a trigger node to poll the value at specific intervals or on user action.
- Use CLASP Subscribe instead if you need real-time continuous updates.
- Check the Error output to handle cases where the address does not exist.

**Works well with:** clasp-connection, clasp-set, clasp-subscribe, trigger

| Property | Value |
|----------|-------|
| **ID** | `clasp-get` |
| **Icon** | `download` |
| **Version** | 1.0.0 |
| **Color** | `#6366f1` |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `connectionId` | `string` | Connection ID |
| `address` | `string` | Parameter address |
| `trigger` | `trigger` | Get trigger |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `value` | `any` | Retrieved value |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `connectionId` | `text` | `default` | Connection ID reference |
| `address` | `text` | `/param` | Parameter address |

---

## CLASP Stream

Stream high-rate continuous data.

### Info

Sends high-rate continuous data to a CLASP address. Unlike Set, stream messages are optimized for throughput and do not guarantee persistence. Use this for sensor feeds, animation data, or any value that updates many times per second.

**Tips:**
- Disable the Enabled toggle to pause streaming without disconnecting.
- Use CLASP Set instead when the value needs to persist on the server.
- Keep the address consistent so subscribers can reliably receive the stream.

**Works well with:** clasp-connection, clasp-subscribe, oscillator, expression

| Property | Value |
|----------|-------|
| **ID** | `clasp-stream` |
| **Icon** | `activity` |
| **Version** | 1.0.0 |
| **Color** | `#6366f1` |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `connectionId` | `string` | Connection ID |
| `address` | `string` | Stream address |
| `value` | `any` | Value to stream |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `sent` | `boolean` | Data sent |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `connectionId` | `text` | `default` | Connection ID reference |
| `address` | `text` | `/stream` | Stream address |
| `enabled` | `toggle` | `true` | Enable streaming |

---

## CLASP Bundle

Send atomic bundles of CLASP operations.

### Info

Sends multiple CLASP messages as a single atomic bundle so they are applied together on the server. You can optionally schedule the bundle to execute at a specific timestamp for sample-accurate coordination. This is useful when several parameters must change in lockstep.

**Tips:**
- Use the Schedule At input to synchronize bundle execution with other timed events.
- Build the messages array using upstream nodes before connecting it to the Messages input.
- Pair with a CLASP Connection node to supply the Connection ID.

**Works well with:** clasp-connection, clasp-set, clasp-emit, trigger

| Property | Value |
|----------|-------|
| **ID** | `clasp-bundle` |
| **Icon** | `package` |
| **Version** | 1.0.0 |
| **Color** | `#6366f1` |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `connectionId` | `string` | Connection ID |
| `messages` | `data` | Array of messages |
| `at` | `number` | Schedule time (microseconds) |
| `trigger` | `trigger` | Send trigger |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `sent` | `boolean` | Bundle sent |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `connectionId` | `text` | `default` | Connection ID reference |
