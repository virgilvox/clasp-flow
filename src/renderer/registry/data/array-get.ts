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
}
