import type { NodeDefinition } from '../types'

export const objectValuesNode: NodeDefinition = {
  id: 'object-values',
  name: 'Object Values',
  version: '1.0.0',
  category: 'data',
  description: 'Get array of object values',
  icon: 'list-collapse',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'object', type: 'data', label: 'Object' }],
  outputs: [
    { id: 'values', type: 'array', label: 'Values' },
    { id: 'count', type: 'number', label: 'Count' },
  ],
  controls: [],
  tags: ['object', 'values', 'enumerate'],
}
