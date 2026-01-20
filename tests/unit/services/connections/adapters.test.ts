import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BaseAdapter } from '@/services/connections/adapters/BaseAdapter'
import type { BaseConnectionConfig, SendOptions } from '@/services/connections/types'

// Mock the message buffer manager
vi.mock('@/services/connections/MessageBuffer', () => ({
  getMessageBufferManager: () => ({
    enqueue: vi.fn(() => 'msg-1'),
    flush: vi.fn(() => []),
    markSent: vi.fn(),
    markFailed: vi.fn(() => true),
    clear: vi.fn(),
    removeBuffer: vi.fn(),
    getStats: vi.fn(() => ({ queued: 0, oldest: null, estimatedBytes: 0, byPriority: {} })),
  }),
}))

// Concrete implementation for testing abstract BaseAdapter
class TestAdapter extends BaseAdapter {
  doConnectCalled = false
  doDisconnectCalled = false
  doSendCalled = false
  lastSentData: unknown = null
  shouldFailConnect = false
  shouldFailDisconnect = false
  shouldFailSend = false

  constructor(config: BaseConnectionConfig) {
    super(config.id, 'test', config)
  }

  protected async doConnect(): Promise<void> {
    this.doConnectCalled = true
    if (this.shouldFailConnect) {
      throw new Error('Connection failed')
    }
  }

  protected async doDisconnect(): Promise<void> {
    this.doDisconnectCalled = true
    if (this.shouldFailDisconnect) {
      throw new Error('Disconnect failed')
    }
  }

  protected async doSend(data: unknown, _options?: SendOptions): Promise<void> {
    this.doSendCalled = true
    this.lastSentData = data
    if (this.shouldFailSend) {
      throw new Error('Send failed')
    }
  }

  // Expose protected methods for testing
  public testEmitMessage(message: { topic?: string; data: unknown }) {
    this.emitMessage(message)
  }

  public testEmitError(error: Error) {
    this.emitError(error)
  }

  public testScheduleReconnect() {
    this.scheduleReconnect()
  }

  public testCancelReconnect() {
    this.cancelReconnect()
  }

  public testHandleUnexpectedDisconnect(error?: string) {
    this.handleUnexpectedDisconnect(error)
  }

  public getReconnectAttempts() {
    return this.stateMachine.context.reconnectAttempts
  }

  public getMachineState() {
    return this.stateMachine.state
  }
}

const createConfig = (overrides: Partial<BaseConnectionConfig> = {}): BaseConnectionConfig => ({
  id: 'test-adapter',
  name: 'Test Adapter',
  protocol: 'test',
  autoConnect: false,
  autoReconnect: false,
  reconnectDelay: 100, // Short delay for tests
  maxReconnectAttempts: 3,
  ...overrides,
})

describe('BaseAdapter', () => {
  let adapter: TestAdapter

  beforeEach(() => {
    adapter = new TestAdapter(createConfig())
  })

  afterEach(() => {
    adapter.dispose()
  })

  describe('Status Management', () => {
    it('should start with disconnected status', () => {
      expect(adapter.status).toBe('disconnected')
    })

    it('should update status when connected', async () => {
      await adapter.connect()
      expect(adapter.status).toBe('connected')
    })

    it('should update status when disconnected', async () => {
      await adapter.connect()
      await adapter.disconnect()
      expect(adapter.status).toBe('disconnected')
    })

    it('should set error status on connect failure', async () => {
      adapter.shouldFailConnect = true
      await expect(adapter.connect()).rejects.toThrow('Connection failed')
      expect(adapter.status).toBe('error')
    })

    it('should transition through connecting state', async () => {
      const states: string[] = []
      adapter.onStatusChange((info) => {
        states.push(info.status)
      })

      await adapter.connect()

      expect(states).toContain('connecting')
      expect(states).toContain('connected')
    })
  })

  describe('Event Subscriptions', () => {
    it('should emit status change events', async () => {
      const handler = vi.fn()
      adapter.onStatusChange(handler)

      await adapter.connect()

      expect(handler).toHaveBeenCalled()
      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ status: 'connected' }))
    })

    it('should emit message events', () => {
      const handler = vi.fn()
      adapter.onMessage(handler)

      adapter.testEmitMessage({ topic: 'test', data: { foo: 'bar' } })

      expect(handler).toHaveBeenCalledWith({ topic: 'test', data: { foo: 'bar' } })
    })

    it('should emit error events', () => {
      const handler = vi.fn()
      adapter.onError(handler)

      const error = new Error('Test error')
      adapter.testEmitError(error)

      expect(handler).toHaveBeenCalledWith(error)
    })

    it('should unsubscribe from status events', async () => {
      const handler = vi.fn()
      const unsubscribe = adapter.onStatusChange(handler)

      unsubscribe()
      await adapter.connect()

      expect(handler).not.toHaveBeenCalled()
    })

    it('should unsubscribe from message events', () => {
      const handler = vi.fn()
      const unsubscribe = adapter.onMessage(handler)

      unsubscribe()
      adapter.testEmitMessage({ data: 'test' })

      expect(handler).not.toHaveBeenCalled()
    })

    it('should unsubscribe from error events', () => {
      const handler = vi.fn()
      const unsubscribe = adapter.onError(handler)

      unsubscribe()
      adapter.testEmitError(new Error('test'))

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('Connection Lifecycle', () => {
    it('should call doConnect when connecting', async () => {
      await adapter.connect()
      expect(adapter.doConnectCalled).toBe(true)
    })

    it('should call doDisconnect when disconnecting', async () => {
      await adapter.connect()
      await adapter.disconnect()
      expect(adapter.doDisconnectCalled).toBe(true)
    })

    it('should call doSend when sending', async () => {
      await adapter.connect()
      await adapter.send({ message: 'test' })
      expect(adapter.doSendCalled).toBe(true)
      expect(adapter.lastSentData).toEqual({ message: 'test' })
    })

    it('should not allow connecting when already connected', async () => {
      await adapter.connect()
      // Second connect should be a no-op (already connected)
      await adapter.connect()
      expect(adapter.status).toBe('connected')
    })

    it('should not allow disconnecting when already disconnected', async () => {
      // Should be a no-op
      await adapter.disconnect()
      expect(adapter.status).toBe('disconnected')
    })

    it('should prevent connecting from disposed adapter', async () => {
      adapter.dispose()
      await expect(adapter.connect()).rejects.toThrow('Adapter has been disposed')
    })
  })

  describe('Reconnection', () => {
    it('should not reconnect if autoReconnect is false', () => {
      vi.useFakeTimers()

      adapter.testScheduleReconnect()

      vi.advanceTimersByTime(1000)

      expect(adapter.getReconnectAttempts()).toBe(0)

      vi.useRealTimers()
    })

    it('should schedule reconnect if autoReconnect is true', async () => {
      vi.useFakeTimers()

      const autoReconnectAdapter = new TestAdapter(createConfig({ autoReconnect: true }))

      // First connect, then simulate disconnect to trigger reconnect
      await autoReconnectAdapter.connect()
      autoReconnectAdapter.doConnectCalled = false // Reset for tracking reconnect

      autoReconnectAdapter.testHandleUnexpectedDisconnect('Connection lost')
      autoReconnectAdapter.testScheduleReconnect()

      expect(autoReconnectAdapter.getReconnectAttempts()).toBeGreaterThan(0)

      autoReconnectAdapter.dispose()
      vi.useRealTimers()
    })

    it('should respect maxReconnectAttempts', async () => {
      vi.useFakeTimers()

      const autoReconnectAdapter = new TestAdapter(
        createConfig({ autoReconnect: true, maxReconnectAttempts: 2, reconnectDelay: 100 })
      )

      // Use forceState to set up the scenario where we're at max attempts
      // This tests the guard in scheduleReconnect() directly

      // Force to error state with reconnect attempts at max
      ;(autoReconnectAdapter as unknown as { stateMachine: { forceState: (s: string, ctx: object) => void } })
        .stateMachine.forceState('error', { reconnectAttempts: 2, stateChangedAt: new Date() })

      expect(autoReconnectAdapter.status).toBe('error')
      expect(autoReconnectAdapter.getReconnectAttempts()).toBe(2)

      // Now try to schedule - should hit the max attempts guard and NOT transition
      autoReconnectAdapter.testScheduleReconnect()

      // Should still be in error state (not reconnecting) because we hit max
      expect(autoReconnectAdapter.status).toBe('error')
      // Attempts should not have incremented
      expect(autoReconnectAdapter.getReconnectAttempts()).toBe(2)

      autoReconnectAdapter.dispose()
      vi.useRealTimers()
    })

    it('should cancel reconnect', async () => {
      vi.useFakeTimers()

      const autoReconnectAdapter = new TestAdapter(createConfig({ autoReconnect: true }))

      // Connect first, then disconnect
      await autoReconnectAdapter.connect()
      autoReconnectAdapter.doConnectCalled = false

      autoReconnectAdapter.testHandleUnexpectedDisconnect()
      autoReconnectAdapter.testScheduleReconnect()
      autoReconnectAdapter.testCancelReconnect()

      vi.advanceTimersByTime(1000)

      // Connect should not have been called because we cancelled
      expect(autoReconnectAdapter.doConnectCalled).toBe(false)

      autoReconnectAdapter.dispose()
      vi.useRealTimers()
    })

    it('should reset reconnect attempts on successful connect', async () => {
      const autoReconnectAdapter = new TestAdapter(createConfig({ autoReconnect: true }))

      // First connect
      await autoReconnectAdapter.connect()

      // Simulate reconnect scenario
      autoReconnectAdapter.testHandleUnexpectedDisconnect()

      // The state machine should track this
      const attemptsAfterDisconnect = autoReconnectAdapter.getReconnectAttempts()

      // Connect again (simulating successful reconnect)
      await autoReconnectAdapter.connect()

      // Attempts should be reset
      expect(autoReconnectAdapter.getReconnectAttempts()).toBe(0)

      autoReconnectAdapter.dispose()
    })
  })

  describe('Dispose', () => {
    it('should clear all listeners on dispose', async () => {
      const statusHandler = vi.fn()
      const messageHandler = vi.fn()
      const errorHandler = vi.fn()

      adapter.onStatusChange(statusHandler)
      adapter.onMessage(messageHandler)
      adapter.onError(errorHandler)

      adapter.dispose()

      // Try to emit events (these should not call handlers)
      adapter.testEmitMessage({ data: 'test' })
      adapter.testEmitError(new Error('test'))

      // Handlers should not be called (listeners were cleared)
      expect(messageHandler).not.toHaveBeenCalled()
      expect(errorHandler).not.toHaveBeenCalled()
    })

    it('should cancel reconnect on dispose', async () => {
      vi.useFakeTimers()

      const autoReconnectAdapter = new TestAdapter(createConfig({ autoReconnect: true }))

      await autoReconnectAdapter.connect()
      autoReconnectAdapter.doConnectCalled = false
      autoReconnectAdapter.testHandleUnexpectedDisconnect()
      autoReconnectAdapter.testScheduleReconnect()
      autoReconnectAdapter.dispose()

      vi.advanceTimersByTime(1000)

      expect(autoReconnectAdapter.doConnectCalled).toBe(false)

      vi.useRealTimers()
    })
  })

  describe('Properties', () => {
    it('should expose connectionId', () => {
      expect(adapter.connectionId).toBe('test-adapter')
    })

    it('should expose protocol', () => {
      expect(adapter.protocol).toBe('test')
    })
  })

  describe('Extended Status', () => {
    it('should provide extended status info', async () => {
      await adapter.connect()
      const extendedStatus = adapter.getExtendedStatus()

      expect(extendedStatus.status).toBe('connected')
      expect(extendedStatus.machineState).toBe('connected')
      expect(extendedStatus.isBusy).toBe(false)
      expect(extendedStatus.bufferedMessages).toBeDefined()
    })

    it('should track lastConnected time', async () => {
      await adapter.connect()
      const extendedStatus = adapter.getExtendedStatus()

      expect(extendedStatus.lastConnected).toBeInstanceOf(Date)
    })

    it('should report canConnect and canDisconnect', async () => {
      expect(adapter.canConnect()).toBe(true)
      expect(adapter.canDisconnect()).toBe(false)

      await adapter.connect()

      expect(adapter.canConnect()).toBe(false)
      expect(adapter.canDisconnect()).toBe(true)
    })
  })

  describe('State Machine Integration', () => {
    it('should track machine state', async () => {
      expect(adapter.getMachineState()).toBe('idle')

      await adapter.connect()
      expect(adapter.getMachineState()).toBe('connected')

      await adapter.disconnect()
      expect(adapter.getMachineState()).toBe('disconnected')
    })

    it('should handle unexpected disconnect', async () => {
      await adapter.connect()

      adapter.testHandleUnexpectedDisconnect('Network error')

      expect(adapter.status).toBe('error')
    })
  })
})

describe('WebSocketAdapter', () => {
  // WebSocket tests would require mocking WebSocket, skipping for now
  it.todo('should connect to WebSocket server')
  it.todo('should send messages')
  it.todo('should receive messages')
  it.todo('should handle disconnection')
})

describe('ClaspAdapter', () => {
  // CLASP adapter tests would require mocking WebSocket and the protocol
  it.todo('should connect with CLASP protocol')
  it.todo('should send HELLO on connect')
  it.todo('should handle WELCOME response')
  it.todo('should set params')
  it.todo('should subscribe to patterns')
  it.todo('should emit events')
  it.todo('should stream data')
})
