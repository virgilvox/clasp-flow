import type { NodeDefinition } from '../types'

export const arrayFirstLastNode: NodeDefinition = {
  id: 'array-first-last',
  name: 'Array First/Last',
  version: '1.0.0',
  category: 'data',
  description: 'Get first and last elements',
  icon: 'move-horizontal',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [
    { id: 'first', type: 'any', label: 'First' },
    { id: 'last', type: 'any', label: 'Last' },
    { id: 'length', type: 'number', label: 'Length' },
  ],
  controls: [],
  tags: ['array', 'first', 'last', 'head', 'tail'],
}
