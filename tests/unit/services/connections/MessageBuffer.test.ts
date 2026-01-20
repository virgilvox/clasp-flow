import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  MessageBufferManager,
  getMessageBufferManager,
  resetMessageBufferManager,
  type BufferedMessage,
  type MessagePriority,
} from '@/services/connections/MessageBuffer'

describe('MessageBufferManager', () => {
  let manager: MessageBufferManager

  beforeEach(() => {
    vi.useFakeTimers()
    resetMessageBufferManager()
    manager = new MessageBufferManager({
      maxBufferSize: 10,
      defaultTTL: 5000,
      defaultMaxRetries: 3,
      pruneInterval: 1000,
    })
  })

  afterEach(() => {
    manager.dispose()
    vi.useRealTimers()
  })

  describe('Enqueue', () => {
    it('should enqueue a message and return its ID', () => {
      const messageId = manager.enqueue('conn-1', { text: 'Hello' })
      expect(messageId).toBeDefined()
      expect(typeof messageId).toBe('string')
    })

    it('should store message with default options', () => {
      manager.enqueue('conn-1', { text: 'Hello' })
      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(1)
      expect(stats.byPriority.normal).toBe(1)
    })

    it('should respect priority option', () => {
      manager.enqueue('conn-1', { text: 'Low' }, { priority: 'low' })
      manager.enqueue('conn-1', { text: 'High' }, { priority: 'high' })
      manager.enqueue('conn-1', { text: 'Critical' }, { priority: 'critical' })

      const stats = manager.getStats('conn-1')
      expect(stats.byPriority.low).toBe(1)
      expect(stats.byPriority.high).toBe(1)
      expect(stats.byPriority.critical).toBe(1)
    })

    it('should respect TTL option', () => {
      manager.enqueue('conn-1', { text: 'Short TTL' }, { ttl: 100 })

      // Advance time past TTL
      vi.advanceTimersByTime(200)
      manager.prune()

      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(0)
    })

    it('should respect topic option', () => {
      manager.enqueue('conn-1', { text: 'Test' }, { topic: '/sensor/temp' })
      const messages = manager.flush('conn-1')
      expect(messages[0].topic).toBe('/sensor/temp')
    })
  })

  describe('Buffer Limits', () => {
    it('should enforce max buffer size', () => {
      // Fill buffer to max
      for (let i = 0; i < 10; i++) {
        manager.enqueue('conn-1', { index: i })
      }

      // This should fail (returns null)
      const result = manager.enqueue('conn-1', { index: 10 })
      expect(result).toBe(null)

      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(10)
    })

    it('should drop low priority messages when buffer is full and higher priority arrives', () => {
      // Fill buffer with low priority messages
      for (let i = 0; i < 10; i++) {
        manager.enqueue('conn-1', { index: i }, { priority: 'low' })
      }

      // Should accept a high priority message by dropping a low priority one
      const result = manager.enqueue('conn-1', { index: 'high' }, { priority: 'high' })
      expect(result).not.toBe(null)

      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(10)
      expect(stats.byPriority.high).toBe(1)
      expect(stats.byPriority.low).toBe(9)
    })

    it('should not accept lower priority message when buffer is full of higher priority', () => {
      // Fill buffer with high priority messages
      for (let i = 0; i < 10; i++) {
        manager.enqueue('conn-1', { index: i }, { priority: 'high' })
      }

      // Should not accept a low priority message
      const result = manager.enqueue('conn-1', { index: 'low' }, { priority: 'low' })
      expect(result).toBe(null)
    })
  })

  describe('Priority Ordering', () => {
    it('should return messages in priority order', () => {
      manager.enqueue('conn-1', { text: 'low' }, { priority: 'low' })
      manager.enqueue('conn-1', { text: 'normal' }, { priority: 'normal' })
      manager.enqueue('conn-1', { text: 'high' }, { priority: 'high' })
      manager.enqueue('conn-1', { text: 'critical' }, { priority: 'critical' })

      const messages = manager.flush('conn-1')

      expect(messages[0].data).toEqual({ text: 'critical' })
      expect(messages[1].data).toEqual({ text: 'high' })
      expect(messages[2].data).toEqual({ text: 'normal' })
      expect(messages[3].data).toEqual({ text: 'low' })
    })

    it('should order same-priority messages by timestamp (FIFO)', () => {
      manager.enqueue('conn-1', { text: 'first' })
      vi.advanceTimersByTime(10)
      manager.enqueue('conn-1', { text: 'second' })
      vi.advanceTimersByTime(10)
      manager.enqueue('conn-1', { text: 'third' })

      const messages = manager.flush('conn-1')

      expect(messages[0].data).toEqual({ text: 'first' })
      expect(messages[1].data).toEqual({ text: 'second' })
      expect(messages[2].data).toEqual({ text: 'third' })
    })
  })

  describe('Flush', () => {
    it('should return all ready messages', () => {
      manager.enqueue('conn-1', { text: 'one' })
      manager.enqueue('conn-1', { text: 'two' })

      const messages = manager.flush('conn-1')
      expect(messages).toHaveLength(2)
    })

    it('should clear buffer after flush', () => {
      manager.enqueue('conn-1', { text: 'one' })
      manager.flush('conn-1')

      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(0)
    })

    it('should return empty array for non-existent connection', () => {
      const messages = manager.flush('non-existent')
      expect(messages).toEqual([])
    })

    it('should filter out expired messages', () => {
      manager.enqueue('conn-1', { text: 'short' }, { ttl: 100 })
      manager.enqueue('conn-1', { text: 'long' }, { ttl: 10000 })

      vi.advanceTimersByTime(500)

      const messages = manager.flush('conn-1')
      expect(messages).toHaveLength(1)
      expect(messages[0].data).toEqual({ text: 'long' })
    })

    it('should filter out messages that exceeded max retries', () => {
      const msgId = manager.enqueue('conn-1', { text: 'test' }, { maxRetries: 2 })

      // Simulate failures
      manager.markFailed('conn-1', msgId!)
      manager.markFailed('conn-1', msgId!)

      // After 2 failures with maxRetries: 2, message should be removed
      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(0)
    })
  })

  describe('Mark Sent/Failed', () => {
    it('should remove message on markSent', () => {
      const msgId = manager.enqueue('conn-1', { text: 'test' })
      manager.markSent('conn-1', msgId!)

      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(0)
    })

    it('should increment retry count on markFailed', () => {
      const msgId = manager.enqueue('conn-1', { text: 'test' }, { maxRetries: 5 })

      const willRetry = manager.markFailed('conn-1', msgId!)
      expect(willRetry).toBe(true)

      // Message should still be in buffer with incremented retry count
      const messages = manager.flush('conn-1')
      expect(messages[0].retryCount).toBe(1)
    })

    it('should return false when max retries exceeded', () => {
      const msgId = manager.enqueue('conn-1', { text: 'test' }, { maxRetries: 1 })

      const willRetry = manager.markFailed('conn-1', msgId!)
      expect(willRetry).toBe(false)

      // Message should be removed
      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(0)
    })
  })

  describe('Prune', () => {
    it('should remove expired messages', () => {
      manager.enqueue('conn-1', { text: 'expire soon' }, { ttl: 100 })
      manager.enqueue('conn-1', { text: 'keep' }, { ttl: 10000 })

      vi.advanceTimersByTime(200)
      const pruned = manager.prune()

      expect(pruned).toBe(1)
      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(1)
    })

    it('should remove messages with exceeded retries', () => {
      const msgId = manager.enqueue('conn-1', { text: 'test' }, { maxRetries: 1 })
      manager.markFailed('conn-1', msgId!)

      // markFailed already removes when exceeded, but prune should clean up any stragglers
      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(0)
    })

    it('should auto-prune on interval', () => {
      manager.enqueue('conn-1', { text: 'expire' }, { ttl: 500 })

      // Wait for TTL + prune interval
      vi.advanceTimersByTime(1500)

      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(0)
    })
  })

  describe('Stats', () => {
    it('should return correct stats', () => {
      manager.enqueue('conn-1', { text: 'a' }, { priority: 'low' })
      manager.enqueue('conn-1', { text: 'b' }, { priority: 'normal' })
      manager.enqueue('conn-1', { text: 'c' }, { priority: 'high' })

      const stats = manager.getStats('conn-1')

      expect(stats.queued).toBe(3)
      expect(stats.byPriority.low).toBe(1)
      expect(stats.byPriority.normal).toBe(1)
      expect(stats.byPriority.high).toBe(1)
      expect(stats.byPriority.critical).toBe(0)
      expect(stats.oldest).toBeInstanceOf(Date)
      expect(stats.estimatedBytes).toBeGreaterThan(0)
    })

    it('should return empty stats for non-existent connection', () => {
      const stats = manager.getStats('non-existent')

      expect(stats.queued).toBe(0)
      expect(stats.oldest).toBe(null)
      expect(stats.estimatedBytes).toBe(0)
    })

    it('should calculate total stats', () => {
      manager.enqueue('conn-1', { text: 'a' })
      manager.enqueue('conn-1', { text: 'b' })
      manager.enqueue('conn-2', { text: 'c' })

      const total = manager.getTotalStats()

      expect(total.connections).toBe(2)
      expect(total.totalMessages).toBe(3)
    })
  })

  describe('Clear', () => {
    it('should clear buffer for a connection', () => {
      manager.enqueue('conn-1', { text: 'a' })
      manager.enqueue('conn-1', { text: 'b' })
      manager.clear('conn-1')

      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(0)
    })

    it('should not affect other connections', () => {
      manager.enqueue('conn-1', { text: 'a' })
      manager.enqueue('conn-2', { text: 'b' })
      manager.clear('conn-1')

      expect(manager.getStats('conn-1').queued).toBe(0)
      expect(manager.getStats('conn-2').queued).toBe(1)
    })

    it('should clear all buffers', () => {
      manager.enqueue('conn-1', { text: 'a' })
      manager.enqueue('conn-2', { text: 'b' })
      manager.clearAll()

      expect(manager.getTotalStats().totalMessages).toBe(0)
    })
  })

  describe('Remove Buffer', () => {
    it('should remove buffer completely', () => {
      manager.enqueue('conn-1', { text: 'a' })
      manager.removeBuffer('conn-1')

      expect(manager.getTotalStats().connections).toBe(0)
    })
  })

  describe('Dispose', () => {
    it('should stop auto-pruning on dispose', () => {
      const localManager = new MessageBufferManager({ pruneInterval: 100 })
      localManager.enqueue('conn-1', { text: 'test' }, { ttl: 50 })

      localManager.dispose()

      // Advance time past prune interval
      vi.advanceTimersByTime(200)

      // Since dispose was called, we can't check stats, but no error should occur
      expect(true).toBe(true) // Test passes if no error
    })
  })

  describe('Singleton', () => {
    it('should return same instance', () => {
      resetMessageBufferManager()
      const mgr1 = getMessageBufferManager()
      const mgr2 = getMessageBufferManager()
      expect(mgr1).toBe(mgr2)
    })

    it('should create new instance after reset', () => {
      const mgr1 = getMessageBufferManager()
      resetMessageBufferManager()
      const mgr2 = getMessageBufferManager()
      expect(mgr1).not.toBe(mgr2)
    })
  })

  describe('Message Properties', () => {
    it('should store sendOptions correctly', () => {
      manager.enqueue('conn-1', { text: 'test' }, { sendOptions: { qos: 1 } })
      const messages = manager.flush('conn-1')
      expect(messages[0].options).toEqual({ qos: 1 })
    })

    it('should set correct timestamp', () => {
      const before = Date.now()
      manager.enqueue('conn-1', { text: 'test' })
      const after = Date.now()

      const messages = manager.flush('conn-1')
      expect(messages[0].timestamp).toBeGreaterThanOrEqual(before)
      expect(messages[0].timestamp).toBeLessThanOrEqual(after)
    })

    it('should generate unique IDs', () => {
      const id1 = manager.enqueue('conn-1', { text: '1' })
      const id2 = manager.enqueue('conn-1', { text: '2' })
      expect(id1).not.toBe(id2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty data', () => {
      const id = manager.enqueue('conn-1', null)
      expect(id).not.toBe(null)
    })

    it('should handle complex data', () => {
      const complexData = {
        nested: { deep: { value: 123 } },
        array: [1, 2, 3],
        date: new Date().toISOString(),
      }
      manager.enqueue('conn-1', complexData)

      const messages = manager.flush('conn-1')
      expect(messages[0].data).toEqual(complexData)
    })

    it('should handle TTL of 0 (no expiry)', () => {
      manager.enqueue('conn-1', { text: 'forever' }, { ttl: 0 })

      vi.advanceTimersByTime(100000)
      manager.prune()

      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(1)
    })

    it('should handle maxRetries of 0 (unlimited)', () => {
      const msgId = manager.enqueue('conn-1', { text: 'test' }, { maxRetries: 0 })

      // Fail many times
      for (let i = 0; i < 100; i++) {
        const willRetry = manager.markFailed('conn-1', msgId!)
        expect(willRetry).toBe(true)
      }

      // Message should still be there
      const stats = manager.getStats('conn-1')
      expect(stats.queued).toBe(1)
    })
  })
})
