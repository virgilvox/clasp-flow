import type { NodeDefinition } from '../types'

export const websocketNode: NodeDefinition = {
  id: 'websocket',
  name: 'WebSocket',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Real-time WebSocket connection',
  icon: 'radio',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'url', type: 'string', label: 'URL' },
    { id: 'send', type: 'data', label: 'Send' },
    { id: 'connect', type: 'boolean', label: 'Connect' },
  ],
  outputs: [
    { id: 'message', type: 'data', label: 'Message' },
    { id: 'connected', type: 'boolean', label: 'Connected' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'url', type: 'text', label: 'URL', default: 'wss://echo.websocket.org' },
    { id: 'autoConnect', type: 'toggle', label: 'Auto Connect', default: false },
  ],
}
