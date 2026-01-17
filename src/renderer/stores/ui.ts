import { defineStore } from 'pinia'

export type SidebarPanel = 'nodes' | 'properties' | 'controls'
export type Theme = 'light' | 'dark' | 'system'

interface UIState {
  sidebarOpen: boolean
  sidebarPanel: SidebarPanel
  sidebarWidth: number
  zoom: number
  pan: { x: number; y: number }
  selectedNodes: string[]
  hoveredNode: string | null
  inspectedNode: string | null
  theme: Theme
  showMinimap: boolean
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    sidebarOpen: true,
    sidebarPanel: 'nodes',
    sidebarWidth: 280,
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedNodes: [],
    hoveredNode: null,
    inspectedNode: null,
    theme: 'light',
    showMinimap: true,
    showGrid: true,
    snapToGrid: true,
    gridSize: 20,
  }),

  getters: {
    hasSelection: (state) => state.selectedNodes.length > 0,
    selectionCount: (state) => state.selectedNodes.length,
    effectiveTheme: (state): 'light' | 'dark' => {
      if (state.theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return state.theme
    },
  },

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    setSidebarPanel(panel: SidebarPanel) {
      this.sidebarPanel = panel
      if (!this.sidebarOpen) {
        this.sidebarOpen = true
      }
    },

    setSidebarWidth(width: number) {
      this.sidebarWidth = Math.max(200, Math.min(500, width))
    },

    setZoom(zoom: number) {
      this.zoom = Math.max(0.1, Math.min(4, zoom))
    },

    zoomIn() {
      this.setZoom(this.zoom * 1.2)
    },

    zoomOut() {
      this.setZoom(this.zoom / 1.2)
    },

    resetZoom() {
      this.zoom = 1
    },

    setPan(pan: { x: number; y: number }) {
      this.pan = pan
    },

    selectNodes(nodeIds: string[]) {
      this.selectedNodes = nodeIds
    },

    addToSelection(nodeId: string) {
      if (!this.selectedNodes.includes(nodeId)) {
        this.selectedNodes.push(nodeId)
      }
    },

    removeFromSelection(nodeId: string) {
      this.selectedNodes = this.selectedNodes.filter((id) => id !== nodeId)
    },

    toggleNodeSelection(nodeId: string) {
      if (this.selectedNodes.includes(nodeId)) {
        this.removeFromSelection(nodeId)
      } else {
        this.addToSelection(nodeId)
      }
    },

    clearSelection() {
      this.selectedNodes = []
    },

    setHoveredNode(nodeId: string | null) {
      this.hoveredNode = nodeId
    },

    setInspectedNode(nodeId: string | null) {
      this.inspectedNode = nodeId
    },

    setTheme(theme: Theme) {
      this.theme = theme
      document.documentElement.setAttribute('data-theme', this.effectiveTheme)
    },

    toggleMinimap() {
      this.showMinimap = !this.showMinimap
    },

    toggleGrid() {
      this.showGrid = !this.showGrid
    },

    toggleSnapToGrid() {
      this.snapToGrid = !this.snapToGrid
    },

    setGridSize(size: number) {
      this.gridSize = Math.max(10, Math.min(100, size))
    },
  },
})
