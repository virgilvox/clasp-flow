import type { NodeDefinition } from '../types'

export const subtractNode: NodeDefinition = {
  id: 'subtract',
  name: 'Subtract',
  version: '1.0.0',
  category: 'math',
  description: 'Subtract two numbers',
  icon: 'minus',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'number', label: 'A' },
    { id: 'b', type: 'number', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [],
}
