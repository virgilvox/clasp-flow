import type { NodeDefinition } from '../types'

export const addNode: NodeDefinition = {
  id: 'add',
  name: 'Add',
  version: '1.0.0',
  category: 'math',
  description: 'Add two numbers',
  icon: 'plus',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'number', label: 'A' },
    { id: 'b', type: 'number', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [],
}
