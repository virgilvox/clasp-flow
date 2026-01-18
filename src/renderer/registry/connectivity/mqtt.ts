import type { NodeDefinition } from '../types'

export const mqttNode: NodeDefinition = {
  id: 'mqtt',
  name: 'MQTT',
  version: '1.0.0',
  category: 'connectivity',
  description: 'MQTT pub/sub messaging (via WebSocket)',
  icon: 'radio',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'url', type: 'string', label: 'Broker URL' },
    { id: 'topic', type: 'string', label: 'Topic' },
    { id: 'publish', type: 'data', label: 'Publish' },
  ],
  outputs: [
    { id: 'message', type: 'data', label: 'Message' },
    { id: 'topic', type: 'string', label: 'Topic' },
    { id: 'connected', type: 'boolean', label: 'Connected' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'url', type: 'text', label: 'Broker URL', default: 'ws://localhost:8083/mqtt', props: { placeholder: 'ws://broker:8083/mqtt' } },
    { id: 'topic', type: 'text', label: 'Topic', default: 'clasp/data', props: { placeholder: 'topic/subtopic' } },
    { id: 'connect', type: 'toggle', label: 'Connect', default: true },
  ],
}
