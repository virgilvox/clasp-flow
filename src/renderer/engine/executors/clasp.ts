/**
 * CLASP Protocol Executors
 *
 * Full-featured CLASP connectivity nodes using the @clasp-to/core library.
 * Implements connection management with named connections that can be shared
 * across multiple nodes, similar to Node-RED's config node pattern.
 *
 * Node Types:
 * - clasp-connection: Manages a named connection (can be shared)
 * - clasp-subscribe: Subscribes to address patterns
 * - clasp-set: Sets parameter values
 * - clasp-emit: Emits events
 * - clasp-get: Gets current parameter value
 * - clasp-stream: Sends high-rate stream data
 * - clasp-bundle: Sends atomic bundles
 */

import { Clasp, ClaspBuilder, type Value } from '@clasp-to/core'
import type { ExecutionContext, NodeExecutorFn } from '../ExecutionEngine'
import { useConnectionsStore } from '@/stores/connections'
import type { ClaspConnectionConfig } from '@/services/connections/types'

// ============================================================================
// Connection Management
// ============================================================================

interface ClaspConnection {
  client: Clasp | null
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  error: string | null
  config: {
    url: string
    name: string
    token: string
    autoConnect: boolean
    autoReconnect: boolean
    reconnectDelay: number
  }
  subscribers: Set<string>
  reconnectTimer: ReturnType<typeof setTimeout> | null
  reconnectAttempts: number
}

// Global connection manager
const claspConnections = new Map<string, ClaspConnection>()

// State cache for subscribed values
const claspState = new Map<string, unknown>()

// Track active subscriptions per node
const nodeSubscriptions = new Map<string, { connectionId: string; unsubscribe: () => void; pattern: string }>()

/**
 * Get or create a connection.
 * First checks local connections, then looks up from ConnectionManager.
 */
function getConnection(connectionId: string): ClaspConnection | undefined {
  // First check local connections
  const localConn = claspConnections.get(connectionId)
  if (localConn) {
    return localConn
  }

  // If not found locally, check ConnectionManager for CLASP connections
  try {
    const connectionsStore = useConnectionsStore()
    const managedConn = connectionsStore.connections.find(
      (c) => c.id === connectionId && c.protocol === 'clasp'
    ) as ClaspConnectionConfig | undefined

    if (managedConn) {
      // Create a local connection from the managed config
      const config: ClaspConnection['config'] = {
        url: managedConn.url || 'ws://localhost:7330',
        name: managedConn.name || 'latch',
        token: managedConn.token || '',
        autoConnect: managedConn.autoConnect ?? true,
        autoReconnect: managedConn.autoReconnect ?? true,
        reconnectDelay: managedConn.reconnectDelay ?? 5000,
      }
      return createConnection(connectionId, config)
    }
  } catch (e) {
    console.warn('[CLASP] Could not access ConnectionManager:', e)
  }

  return undefined
}

/**
 * Get or create a connection and auto-connect if needed
 */
async function getOrConnectConnection(connectionId: string): Promise<ClaspConnection | undefined> {
  const connection = getConnection(connectionId)
  if (!connection) {
    return undefined
  }

  // Auto-connect if disconnected and autoConnect is enabled
  if (connection.status === 'disconnected' && connection.config.autoConnect) {
    try {
      await connect(connection, connectionId)
    } catch (e) {
      console.warn('[CLASP] Auto-connect failed:', e)
    }
  }

  return connection
}

/**
 * Create a new connection configuration
 */
function createConnection(connectionId: string, config: ClaspConnection['config']): ClaspConnection {
  const connection: ClaspConnection = {
    client: null,
    status: 'disconnected',
    error: null,
    config,
    subscribers: new Set(),
    reconnectTimer: null,
    reconnectAttempts: 0,
  }
  claspConnections.set(connectionId, connection)
  return connection
}

/** Maximum reconnection attempts */
const MAX_RECONNECT_ATTEMPTS = 10

/** Connection timeout in milliseconds */
const CONNECTION_TIMEOUT = 10000

/**
 * Connect to CLASP server using @clasp-to/core
 */
async function connect(connection: ClaspConnection, connectionId: string): Promise<void> {
  if (connection.client?.connected) {
    return
  }

  connection.status = 'connecting'
  connection.error = null

  try {
    const builder = new ClaspBuilder(connection.config.url)
      .name(connection.config.name)
      .reconnect(false) // We handle reconnection ourselves

    if (connection.config.token) {
      builder.token(connection.config.token)
    }

    // Create connection with timeout
    const connectPromise = builder.connect()
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT)
    })

    connection.client = await Promise.race([connectPromise, timeoutPromise])
    connection.status = 'connected'
    connection.reconnectAttempts = 0

    console.log(`[CLASP] Connected to ${connection.config.url}, session: ${connection.client.session}`)

    // Listen for disconnection
    connection.client.onDisconnect((reason) => {
      console.log(`[CLASP] Disconnected from ${connection.config.url}: ${reason}`)
      connection.status = 'disconnected'
      connection.client = null
      scheduleReconnect(connection, connectionId)
    })

    connection.client.onError((error) => {
      console.error(`[CLASP] Error:`, error)
      connection.error = error.message
    })
  } catch (e) {
    connection.status = 'error'
    connection.error = e instanceof Error ? e.message : String(e)
    connection.client = null

    // Schedule reconnect if enabled
    scheduleReconnect(connection, connectionId)

    throw e
  }
}

/**
 * Schedule reconnection with exponential backoff
 */
function scheduleReconnect(connection: ClaspConnection, connectionId: string): void {
  if (!connection.config.autoReconnect) return
  if (connection.subscribers.size === 0) return
  if (connection.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.log(`[CLASP] Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached for ${connectionId}`)
    connection.error = 'Max reconnection attempts reached'
    return
  }

  // Exponential backoff: delay * 2^(attempts), capped at 30 seconds
  const backoffDelay = Math.min(
    connection.config.reconnectDelay * Math.pow(2, connection.reconnectAttempts),
    30000
  )
  connection.reconnectAttempts++

  console.log(`[CLASP] Reconnecting in ${backoffDelay}ms (attempt ${connection.reconnectAttempts})`)

  connection.reconnectTimer = setTimeout(() => {
    connect(connection, connectionId).catch(() => {})
  }, backoffDelay)
}

/**
 * Disconnect
 */
function disconnect(connection: ClaspConnection): void {
  if (connection.reconnectTimer) {
    clearTimeout(connection.reconnectTimer)
    connection.reconnectTimer = null
  }
  connection.config.autoReconnect = false

  if (connection.client) {
    connection.client.close()
    connection.client = null
  }
  connection.status = 'disconnected'
}

// ============================================================================
// CLASP Connection Node Executor
// ============================================================================

export const claspConnectionExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const connectionId = (ctx.controls.get('connectionId') as string) ?? 'default'
  const url = (ctx.inputs.get('url') as string) ?? (ctx.controls.get('url') as string) ?? 'ws://localhost:7330'
  const name = (ctx.controls.get('name') as string) ?? 'latch'
  const token = (ctx.controls.get('token') as string) ?? ''
  const autoConnect = (ctx.controls.get('autoConnect') as boolean) ?? true
  const autoReconnect = (ctx.controls.get('autoReconnect') as boolean) ?? true
  const reconnectDelay = (ctx.controls.get('reconnectDelay') as number) ?? 5000

  const connectTrigger = ctx.inputs.get('connect') as boolean
  const disconnectTrigger = ctx.inputs.get('disconnect') as boolean

  const outputs = new Map<string, unknown>()

  // Get or create connection
  let connection = getConnection(connectionId)

  if (!connection) {
    connection = createConnection(connectionId, {
      url,
      name,
      token,
      autoConnect,
      autoReconnect,
      reconnectDelay,
    })
  } else {
    // Update config if changed
    connection.config = { url, name, token, autoConnect, autoReconnect, reconnectDelay }
  }

  // Track this node as a subscriber
  connection.subscribers.add(ctx.nodeId)

  // Handle connect trigger
  if (connectTrigger || (autoConnect && connection.status === 'disconnected' && !connection.reconnectTimer)) {
    try {
      await connect(connection, connectionId)
    } catch (e) {
      connection.error = e instanceof Error ? e.message : String(e)
    }
  }

  // Handle disconnect trigger
  if (disconnectTrigger) {
    disconnect(connection)
  }

  outputs.set('connected', connection.status === 'connected')
  outputs.set('status', connection.status)
  outputs.set('error', connection.error)
  outputs.set('session', connection.client?.session ?? null)
  outputs.set('connectionId', connectionId)

  return outputs
}

// ============================================================================
// CLASP Subscribe Node Executor
// ============================================================================

export const claspSubscribeExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const connectionId = (ctx.inputs.get('connectionId') as string) ?? (ctx.controls.get('connectionId') as string) ?? ''
  const pattern = (ctx.inputs.get('pattern') as string) ?? (ctx.controls.get('pattern') as string) ?? '/**'

  const outputs = new Map<string, unknown>()

  // Skip if no connection selected
  if (!connectionId) {
    outputs.set('value', null)
    outputs.set('address', null)
    outputs.set('type', null)
    outputs.set('revision', null)
    outputs.set('subscribed', false)
    return outputs
  }

  const connection = await getOrConnectConnection(connectionId)

  if (!connection || connection.status !== 'connected' || !connection.client) {
    outputs.set('value', null)
    outputs.set('address', null)
    outputs.set('type', null)
    outputs.set('revision', null)
    outputs.set('subscribed', false)
    return outputs
  }

  // Check if we need to update subscription
  const existingSub = nodeSubscriptions.get(ctx.nodeId)
  if (!existingSub || existingSub.connectionId !== connectionId || existingSub.pattern !== pattern) {
    // Unsubscribe from old
    if (existingSub) {
      existingSub.unsubscribe()
    }

    // Subscribe using the library's on() method
    const unsubscribe = connection.client.on(pattern, (value: Value, address: string) => {
      // Store in state cache
      claspState.set(`${ctx.nodeId}:_hasUpdate`, true)
      claspState.set(`${ctx.nodeId}:_lastAddress`, address)
      claspState.set(`${ctx.nodeId}:_lastValue`, value)
      claspState.set(`${ctx.nodeId}:_lastType`, 'param')
    })

    nodeSubscriptions.set(ctx.nodeId, { connectionId, unsubscribe, pattern })
  }

  // Get latest value from state cache
  const hasUpdate = claspState.get(`${ctx.nodeId}:_hasUpdate`) as boolean
  const lastValue = claspState.get(`${ctx.nodeId}:_lastValue`)
  const lastAddress = claspState.get(`${ctx.nodeId}:_lastAddress`) as string | undefined
  const lastType = claspState.get(`${ctx.nodeId}:_lastType`) as string | undefined

  // Clear update flag
  claspState.set(`${ctx.nodeId}:_hasUpdate`, false)

  outputs.set('value', lastValue ?? null)
  outputs.set('address', lastAddress ?? null)
  outputs.set('type', lastType ?? null)
  outputs.set('revision', null)
  outputs.set('subscribed', true)
  outputs.set('updated', hasUpdate ?? false)

  return outputs
}

// ============================================================================
// CLASP Set Node Executor
// ============================================================================

export const claspSetExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const connectionId = (ctx.inputs.get('connectionId') as string) ?? (ctx.controls.get('connectionId') as string) ?? ''
  const address = (ctx.inputs.get('address') as string) ?? (ctx.controls.get('address') as string) ?? '/param'
  const value = ctx.inputs.get('value')
  const trigger = ctx.inputs.get('trigger') as boolean

  const outputs = new Map<string, unknown>()

  // Skip if no connection selected
  if (!connectionId) {
    outputs.set('sent', false)
    outputs.set('error', 'No connection selected')
    return outputs
  }

  const connection = await getOrConnectConnection(connectionId)

  if (!connection || connection.status !== 'connected' || !connection.client) {
    outputs.set('sent', false)
    outputs.set('error', 'Not connected')
    return outputs
  }

  // Only send when triggered (or when value changes if no trigger connected)
  if (trigger && value !== undefined) {
    try {
      connection.client.set(address, value as Value)
      outputs.set('sent', true)
      outputs.set('error', null)
    } catch (e) {
      outputs.set('sent', false)
      outputs.set('error', e instanceof Error ? e.message : 'Failed to send')
    }
  } else {
    outputs.set('sent', false)
    outputs.set('error', null)
  }

  return outputs
}

// ============================================================================
// CLASP Emit Node Executor
// ============================================================================

export const claspEmitExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const connectionId = (ctx.inputs.get('connectionId') as string) ?? (ctx.controls.get('connectionId') as string) ?? ''
  const address = (ctx.inputs.get('address') as string) ?? (ctx.controls.get('address') as string) ?? '/event'
  const payload = ctx.inputs.get('payload')
  const trigger = ctx.inputs.get('trigger') as boolean

  const outputs = new Map<string, unknown>()

  if (!connectionId) {
    outputs.set('sent', false)
    outputs.set('error', 'No connection selected')
    return outputs
  }

  const connection = await getOrConnectConnection(connectionId)

  if (!connection || connection.status !== 'connected' || !connection.client) {
    outputs.set('sent', false)
    outputs.set('error', 'Not connected')
    return outputs
  }

  // Only send when triggered
  if (trigger) {
    try {
      connection.client.emit(address, (payload ?? null) as Value | undefined)
      outputs.set('sent', true)
      outputs.set('error', null)
    } catch (e) {
      outputs.set('sent', false)
      outputs.set('error', e instanceof Error ? e.message : 'Failed to send')
    }
  } else {
    outputs.set('sent', false)
    outputs.set('error', null)
  }

  return outputs
}

// ============================================================================
// CLASP Get Node Executor
// ============================================================================

export const claspGetExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const connectionId = (ctx.inputs.get('connectionId') as string) ?? (ctx.controls.get('connectionId') as string) ?? ''
  const address = (ctx.inputs.get('address') as string) ?? (ctx.controls.get('address') as string) ?? '/param'
  const trigger = ctx.inputs.get('trigger') as boolean

  const outputs = new Map<string, unknown>()

  if (!connectionId) {
    outputs.set('value', null)
    outputs.set('error', 'No connection selected')
    return outputs
  }

  const connection = await getOrConnectConnection(connectionId)

  if (!connection || connection.status !== 'connected' || !connection.client) {
    outputs.set('value', null)
    outputs.set('error', 'Not connected')
    return outputs
  }

  // Check cache first
  const cachedValue = connection.client.cached(address)
  if (cachedValue !== undefined) {
    outputs.set('value', cachedValue)
    outputs.set('error', null)
    return outputs
  }

  // Request from server when triggered
  if (trigger) {
    try {
      const value = await connection.client.get(address)
      outputs.set('value', value)
      outputs.set('error', null)
    } catch (e) {
      outputs.set('value', null)
      outputs.set('error', e instanceof Error ? e.message : 'Failed to get')
    }
  } else {
    outputs.set('value', null)
    outputs.set('error', null)
  }

  return outputs
}

// ============================================================================
// CLASP Stream Node Executor
// ============================================================================

export const claspStreamExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const connectionId = (ctx.inputs.get('connectionId') as string) ?? (ctx.controls.get('connectionId') as string) ?? ''
  const address = (ctx.inputs.get('address') as string) ?? (ctx.controls.get('address') as string) ?? '/stream'
  const value = ctx.inputs.get('value')
  const enabled = (ctx.controls.get('enabled') as boolean) ?? true

  const outputs = new Map<string, unknown>()

  if (!connectionId || !enabled) {
    outputs.set('sent', false)
    return outputs
  }

  const connection = await getOrConnectConnection(connectionId)

  if (!connection || connection.status !== 'connected' || !connection.client) {
    outputs.set('sent', false)
    return outputs
  }

  // Send continuously while enabled and value is provided
  if (value !== undefined) {
    try {
      connection.client.stream(address, value as Value)
      outputs.set('sent', true)
    } catch {
      outputs.set('sent', false)
    }
  } else {
    outputs.set('sent', false)
  }

  return outputs
}

// ============================================================================
// CLASP Bundle Node Executor
// ============================================================================

export const claspBundleExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const connectionId = (ctx.inputs.get('connectionId') as string) ?? (ctx.controls.get('connectionId') as string) ?? ''
  const messages = ctx.inputs.get('messages') as Array<{ set?: [string, unknown]; emit?: [string, unknown] }> | undefined
  const trigger = ctx.inputs.get('trigger') as boolean
  const scheduledTime = ctx.inputs.get('at') as number | undefined

  const outputs = new Map<string, unknown>()

  if (!connectionId) {
    outputs.set('sent', false)
    outputs.set('error', 'No connection selected')
    return outputs
  }

  const connection = await getOrConnectConnection(connectionId)

  if (!connection || connection.status !== 'connected' || !connection.client) {
    outputs.set('sent', false)
    outputs.set('error', 'Not connected')
    return outputs
  }

  // Only send when triggered
  if (trigger && messages && messages.length > 0) {
    try {
      const opts = scheduledTime ? { at: scheduledTime } : undefined
      connection.client.bundle(messages as Array<{ set?: [string, Value]; emit?: [string, Value] }>, opts)
      outputs.set('sent', true)
      outputs.set('error', null)
    } catch (e) {
      outputs.set('sent', false)
      outputs.set('error', e instanceof Error ? e.message : 'Failed to send')
    }
  } else {
    outputs.set('sent', false)
    outputs.set('error', null)
  }

  return outputs
}

// ============================================================================
// Cleanup and Disposal
// ============================================================================

/**
 * Dispose a CLASP node and clean up resources
 */
export function disposeClaspNode(nodeId: string): void {
  // Clean up subscriptions
  const sub = nodeSubscriptions.get(nodeId)
  if (sub) {
    sub.unsubscribe()

    const connection = claspConnections.get(sub.connectionId)
    if (connection) {
      connection.subscribers.delete(nodeId)

      // If no more subscribers, disconnect
      if (connection.subscribers.size === 0) {
        disconnect(connection)
        claspConnections.delete(sub.connectionId)
      }
    }
    nodeSubscriptions.delete(nodeId)
  }

  // Clean up state cache entries for this node
  const keysToDelete: string[] = []
  for (const key of claspState.keys()) {
    if (key.startsWith(`${nodeId}:`)) {
      keysToDelete.push(key)
    }
  }
  for (const key of keysToDelete) {
    claspState.delete(key)
  }
}

/**
 * Dispose all CLASP connections
 */
export function disposeAllClaspConnections(): void {
  for (const [, connection] of claspConnections) {
    disconnect(connection)
  }
  claspConnections.clear()
  nodeSubscriptions.clear()
  claspState.clear()
}

/**
 * Get connection status for debugging
 */
export function getClaspConnectionStatus(): Map<string, { status: string; session: string | null; subscribers: number }> {
  const status = new Map<string, { status: string; session: string | null; subscribers: number }>()
  for (const [id, connection] of claspConnections) {
    status.set(id, {
      status: connection.status,
      session: connection.client?.session ?? null,
      subscribers: connection.subscribers.size,
    })
  }
  return status
}

// ============================================================================
// Export all executors
// ============================================================================

export const claspExecutors: Record<string, NodeExecutorFn> = {
  'clasp-connection': claspConnectionExecutor,
  'clasp-subscribe': claspSubscribeExecutor,
  'clasp-set': claspSetExecutor,
  'clasp-emit': claspEmitExecutor,
  'clasp-get': claspGetExecutor,
  'clasp-stream': claspStreamExecutor,
  'clasp-bundle': claspBundleExecutor,
}
