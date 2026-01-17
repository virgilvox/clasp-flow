import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'editor',
    component: () => import('../views/EditorView.vue'),
  },
  {
    path: '/controls',
    name: 'controls',
    component: () => import('../views/ControlPanelView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
  },
]

// Use hash history for Electron, web history for browser
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined

const router = createRouter({
  history: isElectron ? createWebHashHistory() : createWebHistory(),
  routes,
})

export default router
