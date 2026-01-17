import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  isElectron: true,
  platform: process.platform,
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  getPath: (name: string) => ipcRenderer.invoke('app:getPath', name),

  // File dialogs
  openFile: (options?: { filters?: { name: string; extensions: string[] }[] }) =>
    ipcRenderer.invoke('dialog:openFile', options),
  saveFile: (options?: { filters?: { name: string; extensions: string[] }[] }) =>
    ipcRenderer.invoke('dialog:saveFile', options),
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),

  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // Shell
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
  openPath: (path: string) => ipcRenderer.invoke('shell:openPath', path),
  showItemInFolder: (path: string) => ipcRenderer.invoke('shell:showItemInFolder', path),

  // IPC event listeners
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args)
    ipcRenderer.on(channel, subscription)
    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },

  once: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.once(channel, (_event, ...args) => callback(...args))
  },
})

// Type definitions for renderer
declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean
      platform: NodeJS.Platform
      getVersion: () => Promise<string>
      getPlatform: () => Promise<NodeJS.Platform>
      getPath: (name: string) => Promise<string>
      openFile: (options?: { filters?: { name: string; extensions: string[] }[] }) => Promise<Electron.OpenDialogReturnValue>
      saveFile: (options?: { filters?: { name: string; extensions: string[] }[] }) => Promise<Electron.SaveDialogReturnValue>
      openDirectory: () => Promise<Electron.OpenDialogReturnValue>
      minimize: () => Promise<void>
      maximize: () => Promise<void>
      close: () => Promise<void>
      isMaximized: () => Promise<boolean>
      openExternal: (url: string) => Promise<void>
      openPath: (path: string) => Promise<string>
      showItemInFolder: (path: string) => Promise<void>
      on: (channel: string, callback: (...args: unknown[]) => void) => () => void
      once: (channel: string, callback: (...args: unknown[]) => void) => void
    }
  }
}
