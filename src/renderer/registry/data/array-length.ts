import type { NodeDefinition } from '../types'

export const arrayLengthNode: NodeDefinition = {
  id: 'array-length',
  name: 'Array Length',
  version: '1.0.0',
  category: 'data',
  description: 'Get length of array',
  icon: 'list',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [
    { id: 'length', type: 'number', label: 'Length' },
    { id: 'isEmpty', type: 'boolean', label: 'Is Empty' },
  ],
  controls: [],
  tags: ['array', 'length', 'count', 'size'],
}
