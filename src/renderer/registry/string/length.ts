import type { NodeDefinition } from '../types'

export const stringLengthNode: NodeDefinition = {
  id: 'string-length',
  name: 'String Length',
  version: '1.0.0',
  category: 'string',
  description: 'Get length of a string',
  icon: 'ruler',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'input', type: 'string', label: 'Input' }],
  outputs: [
    { id: 'length', type: 'number', label: 'Length' },
    { id: 'isEmpty', type: 'boolean', label: 'Is Empty' },
  ],
  controls: [],
  tags: ['length', 'count', 'size', 'characters'],
}
