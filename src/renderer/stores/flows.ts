import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type { Node, Edge, XYPosition } from '@vue-flow/core'

export interface FlowState {
  id: string
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
  createdAt: Date
  updatedAt: Date
  dirty: boolean
}

interface FlowsStoreState {
  flows: FlowState[]
  activeFlowId: string | null
}

export const useFlowsStore = defineStore('flows', {
  state: (): FlowsStoreState => ({
    flows: [],
    activeFlowId: null,
  }),

  getters: {
    activeFlow: (state): FlowState | null => {
      return state.flows.find((f) => f.id === state.activeFlowId) ?? null
    },

    activeNodes(): Node[] {
      return this.activeFlow?.nodes ?? []
    },

    activeEdges(): Edge[] {
      return this.activeFlow?.edges ?? []
    },

    flowList: (state): FlowState[] => {
      return state.flows
    },

    hasUnsavedChanges(): boolean {
      return this.activeFlow?.dirty ?? false
    },

    getFlowById: (state) => (id: string): FlowState | undefined => {
      return state.flows.find((f) => f.id === id)
    },
  },

  actions: {
    createFlow(name: string = 'Untitled Flow'): FlowState {
      const now = new Date()
      const flow: FlowState = {
        id: nanoid(),
        name,
        description: '',
        nodes: [],
        edges: [],
        createdAt: now,
        updatedAt: now,
        dirty: false,
      }
      this.flows.push(flow)
      this.activeFlowId = flow.id
      return flow
    },

    deleteFlow(flowId: string) {
      const index = this.flows.findIndex((f) => f.id === flowId)
      if (index !== -1) {
        this.flows.splice(index, 1)
        if (this.activeFlowId === flowId) {
          this.activeFlowId = this.flows[0]?.id ?? null
        }
      }
    },

    setActiveFlow(flowId: string) {
      if (this.flows.some((f) => f.id === flowId)) {
        this.activeFlowId = flowId
      }
    },

    renameFlow(flowId: string, name: string) {
      const flow = this.flows.find((f) => f.id === flowId)
      if (flow) {
        flow.name = name
        flow.updatedAt = new Date()
        flow.dirty = true
      }
    },

    duplicateFlow(flowId: string): FlowState | null {
      const source = this.flows.find((f) => f.id === flowId)
      if (!source) return null

      const now = new Date()
      const flow: FlowState = {
        id: nanoid(),
        name: `${source.name} (Copy)`,
        description: source.description,
        nodes: JSON.parse(JSON.stringify(source.nodes)),
        edges: JSON.parse(JSON.stringify(source.edges)),
        createdAt: now,
        updatedAt: now,
        dirty: false,
      }
      this.flows.push(flow)
      return flow
    },

    // Node operations
    addNode(
      nodeType: string,
      position: XYPosition,
      data: Record<string, unknown> = {}
    ): Node | null {
      if (!this.activeFlow) return null

      const node: Node = {
        id: nanoid(),
        type: nodeType,
        position,
        data: {
          ...data,
          nodeType,
        },
      }

      this.activeFlow.nodes.push(node)
      this.activeFlow.updatedAt = new Date()
      this.activeFlow.dirty = true
      return node
    },

    removeNode(nodeId: string) {
      if (!this.activeFlow) return

      // Remove the node
      this.activeFlow.nodes = this.activeFlow.nodes.filter((n) => n.id !== nodeId)

      // Remove connected edges
      this.activeFlow.edges = this.activeFlow.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      )

      this.activeFlow.updatedAt = new Date()
      this.activeFlow.dirty = true
    },

    removeNodes(nodeIds: string[]) {
      if (!this.activeFlow) return

      const idsSet = new Set(nodeIds)
      this.activeFlow.nodes = this.activeFlow.nodes.filter((n) => !idsSet.has(n.id))
      this.activeFlow.edges = this.activeFlow.edges.filter(
        (e) => !idsSet.has(e.source) && !idsSet.has(e.target)
      )

      this.activeFlow.updatedAt = new Date()
      this.activeFlow.dirty = true
    },

    updateNodePosition(nodeId: string, position: XYPosition) {
      if (!this.activeFlow) return

      const node = this.activeFlow.nodes.find((n) => n.id === nodeId)
      if (node) {
        node.position = position
        // Don't mark dirty for position changes (too frequent)
      }
    },

    updateNodeData(nodeId: string, data: Record<string, unknown>) {
      if (!this.activeFlow) return

      const node = this.activeFlow.nodes.find((n) => n.id === nodeId)
      if (node) {
        node.data = { ...node.data, ...data }
        this.activeFlow.updatedAt = new Date()
        this.activeFlow.dirty = true
      }
    },

    // Edge operations
    addEdge(
      sourceNode: string,
      sourceHandle: string,
      targetNode: string,
      targetHandle: string
    ): Edge | null {
      if (!this.activeFlow) return null

      // Check if connection already exists
      const exists = this.activeFlow.edges.some(
        (e) =>
          e.source === sourceNode &&
          e.sourceHandle === sourceHandle &&
          e.target === targetNode &&
          e.targetHandle === targetHandle
      )

      if (exists) return null

      const edge: Edge = {
        id: nanoid(),
        source: sourceNode,
        sourceHandle,
        target: targetNode,
        targetHandle,
      }

      this.activeFlow.edges.push(edge)
      this.activeFlow.updatedAt = new Date()
      this.activeFlow.dirty = true
      return edge
    },

    removeEdge(edgeId: string) {
      if (!this.activeFlow) return

      this.activeFlow.edges = this.activeFlow.edges.filter((e) => e.id !== edgeId)
      this.activeFlow.updatedAt = new Date()
      this.activeFlow.dirty = true
    },

    // Sync with Vue Flow
    setNodes(nodes: Node[]) {
      if (!this.activeFlow) return
      this.activeFlow.nodes = nodes
    },

    setEdges(edges: Edge[]) {
      if (!this.activeFlow) return
      this.activeFlow.edges = edges
    },

    // Save state
    markSaved() {
      if (this.activeFlow) {
        this.activeFlow.dirty = false
      }
    },

    // Serialization
    exportFlow(flowId?: string): string {
      const flow = flowId ? this.flows.find((f) => f.id === flowId) : this.activeFlow
      if (!flow) return '{}'

      return JSON.stringify({
        version: '1.0',
        name: flow.name,
        description: flow.description,
        nodes: flow.nodes,
        edges: flow.edges,
        exportedAt: new Date().toISOString(),
      }, null, 2)
    },

    importFlow(json: string): FlowState | null {
      try {
        const data = JSON.parse(json)
        const now = new Date()

        const flow: FlowState = {
          id: nanoid(),
          name: data.name ?? 'Imported Flow',
          description: data.description ?? '',
          nodes: data.nodes ?? [],
          edges: data.edges ?? [],
          createdAt: now,
          updatedAt: now,
          dirty: false,
        }

        this.flows.push(flow)
        this.activeFlowId = flow.id
        return flow
      } catch (e) {
        console.error('Failed to import flow:', e)
        return null
      }
    },
  },
})
