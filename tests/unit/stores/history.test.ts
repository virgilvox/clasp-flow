import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHistoryStore, createSnapshot } from '@/stores/history'

describe('history store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('createSnapshot', () => {
    it('creates a deep copy of nodes and edges', () => {
      const nodes = [{ id: '1', position: { x: 0, y: 0 }, data: { label: 'Test' } }]
      const edges = [{ id: 'e1', source: '1', target: '2' }]

      const snapshot = createSnapshot(nodes as any, edges as any)

      expect(snapshot.nodes).toEqual(nodes)
      expect(snapshot.edges).toEqual(edges)
      expect(snapshot.nodes).not.toBe(nodes)
      expect(snapshot.edges).not.toBe(edges)
      expect(snapshot.timestamp).toBeGreaterThan(0)
    })
  })

  describe('recordChange', () => {
    it('records a change to the undo stack', () => {
      const store = useHistoryStore()
      const flowId = 'flow1'

      const before = createSnapshot([], [])
      const after = createSnapshot([{ id: '1' }] as any, [])

      store.recordChange(flowId, before, after, 'Add node')

      expect(store.canUndo(flowId)).toBe(true)
      expect(store.undoStackSize(flowId)).toBe(1)
      expect(store.lastUndoDescription(flowId)).toBe('Add node')
    })

    it('clears redo stack on new change', () => {
      const store = useHistoryStore()
      const flowId = 'flow1'

      // Record initial change
      const before1 = createSnapshot([], [])
      const after1 = createSnapshot([{ id: '1' }] as any, [])
      store.recordChange(flowId, before1, after1, 'Add node 1')

      // Undo to populate redo stack
      store.undo(flowId)
      expect(store.canRedo(flowId)).toBe(true)

      // Record new change
      const before2 = createSnapshot([], [])
      const after2 = createSnapshot([{ id: '2' }] as any, [])
      store.recordChange(flowId, before2, after2, 'Add node 2')

      // Redo stack should be cleared
      expect(store.canRedo(flowId)).toBe(false)
    })

    it('respects max history size', () => {
      const store = useHistoryStore()
      store.maxHistorySize = 3
      const flowId = 'flow1'

      // Add 5 changes
      for (let i = 0; i < 5; i++) {
        const before = createSnapshot([{ id: String(i) }] as any, [])
        const after = createSnapshot([{ id: String(i + 1) }] as any, [])
        store.recordChange(flowId, before, after, `Change ${i}`)
      }

      expect(store.undoStackSize(flowId)).toBe(3)
    })

    it('does not record when isUndoingOrRedoing is true', () => {
      const store = useHistoryStore()
      const flowId = 'flow1'

      store.setUndoingOrRedoing(true)

      const before = createSnapshot([], [])
      const after = createSnapshot([{ id: '1' }] as any, [])
      store.recordChange(flowId, before, after, 'Add node')

      expect(store.canUndo(flowId)).toBe(false)
    })
  })

  describe('undo', () => {
    it('returns the before snapshot', () => {
      const store = useHistoryStore()
      const flowId = 'flow1'

      const before = createSnapshot([], [])
      const after = createSnapshot([{ id: '1' }] as any, [])
      store.recordChange(flowId, before, after, 'Add node')

      const result = store.undo(flowId)

      expect(result).toEqual(before)
    })

    it('moves entry to redo stack', () => {
      const store = useHistoryStore()
      const flowId = 'flow1'

      const before = createSnapshot([], [])
      const after = createSnapshot([{ id: '1' }] as any, [])
      store.recordChange(flowId, before, after, 'Add node')

      store.undo(flowId)

      expect(store.canUndo(flowId)).toBe(false)
      expect(store.canRedo(flowId)).toBe(true)
    })

    it('returns null when stack is empty', () => {
      const store = useHistoryStore()
      const result = store.undo('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('redo', () => {
    it('returns the after snapshot', () => {
      const store = useHistoryStore()
      const flowId = 'flow1'

      const before = createSnapshot([], [])
      const after = createSnapshot([{ id: '1' }] as any, [])
      store.recordChange(flowId, before, after, 'Add node')
      store.undo(flowId)

      const result = store.redo(flowId)

      expect(result).toEqual(after)
    })

    it('moves entry back to undo stack', () => {
      const store = useHistoryStore()
      const flowId = 'flow1'

      const before = createSnapshot([], [])
      const after = createSnapshot([{ id: '1' }] as any, [])
      store.recordChange(flowId, before, after, 'Add node')
      store.undo(flowId)
      store.redo(flowId)

      expect(store.canUndo(flowId)).toBe(true)
      expect(store.canRedo(flowId)).toBe(false)
    })

    it('returns null when stack is empty', () => {
      const store = useHistoryStore()
      const result = store.redo('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('clearHistory', () => {
    it('clears history for a specific flow', () => {
      const store = useHistoryStore()
      const flowId1 = 'flow1'
      const flowId2 = 'flow2'

      const before = createSnapshot([], [])
      const after = createSnapshot([{ id: '1' }] as any, [])

      store.recordChange(flowId1, before, after, 'Change 1')
      store.recordChange(flowId2, before, after, 'Change 2')

      store.clearHistory(flowId1)

      expect(store.canUndo(flowId1)).toBe(false)
      expect(store.canUndo(flowId2)).toBe(true)
    })
  })
})
