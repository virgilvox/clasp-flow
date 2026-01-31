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
  info: {
    overview: 'Extracts all property names from an object and returns them as an array of strings. Also outputs the total number of keys. Useful for inspecting object structure or iterating over properties.',
    tips: [
      'Feed the keys array into Array Contains to check for a specific property by name.',
      'Use the count output to detect empty objects without inspecting individual keys.',
    ],
    pairsWith: ['object-values', 'object-entries', 'array-contains', 'array-length'],
  },
}
