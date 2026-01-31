import type { NodeDefinition } from '../types'

export const arrayGetNode: NodeDefinition = {
  id: 'array-get',
  name: 'Array Get',
  version: '1.0.0',
  category: 'data',
  description: 'Get element at index',
  icon: 'list-ordered',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'array', type: 'array', label: 'Array' },
    { id: 'index', type: 'number', label: 'Index' },
  ],
  outputs: [
    { id: 'value', type: 'any', label: 'Value' },
    { id: 'found', type: 'boolean', label: 'Found' },
  ],
  controls: [
    { id: 'default', type: 'text', label: 'Default', default: '' },
  ],
  tags: ['array', 'get', 'index', 'element', 'access'],
  info: {
    overview: 'Retrieves the element at a specific index in an array. Outputs the value and a boolean indicating whether the index was valid. You can set a default value to use when the index is out of bounds.',
    tips: [
      'Use negative indices to count from the end of the array.',
      'Set a meaningful default value to avoid passing undefined downstream.',
    ],
    pairsWith: ['array-length', 'array-contains', 'counter', 'expression'],
  },
}
