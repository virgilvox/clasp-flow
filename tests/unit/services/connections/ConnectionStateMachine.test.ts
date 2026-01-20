import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ConnectionStateMachine,
  createConnectionStateMachine,
  type ConnectionState,
  type ConnectionEvent,
} from '@/services/connections/ConnectionStateMachine'

describe('ConnectionStateMachine', () => {
  let machine: ConnectionStateMachine

  beforeEach(() => {
    machine = createConnectionStateMachine()
  })

  describe('Initial State', () => {
    it('should start in idle state', () => {
      expect(machine.state).toBe('idle')
    })

    it('should have initial context with zero reconnect attempts', () => {
      expect(machine.context.reconnectAttempts).toBe(0)
    })

    it('should have stateChangedAt timestamp', () => {
      expect(machine.context.stateChangedAt).toBeInstanceOf(Date)
    })

    it('should not have error in initial context', () => {
      expect(machine.context.error).toBeUndefined()
    })
  })

  describe('Valid Transitions', () => {
    describe('from idle state', () => {
      it('should transition to connecting on CONNECT', () => {
        const result = machine.send({ type: 'CONNECT' })
        expect(result).toBe(true)
        expect(machine.state).toBe('connecting')
      })

      it('should reject DISCONNECT from idle', () => {
        const result = machine.send({ type: 'DISCONNECT' })
        expect(result).toBe(false)
        expect(machine.state).toBe('idle')
      })

      it('should reject CONNECTED from idle', () => {
        const result = machine.send({ type: 'CONNECTED' })
        expect(result).toBe(false)
        expect(machine.state).toBe('idle')
      })
    })

    describe('from connecting state', () => {
      beforeEach(() => {
        machine.send({ type: 'CONNECT' })
      })

      it('should transition to connected on CONNECTED', () => {
        const result = machine.send({ type: 'CONNECTED' })
        expect(result).toBe(true)
        expect(machine.state).toBe('connected')
      })

      it('should transition to error on ERROR', () => {
        const result = machine.send({ type: 'ERROR', error: 'Connection failed' })
        expect(result).toBe(true)
        expect(machine.state).toBe('error')
        expect(machine.context.error).toBe('Connection failed')
      })

      it('should transition to disconnecting on DISCONNECT', () => {
        const result = machine.send({ type: 'DISCONNECT' })
        expect(result).toBe(true)
        expect(machine.state).toBe('disconnecting')
      })
    })

    describe('from connected state', () => {
      beforeEach(() => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })
      })

      it('should transition to disconnecting on DISCONNECT', () => {
        const result = machine.send({ type: 'DISCONNECT' })
        expect(result).toBe(true)
        expect(machine.state).toBe('disconnecting')
      })

      it('should transition to error on ERROR', () => {
        const result = machine.send({ type: 'ERROR', error: 'Lost connection' })
        expect(result).toBe(true)
        expect(machine.state).toBe('error')
      })

      it('should clear error and set lastConnected on CONNECTED', () => {
        // First go through error then reconnect
        machine.send({ type: 'ERROR', error: 'temp error' })
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })

        expect(machine.context.error).toBeUndefined()
        expect(machine.context.lastConnected).toBeInstanceOf(Date)
      })
    })

    describe('from disconnecting state', () => {
      beforeEach(() => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })
        machine.send({ type: 'DISCONNECT' })
      })

      it('should transition to disconnected on DISCONNECTED', () => {
        const result = machine.send({ type: 'DISCONNECTED' })
        expect(result).toBe(true)
        expect(machine.state).toBe('disconnected')
      })

      it('should transition to error on ERROR', () => {
        const result = machine.send({ type: 'ERROR', error: 'Disconnect failed' })
        expect(result).toBe(true)
        expect(machine.state).toBe('error')
      })
    })

    describe('from disconnected state', () => {
      beforeEach(() => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })
        machine.send({ type: 'DISCONNECT' })
        machine.send({ type: 'DISCONNECTED' })
      })

      it('should transition to connecting on CONNECT', () => {
        const result = machine.send({ type: 'CONNECT' })
        expect(result).toBe(true)
        expect(machine.state).toBe('connecting')
      })

      it('should transition to reconnecting on RECONNECT_SCHEDULED', () => {
        const result = machine.send({ type: 'RECONNECT_SCHEDULED' })
        expect(result).toBe(true)
        expect(machine.state).toBe('reconnecting')
      })

      it('should transition to idle on RESET', () => {
        const result = machine.send({ type: 'RESET' })
        expect(result).toBe(true)
        expect(machine.state).toBe('idle')
      })
    })

    describe('from reconnecting state', () => {
      beforeEach(() => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })
        machine.send({ type: 'DISCONNECT' })
        machine.send({ type: 'DISCONNECTED' })
        machine.send({ type: 'RECONNECT_SCHEDULED' })
      })

      it('should transition to connecting on RECONNECT_START', () => {
        const result = machine.send({ type: 'RECONNECT_START' })
        expect(result).toBe(true)
        expect(machine.state).toBe('connecting')
      })

      it('should transition to disconnected on DISCONNECT', () => {
        const result = machine.send({ type: 'DISCONNECT' })
        expect(result).toBe(true)
        expect(machine.state).toBe('disconnected')
      })

      it('should transition to idle on RESET', () => {
        const result = machine.send({ type: 'RESET' })
        expect(result).toBe(true)
        expect(machine.state).toBe('idle')
      })
    })

    describe('from error state', () => {
      beforeEach(() => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'ERROR', error: 'Test error' })
      })

      it('should transition to connecting on CONNECT', () => {
        const result = machine.send({ type: 'CONNECT' })
        expect(result).toBe(true)
        expect(machine.state).toBe('connecting')
      })

      it('should transition to reconnecting on RECONNECT_SCHEDULED', () => {
        const result = machine.send({ type: 'RECONNECT_SCHEDULED' })
        expect(result).toBe(true)
        expect(machine.state).toBe('reconnecting')
      })

      it('should transition to idle on RESET', () => {
        const result = machine.send({ type: 'RESET' })
        expect(result).toBe(true)
        expect(machine.state).toBe('idle')
      })

      it('should transition to disconnected on DISCONNECT', () => {
        const result = machine.send({ type: 'DISCONNECT' })
        expect(result).toBe(true)
        expect(machine.state).toBe('disconnected')
      })
    })
  })

  describe('can() method', () => {
    it('should return true for valid transitions', () => {
      expect(machine.can('CONNECT')).toBe(true)
    })

    it('should return false for invalid transitions', () => {
      expect(machine.can('DISCONNECT')).toBe(false)
      expect(machine.can('CONNECTED')).toBe(false)
    })

    it('should reflect current state', () => {
      machine.send({ type: 'CONNECT' })
      expect(machine.can('CONNECT')).toBe(false)
      expect(machine.can('CONNECTED')).toBe(true)
      expect(machine.can('ERROR')).toBe(true)
    })
  })

  describe('validEvents() method', () => {
    it('should return valid events for idle state', () => {
      const events = machine.validEvents()
      expect(events).toContain('CONNECT')
      expect(events).not.toContain('DISCONNECT')
    })

    it('should return valid events for connecting state', () => {
      machine.send({ type: 'CONNECT' })
      const events = machine.validEvents()
      expect(events).toContain('CONNECTED')
      expect(events).toContain('ERROR')
      expect(events).toContain('DISCONNECT')
    })
  })

  describe('Context Updates', () => {
    it('should update stateChangedAt on transition', () => {
      const initialTime = machine.context.stateChangedAt.getTime()

      // Small delay to ensure time difference
      vi.useFakeTimers()
      vi.advanceTimersByTime(100)

      machine.send({ type: 'CONNECT' })

      expect(machine.context.stateChangedAt.getTime()).toBeGreaterThan(initialTime)
      vi.useRealTimers()
    })

    it('should set error message on ERROR event', () => {
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'ERROR', error: 'Something went wrong' })

      expect(machine.context.error).toBe('Something went wrong')
    })

    it('should clear error on CONNECTED', () => {
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'ERROR', error: 'Temp error' })
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'CONNECTED' })

      expect(machine.context.error).toBeUndefined()
    })

    it('should increment reconnectAttempts on RECONNECT_SCHEDULED', () => {
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'ERROR', error: 'Failed' })

      expect(machine.context.reconnectAttempts).toBe(0)

      machine.send({ type: 'RECONNECT_SCHEDULED' })
      expect(machine.context.reconnectAttempts).toBe(1)

      machine.send({ type: 'DISCONNECT' })
      machine.send({ type: 'RECONNECT_SCHEDULED' })
      expect(machine.context.reconnectAttempts).toBe(2)
    })

    it('should reset reconnectAttempts on CONNECTED', () => {
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'ERROR', error: 'Failed' })
      machine.send({ type: 'RECONNECT_SCHEDULED' })
      machine.send({ type: 'RECONNECT_START' })
      machine.send({ type: 'CONNECTED' })

      expect(machine.context.reconnectAttempts).toBe(0)
    })

    it('should reset on RESET event', () => {
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'ERROR', error: 'Error' })
      machine.send({ type: 'RECONNECT_SCHEDULED' })
      machine.send({ type: 'RESET' })

      expect(machine.context.error).toBeUndefined()
      expect(machine.context.reconnectAttempts).toBe(0)
    })

    it('should set lastConnected timestamp on CONNECTED', () => {
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'CONNECTED' })

      expect(machine.context.lastConnected).toBeInstanceOf(Date)
    })
  })

  describe('State Change Listeners', () => {
    it('should notify listeners on state change', () => {
      const listener = vi.fn()
      machine.onStateChange(listener)

      machine.send({ type: 'CONNECT' })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(
        'connecting',
        expect.objectContaining({ reconnectAttempts: 0 }),
        { type: 'CONNECT' }
      )
    })

    it('should support multiple listeners', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      machine.onStateChange(listener1)
      machine.onStateChange(listener2)

      machine.send({ type: 'CONNECT' })

      expect(listener1).toHaveBeenCalledTimes(1)
      expect(listener2).toHaveBeenCalledTimes(1)
    })

    it('should allow unsubscribing', () => {
      const listener = vi.fn()
      const unsubscribe = machine.onStateChange(listener)

      unsubscribe()
      machine.send({ type: 'CONNECT' })

      expect(listener).not.toHaveBeenCalled()
    })

    it('should handle listener errors gracefully', () => {
      const errorListener = vi.fn(() => {
        throw new Error('Listener error')
      })
      const normalListener = vi.fn()

      machine.onStateChange(errorListener)
      machine.onStateChange(normalListener)

      // Should not throw, and other listeners should still be called
      expect(() => machine.send({ type: 'CONNECT' })).not.toThrow()
      expect(normalListener).toHaveBeenCalled()
    })
  })

  describe('Helper Methods', () => {
    describe('isBusy()', () => {
      it('should return false in idle state', () => {
        expect(machine.isBusy()).toBe(false)
      })

      it('should return true in connecting state', () => {
        machine.send({ type: 'CONNECT' })
        expect(machine.isBusy()).toBe(true)
      })

      it('should return true in disconnecting state', () => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })
        machine.send({ type: 'DISCONNECT' })
        expect(machine.isBusy()).toBe(true)
      })

      it('should return false in connected state', () => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })
        expect(machine.isBusy()).toBe(false)
      })
    })

    describe('isConnected()', () => {
      it('should return false initially', () => {
        expect(machine.isConnected()).toBe(false)
      })

      it('should return true when connected', () => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })
        expect(machine.isConnected()).toBe(true)
      })

      it('should return false after disconnect', () => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })
        machine.send({ type: 'DISCONNECT' })
        machine.send({ type: 'DISCONNECTED' })
        expect(machine.isConnected()).toBe(false)
      })
    })

    describe('isError()', () => {
      it('should return false initially', () => {
        expect(machine.isError()).toBe(false)
      })

      it('should return true in error state', () => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'ERROR', error: 'Failed' })
        expect(machine.isError()).toBe(true)
      })

      it('should return false after recovery', () => {
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'ERROR', error: 'Failed' })
        machine.send({ type: 'CONNECT' })
        machine.send({ type: 'CONNECTED' })
        expect(machine.isError()).toBe(false)
      })
    })

    describe('getStateDuration()', () => {
      it('should return duration since last state change', () => {
        vi.useFakeTimers()

        machine.send({ type: 'CONNECT' })
        vi.advanceTimersByTime(1000)

        const duration = machine.getStateDuration()
        expect(duration).toBeGreaterThanOrEqual(1000)

        vi.useRealTimers()
      })
    })
  })

  describe('forceState()', () => {
    it('should force state without checking transitions', () => {
      machine.forceState('connected')
      expect(machine.state).toBe('connected')
    })

    it('should allow updating context', () => {
      machine.forceState('error', { error: 'Forced error', reconnectAttempts: 5 })
      expect(machine.state).toBe('error')
      expect(machine.context.error).toBe('Forced error')
      expect(machine.context.reconnectAttempts).toBe(5)
    })

    it('should update stateChangedAt', () => {
      vi.useFakeTimers()
      const initialTime = machine.context.stateChangedAt.getTime()
      vi.advanceTimersByTime(100)

      machine.forceState('connected')

      expect(machine.context.stateChangedAt.getTime()).toBeGreaterThan(initialTime)
      vi.useRealTimers()
    })
  })

  describe('Full Connection Lifecycle', () => {
    it('should handle normal connect/disconnect cycle', () => {
      expect(machine.state).toBe('idle')

      machine.send({ type: 'CONNECT' })
      expect(machine.state).toBe('connecting')

      machine.send({ type: 'CONNECTED' })
      expect(machine.state).toBe('connected')
      expect(machine.isConnected()).toBe(true)

      machine.send({ type: 'DISCONNECT' })
      expect(machine.state).toBe('disconnecting')

      machine.send({ type: 'DISCONNECTED' })
      expect(machine.state).toBe('disconnected')
      expect(machine.isConnected()).toBe(false)
    })

    it('should handle error and recovery', () => {
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'ERROR', error: 'Network error' })

      expect(machine.state).toBe('error')
      expect(machine.context.error).toBe('Network error')

      // Retry
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'CONNECTED' })

      expect(machine.state).toBe('connected')
      expect(machine.context.error).toBeUndefined()
    })

    it('should handle reconnection flow', () => {
      // Initial connection
      machine.send({ type: 'CONNECT' })
      machine.send({ type: 'CONNECTED' })

      // Unexpected disconnect (error)
      machine.send({ type: 'ERROR', error: 'Connection lost' })
      expect(machine.state).toBe('error')

      // Schedule reconnect
      machine.send({ type: 'RECONNECT_SCHEDULED' })
      expect(machine.state).toBe('reconnecting')
      expect(machine.context.reconnectAttempts).toBe(1)

      // Start reconnect
      machine.send({ type: 'RECONNECT_START' })
      expect(machine.state).toBe('connecting')

      // Success
      machine.send({ type: 'CONNECTED' })
      expect(machine.state).toBe('connected')
      expect(machine.context.reconnectAttempts).toBe(0)
    })
  })
})
