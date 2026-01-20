/**
 * Connection Manager Types
 *
 * Core interfaces for the standardized connection management system.
 * Supports CLASP as unified layer with fallback to direct adapters.
 */

import type { ControlDefinition } from '@/stores/nodes'

// ============================================================================
// Connection Status
// ============================================================================

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'

export interface ConnectionStatusInfo {
  status: ConnectionStatus
  error?: string
  lastConnected?: Date
  reconnectAttempts?: number
}

// ============================================================================
// Base Connection Config
// ============================================================================

/**
 * Base configuration that all connection types extend
 */
export interface BaseConnectionConfig {
  /** Unique identifier (e.g., "mqtt-production") */
  id: string
  /** Human-readable name (e.g., "Production Broker") */
  name: string
  /** Protocol identifier (e.g., "mqtt", "websocket", "clasp") */
  protocol: string
  /** Auto-connect on flow start */
  autoConnect: boolean
  /** Auto-reconnect on disconnect */
  autoReconnect: boolean
  /** Delay between reconnection attempts (ms) */
  reconnectDelay: number
  /** Maximum reconnection attempts (0 = unlimited) */
  maxReconnectAttempts: number
}

// ============================================================================
// Protocol-Specific Configs
// ============================================================================

export interface ClaspConnectionConfig extends BaseConnectionConfig {
  protocol: 'clasp'
  url: string
  token?: string
}

export interface WebSocketConnectionConfig extends BaseConnectionConfig {
  protocol: 'websocket'
  url: string
  protocols?: string[]
}

export interface MqttConnectionConfig extends BaseConnectionConfig {
  protocol: 'mqtt'
  /** Transport protocol */
  transport: 'ws' | 'wss' | 'mqtt' | 'mqtts'
  /** Broker hostname or IP */
  host: string
  /** Broker port */
  port: number
  /** WebSocket path (for ws/wss) */
  path?: string
  /** Client identifier (auto-generated if empty) */
  clientId?: string
  /** Authentication username */
  username?: string
  /** Authentication password */
  password?: string
  /** Keep-alive interval in seconds */
  keepAlive?: number
  /** Start with clean session */
  cleanSession?: boolean
  /** Connection timeout in milliseconds */
  connectTimeout?: number
  /** Protocol version (3 = 3.1, 4 = 3.1.1, 5 = 5.0) */
  protocolVersion?: 3 | 4 | 5
  /** Last Will and Testament */
  will?: {
    topic: string
    payload: string
    qos: 0 | 1 | 2
    retain: boolean
  }
  /** Legacy: full broker URL (deprecated, use host/port/transport instead) */
  brokerUrl?: string
}

export interface OscConnectionConfig extends BaseConnectionConfig {
  protocol: 'osc'
  host: string
  port: number
  transport: 'udp' | 'websocket'
}

export interface MidiConnectionConfig extends BaseConnectionConfig {
  protocol: 'midi'
  deviceId?: string
  direction: 'input' | 'output' | 'both'
}

export interface SerialConnectionConfig extends BaseConnectionConfig {
  protocol: 'serial'
  baudRate: number
  dataBits?: 5 | 6 | 7 | 8
  stopBits?: 1 | 2
  parity?: 'none' | 'even' | 'odd'
}

export interface BleConnectionConfig extends BaseConnectionConfig {
  protocol: 'ble'
  serviceUUID: string
  characteristicUUIDs?: string[]
}

// ============================================================================
// HTTP Endpoint Templates
// ============================================================================

/**
 * Parameter definition for HTTP endpoint templates
 */
export interface HttpTemplateParameter {
  /** Parameter name - matches {{name}} in templates */
  name: string
  /** Parameter type for validation/conversion */
  type: 'string' | 'number' | 'boolean' | 'json'
  /** Default value if not provided */
  default?: unknown
  /** Whether this parameter is required */
  required?: boolean
  /** Human-readable description */
  description?: string
}

/**
 * HTTP endpoint template for reusable request configurations
 */
export interface HttpEndpointTemplate {
  /** Unique identifier within the connection */
  id: string
  /** Human-readable name (e.g., "Get User", "Create Order") */
  name: string
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Request path (can include {{placeholders}}) */
  path: string
  /** Additional headers (can include {{placeholders}}) */
  headers?: Record<string, string>
  /** Request body template (JSON with {{placeholders}}) */
  bodyTemplate?: string
  /** Parameter definitions */
  parameters?: HttpTemplateParameter[]
  /** Human-readable description */
  description?: string
}

export interface HttpConnectionConfig extends BaseConnectionConfig {
  protocol: 'http'
  baseUrl: string
  headers?: Record<string, string>
  timeout?: number
  /** Endpoint templates for reusable request configurations */
  templates?: HttpEndpointTemplate[]
}

/** Union of all connection config types */
export type ConnectionConfig =
  | ClaspConnectionConfig
  | WebSocketConnectionConfig
  | MqttConnectionConfig
  | OscConnectionConfig
  | MidiConnectionConfig
  | SerialConnectionConfig
  | BleConnectionConfig
  | HttpConnectionConfig

// ============================================================================
// Connection Type Definition (for registration)
// ============================================================================

export type ConnectionCategory = 'protocol' | 'hardware' | 'cloud' | 'local'

export type Platform = 'web' | 'electron'

/**
 * Definition for registering a connection type with the manager
 */
export interface ConnectionTypeDefinition<TConfig extends BaseConnectionConfig = BaseConnectionConfig> {
  /** Unique protocol identifier (e.g., "mqtt") */
  id: string
  /** Display name (e.g., "MQTT Broker") */
  name: string
  /** Lucide icon name */
  icon: string
  /** Brand/theme color */
  color: string
  /** Category for grouping */
  category: ConnectionCategory
  /** Description shown in UI */
  description: string
  /** Which platforms support this connection type */
  platforms: Platform[]
  /** Form controls for configuration */
  configControls: ControlDefinition[]
  /** Default configuration values */
  defaultConfig: Partial<TConfig>
  /** Factory to create the adapter instance */
  createAdapter: (config: TConfig) => ConnectionAdapter
}

// ============================================================================
// Connection Adapter Interface
// ============================================================================

/**
 * Event types emitted by connection adapters
 */
export interface ConnectionAdapterEvents {
  'status-change': ConnectionStatusInfo
  'message': { topic?: string; data: unknown }
  'error': Error
}

export type ConnectionAdapterEventHandler<K extends keyof ConnectionAdapterEvents> =
  (event: ConnectionAdapterEvents[K]) => void

/**
 * Runtime adapter interface - implemented by each protocol
 */
export interface ConnectionAdapter {
  /** Current connection status */
  readonly status: ConnectionStatus
  /** Protocol identifier */
  readonly protocol: string
  /** Connection ID */
  readonly connectionId: string

  /** Connect to the remote endpoint */
  connect(): Promise<void>
  /** Disconnect from the remote endpoint */
  disconnect(): Promise<void>
  /** Clean up resources */
  dispose(): void

  /** Subscribe to status changes */
  onStatusChange(callback: (status: ConnectionStatusInfo) => void): () => void
  /** Subscribe to messages */
  onMessage(callback: (message: { topic?: string; data: unknown }) => void): () => void
  /** Subscribe to errors */
  onError(callback: (error: Error) => void): () => void

  /** Send data (protocol-specific) */
  send(data: unknown, options?: Record<string, unknown>): Promise<void>

  /** Protocol-specific methods can be added via type intersection */
}

// ============================================================================
// CLASP-Specific Types
// ============================================================================

export interface ClaspAdapter extends ConnectionAdapter {
  protocol: 'clasp'

  /** Set a parameter value */
  setParam(key: string, value: unknown): Promise<void>
  /** Get a parameter value */
  getParam(key: string): unknown
  /** Subscribe to a parameter pattern */
  subscribe(pattern: string): Promise<number>
  /** Unsubscribe from a subscription */
  unsubscribe(subscriptionId: number): Promise<void>
  /** Emit a trigger event */
  emit(trigger: string, payload?: unknown): Promise<void>
  /** Stream data */
  stream(channel: string, data: unknown): Promise<void>
}

// ============================================================================
// Connection Manager Interface
// ============================================================================

/**
 * Events emitted by the connection manager
 */
export interface ConnectionManagerEvents {
  'connection-added': BaseConnectionConfig
  'connection-removed': string
  'connection-updated': BaseConnectionConfig
  'status-change': { connectionId: string; status: ConnectionStatusInfo }
  'type-registered': ConnectionTypeDefinition
  'type-unregistered': string
}

export type ConnectionManagerEventHandler<K extends keyof ConnectionManagerEvents> =
  (event: ConnectionManagerEvents[K]) => void

/**
 * Connection manager service interface
 */
export interface IConnectionManager {
  // Type Registry
  registerType<TConfig extends BaseConnectionConfig>(
    definition: ConnectionTypeDefinition<TConfig>
  ): void
  unregisterType(typeId: string): void
  getType(typeId: string): ConnectionTypeDefinition | undefined
  getTypes(): ConnectionTypeDefinition[]
  getTypesForPlatform(platform: Platform): ConnectionTypeDefinition[]

  // Connection Management
  addConnection(config: BaseConnectionConfig): void
  removeConnection(connectionId: string): void
  updateConnection(connectionId: string, updates: Partial<BaseConnectionConfig>): void
  getConnection(connectionId: string): BaseConnectionConfig | undefined
  getConnections(): BaseConnectionConfig[]
  getConnectionsByProtocol(protocol: string): BaseConnectionConfig[]

  // Adapter Management
  getAdapter(connectionId: string): ConnectionAdapter | undefined
  connect(connectionId: string): Promise<void>
  disconnect(connectionId: string): Promise<void>
  connectAll(): Promise<void>
  disconnectAll(): Promise<void>
  getStatus(connectionId: string): ConnectionStatusInfo | undefined

  // Events
  on<K extends keyof ConnectionManagerEvents>(
    event: K,
    handler: ConnectionManagerEventHandler<K>
  ): () => void

  // Persistence
  exportConnections(): BaseConnectionConfig[]
  importConnections(configs: BaseConnectionConfig[]): void
  replaceConnections(configs: BaseConnectionConfig[]): void

  // Lifecycle
  dispose(): void
}

// ============================================================================
// Serialization Format
// ============================================================================

/**
 * Format for persisting connections in flow files
 */
export interface ConnectionsSerializationData {
  version: string
  connections: BaseConnectionConfig[]
}

// ============================================================================
// Node Integration Types
// ============================================================================

/**
 * Connection requirement for a node definition
 */
export interface NodeConnectionRequirement {
  /** Which connection type/protocol is required */
  protocol: string
  /** Which control holds the connection selection */
  controlId: string
  /** Whether a connection is required for the node to work */
  required?: boolean
}

// ============================================================================
// Extended Status Info (with buffer stats)
// ============================================================================

/**
 * Extended connection status with buffer information
 */
export interface ExtendedConnectionStatusInfo extends ConnectionStatusInfo {
  /** Number of messages buffered for this connection */
  bufferedMessages?: number
  /** State machine state (if using state machine) */
  machineState?: string
  /** Whether connection is currently busy (connecting/disconnecting) */
  isBusy?: boolean
}

// ============================================================================
// Send Options
// ============================================================================

/**
 * Options when sending a message through an adapter
 */
export interface SendOptions {
  /** Topic/channel for the message (protocol-specific) */
  topic?: string
  /** Whether to buffer the message if disconnected (default: true) */
  buffer?: boolean
  /** Message priority for buffering */
  priority?: 'low' | 'normal' | 'high' | 'critical'
  /** Time-to-live for buffered message (ms) */
  ttl?: number
  /** QoS level (for MQTT) */
  qos?: 0 | 1 | 2
  /** Retain flag (for MQTT) */
  retain?: boolean
  /** Additional protocol-specific options */
  [key: string]: unknown
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Result of validating a node's connections
 */
export interface ConnectionValidationResult {
  /** Whether the node passed validation */
  valid: boolean
  /** Validation errors (blocking issues) */
  errors: ConnectionValidationError[]
  /** Validation warnings (non-blocking issues) */
  warnings: ConnectionValidationWarning[]
}

/**
 * A validation error for a connection
 */
export interface ConnectionValidationError {
  /** The node ID with the error */
  nodeId: string
  /** The connection requirement that failed */
  requirement: NodeConnectionRequirement
  /** Error message */
  message: string
  /** Error code for programmatic handling */
  code: 'MISSING_CONNECTION' | 'DISCONNECTED' | 'ERROR_STATE' | 'INVALID_CONFIG'
}

/**
 * A validation warning for a connection
 */
export interface ConnectionValidationWarning {
  /** The node ID with the warning */
  nodeId: string
  /** Warning message */
  message: string
  /** Warning code */
  code: 'RECONNECTING' | 'UNSTABLE' | 'LEGACY_CREDENTIALS'
}

// ============================================================================
// Credential Types
// ============================================================================

/**
 * Credential field definition
 */
export interface CredentialFieldDefinition {
  /** Field ID (e.g., "password", "apiKey") */
  id: string
  /** Field label */
  label: string
  /** Field type */
  type: 'password' | 'token' | 'certificate'
  /** Whether this field is required */
  required?: boolean
}

/**
 * Credential metadata (stored in connection config, not the actual secret)
 */
export interface CredentialMetadata {
  /** Whether credentials exist for this connection */
  hasCredentials: boolean
  /** Which credential fields are configured */
  configuredFields: string[]
  /** Last updated timestamp */
  lastUpdated?: Date
}

// ============================================================================
// Custom Connection Type Registration
// ============================================================================

/**
 * Context provided to custom nodes for registering connection types
 */
export interface ConnectionRegistrationContext {
  /** Register a custom connection type */
  registerType: <TConfig extends BaseConnectionConfig>(
    definition: ConnectionTypeDefinition<TConfig>
  ) => void
  /** Unregister a custom connection type */
  unregisterType: (typeId: string) => void
  /** Check if a type is already registered */
  hasType: (typeId: string) => boolean
}
