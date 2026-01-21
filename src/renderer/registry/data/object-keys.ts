import type { NodeDefinition } from '../types'

export const objectKeysNode: NodeDefinition = {
  id: 'object-keys',
  name: 'Object Keys',
  version: '1.0.0',
  category: 'data',
  description: 'Get array of object keys',
  icon: 'key',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'object', type: 'data', label: 'Object' }],
  outputs: [
    { id: 'keys', type: 'array', label: 'Keys' },
    { id: 'count', type: 'number', label: 'Count' },
  ],
  controls: [],
  tags: ['object', 'keys', 'properties', 'enumerate'],
}
