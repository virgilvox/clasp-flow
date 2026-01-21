import type { NodeDefinition } from '../types'

export const arrayContainsNode: NodeDefinition = {
  id: 'array-contains',
  name: 'Array Contains',
  version: '1.0.0',
  category: 'data',
  description: 'Check if array contains a value',
  icon: 'search',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'array', type: 'array', label: 'Array' },
    { id: 'value', type: 'any', label: 'Value' },
  ],
  outputs: [
    { id: 'result', type: 'boolean', label: 'Result' },
    { id: 'index', type: 'number', label: 'Index' },
  ],
  controls: [],
  tags: ['array', 'contains', 'includes', 'find', 'search'],
}
