import { computed } from 'vue'
import { useFlowsStore } from '@/stores/flows'
import { useHistoryStore, createSnapshot, type FlowSnapshot } from '@/stores/history'

/**
 * Composable for managing flow undo/redo history
 */
export function useFlowHistory() {
  const flowsStore = useFlowsStore()
  const historyStore = useHistoryStore()

  // Computed properties for current flow
  const canUndo = computed(() => {
    const flowId = flowsStore.activeFlowId
    return flowId ? historyStore.canUndo(flowId) : false
  })

  const canRedo = computed(() => {
    const flowId = flowsStore.activeFlowId
    return flowId ? historyStore.canRedo(flowId) : false
  })

  const undoDescription = computed(() => {
    const flowId = flowsStore.activeFlowId
    return flowId ? historyStore.lastUndoDescription(flowId) : null
  })

  const redoDescription = computed(() => {
    const flowId = flowsStore.activeFlowId
    return flowId ? historyStore.lastRedoDescription(flowId) : null
  })

  /**
   * Take a snapshot before an action
   */
  function beforeAction(): FlowSnapshot | null {
    if (!flowsStore.activeFlow) return null
    return createSnapshot(flowsStore.activeFlow.nodes, flowsStore.activeFlow.edges)
  }

  /**
   * Record the action after it completes
   */
  function afterAction(before: FlowSnapshot | null, description: string) {
    if (!before || !flowsStore.activeFlow || !flowsStore.activeFlowId) return

    const after = createSnapshot(flowsStore.activeFlow.nodes, flowsStore.activeFlow.edges)

    // Only record if something actually changed
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      historyStore.recordChange(flowsStore.activeFlowId, before, after, description)
    }
  }

  /**
   * Wrap an action with history recording
   */
  function withHistory<T>(description: string, action: () => T): T {
    const before = beforeAction()
    const result = action()
    afterAction(before, description)
    return result
  }

  /**
   * Undo the last action
   */
  function undo() {
    if (!flowsStore.activeFlow || !flowsStore.activeFlowId) return false

    const snapshot = historyStore.undo(flowsStore.activeFlowId)
    if (!snapshot) return false

    // Apply the snapshot
    historyStore.setUndoingOrRedoing(true)
    try {
      flowsStore.activeFlow.nodes = JSON.parse(JSON.stringify(snapshot.nodes))
      flowsStore.activeFlow.edges = JSON.parse(JSON.stringify(snapshot.edges))
    } finally {
      historyStore.setUndoingOrRedoing(false)
    }

    return true
  }

  /**
   * Redo the last undone action
   */
  function redo() {
    if (!flowsStore.activeFlow || !flowsStore.activeFlowId) return false

    const snapshot = historyStore.redo(flowsStore.activeFlowId)
    if (!snapshot) return false

    // Apply the snapshot
    historyStore.setUndoingOrRedoing(true)
    try {
      flowsStore.activeFlow.nodes = JSON.parse(JSON.stringify(snapshot.nodes))
      flowsStore.activeFlow.edges = JSON.parse(JSON.stringify(snapshot.edges))
    } finally {
      historyStore.setUndoingOrRedoing(false)
    }

    return true
  }

  /**
   * Start tracking changes (call before a batch of changes)
   */
  function startBatch(): FlowSnapshot | null {
    return beforeAction()
  }

  /**
   * End tracking changes (call after a batch of changes)
   */
  function endBatch(before: FlowSnapshot | null, description: string) {
    afterAction(before, description)
  }

  return {
    canUndo,
    canRedo,
    undoDescription,
    redoDescription,
    beforeAction,
    afterAction,
    withHistory,
    undo,
    redo,
    startBatch,
    endBatch,
  }
}
