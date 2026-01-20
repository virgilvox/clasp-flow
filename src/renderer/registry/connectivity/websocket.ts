import type { NodeDefinition } from '../types'

export const websocketNode: NodeDefinition = {
  id: 'websocket',
  name: 'WebSocket',
  version: '2.0.0',
  category: 'connectivity',
  description: 'Real-time WebSocket connection using ConnectionManager',
  icon: 'radio',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'connectionId', type: 'string', label: 'Connection' },
    { id: 'send', type: 'data', label: 'Send' },
    { id: 'trigger', type: 'trigger', label: 'Send Trigger' },
  ],
  outputs: [
    { id: 'message', type: 'data', label: 'Message' },
    { id: 'connected', type: 'boolean', label: 'Connected' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    {
      id: 'connectionId',
      type: 'connection',
      label: 'Connection',
      default: '',
      props: { protocol: 'websocket', placeholder: 'Select WebSocket connection...' },
    },
  ],
}
