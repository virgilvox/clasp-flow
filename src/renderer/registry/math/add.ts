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
  info: {
    overview: 'Adds two numbers together and outputs the sum. This is one of the core arithmetic operations. Use it to combine values, apply offsets, or accumulate totals.',
    tips: [
      'Chain with a constant node to add a fixed offset to a signal.',
      'Pair with multiply to build linear transformations (multiply then add).',
    ],
    pairsWith: ['subtract', 'multiply', 'constant', 'smooth'],
  },
}
