import type { NodeDefinition } from '../types'

export const mqttNode: NodeDefinition = {
  id: 'mqtt',
  name: 'MQTT',
  version: '2.0.0',
  category: 'connectivity',
  description: 'MQTT pub/sub messaging using ConnectionManager',
  icon: 'radio',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'connectionId', type: 'string', label: 'Connection' },
    { id: 'topic', type: 'string', label: 'Topic' },
    { id: 'publish', type: 'data', label: 'Publish' },
    { id: 'trigger', type: 'trigger', label: 'Publish Trigger' },
  ],
  outputs: [
    { id: 'message', type: 'data', label: 'Message' },
    { id: 'topic', type: 'string', label: 'Topic' },
    { id: 'connected', type: 'boolean', label: 'Connected' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    {
      id: 'connectionId',
      type: 'connection',
      label: 'Connection',
      default: '',
      props: { protocol: 'mqtt', placeholder: 'Select MQTT connection...' },
    },
    {
      id: 'topic',
      type: 'text',
      label: 'Topic',
      default: 'clasp/data',
      props: { placeholder: 'topic/subtopic' },
    },
    {
      id: 'qos',
      type: 'select',
      label: 'QoS',
      default: 0,
      props: { options: [0, 1, 2] },
    },
  ],
}
