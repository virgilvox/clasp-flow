import { defineStore } from 'pinia'
import type { Component } from 'vue'

export type NodeCategory =
  | 'debug'
  | 'inputs'
  | 'outputs'
  | 'math'
  | 'logic'
  | 'audio'
  | 'video'
  | 'shaders'
  | 'data'
  | 'ai'
  | 'code'
  | '3d'
  | 'connectivity'
  | 'custom'

export type DataType =
  | 'trigger'
  | 'number'
  | 'string'
  | 'boolean'
  | 'audio'
  | 'video'
  | 'texture'
  | 'data'
  | 'array'
  | 'any'

export type Platform = 'web' | 'electron'

export interface PortDefinition {
  id: string
  type: DataType
  label: string
  description?: string
  required?: boolean
  multiple?: boolean
  default?: unknown
}

export interface ControlDefinition {
  id: string
  type: string
  label: string
  description?: string
  default?: unknown
  exposable?: boolean
  bindable?: boolean
  props?: Record<string, unknown>
}

export interface NodeDefinition {
  id: string
  name: string
  version: string
  category: NodeCategory
  description: string
  icon: string
  color?: string
  platforms: Platform[]
  webFallback?: string
  inputs: PortDefinition[]
  outputs: PortDefinition[]
  controls: ControlDefinition[]
  tags?: string[]
}

interface NodesStoreState {
  definitions: Map<string, NodeDefinition>
  components: Map<string, Component>
  searchQuery: string
  categoryFilter: NodeCategory | null
}

export const useNodesStore = defineStore('nodes', {
  state: (): NodesStoreState => ({
    definitions: new Map(),
    components: new Map(),
    searchQuery: '',
    categoryFilter: null,
  }),

  getters: {
    allDefinitions: (state): NodeDefinition[] => {
      return Array.from(state.definitions.values())
    },

    filteredDefinitions(): NodeDefinition[] {
      let results = this.allDefinitions

      // Filter by category
      if (this.categoryFilter) {
        results = results.filter((d) => d.category === this.categoryFilter)
      }

      // Filter by search
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        results = results.filter(
          (d) =>
            d.name.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query) ||
            d.tags?.some((t) => t.toLowerCase().includes(query))
        )
      }

      return results
    },

    byCategory(): Map<NodeCategory, NodeDefinition[]> {
      const map = new Map<NodeCategory, NodeDefinition[]>()
      for (const def of this.allDefinitions) {
        const list = map.get(def.category) ?? []
        list.push(def)
        map.set(def.category, list)
      }
      return map
    },

    categories(): NodeCategory[] {
      return Array.from(this.byCategory.keys()).sort()
    },

    getDefinition: (state) => (id: string): NodeDefinition | undefined => {
      return state.definitions.get(id)
    },

    getComponent: (state) => (id: string): Component | undefined => {
      return state.components.get(id)
    },

    isAvailable: (state) => (id: string, platform: Platform): boolean => {
      const def = state.definitions.get(id)
      if (!def) return false
      return def.platforms.includes(platform)
    },
  },

  actions: {
    register(definition: NodeDefinition, component?: Component) {
      this.definitions.set(definition.id, definition)
      if (component) {
        this.components.set(definition.id, component)
      }
    },

    unregister(id: string) {
      this.definitions.delete(id)
      this.components.delete(id)
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setCategoryFilter(category: NodeCategory | null) {
      this.categoryFilter = category
    },

    clearFilters() {
      this.searchQuery = ''
      this.categoryFilter = null
    },
  },
})

// Category metadata for UI
export const categoryMeta: Record<NodeCategory, { label: string; icon: string; color: string }> = {
  debug: { label: 'Debug', icon: 'bug', color: '#8B5CF6' },
  inputs: { label: 'Inputs', icon: 'download', color: '#22C55E' },
  outputs: { label: 'Outputs', icon: 'upload', color: '#3B82F6' },
  math: { label: 'Math', icon: 'calculator', color: '#F59E0B' },
  logic: { label: 'Logic', icon: 'git-branch', color: '#EF4444' },
  audio: { label: 'Audio', icon: 'music', color: '#22C55E' },
  video: { label: 'Video', icon: 'video', color: '#3B82F6' },
  shaders: { label: 'Shaders', icon: 'code', color: '#EC4899' },
  data: { label: 'Data', icon: 'database', color: '#6B7280' },
  ai: { label: 'AI', icon: 'brain', color: '#8B5CF6' },
  code: { label: 'Code', icon: 'terminal', color: '#F59E0B' },
  '3d': { label: '3D', icon: 'box', color: '#0EA5E9' },
  connectivity: { label: 'Connectivity', icon: 'plug', color: '#2AAB8A' },
  custom: { label: 'Custom', icon: 'puzzle', color: '#6B7280' },
}

// Data type metadata
export const dataTypeMeta: Record<DataType, { label: string; color: string; lineStyle: string }> = {
  trigger: { label: 'Trigger', color: '#F59E0B', lineStyle: 'solid' },
  number: { label: 'Number', color: '#2AAB8A', lineStyle: 'solid' },
  string: { label: 'String', color: '#8B5CF6', lineStyle: 'solid' },
  boolean: { label: 'Boolean', color: '#EF4444', lineStyle: 'dotted' },
  audio: { label: 'Audio', color: '#22C55E', lineStyle: 'solid' },
  video: { label: 'Video', color: '#3B82F6', lineStyle: 'solid' },
  texture: { label: 'Texture', color: '#EC4899', lineStyle: 'dashed' },
  data: { label: 'Data', color: '#6B7280', lineStyle: 'solid' },
  array: { label: 'Array', color: '#0EA5E9', lineStyle: 'solid' },
  any: { label: 'Any', color: '#D4D4D4', lineStyle: 'dotted' },
}
