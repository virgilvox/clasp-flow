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
  info: {
    overview: 'Subtracts the second input from the first and outputs the difference. This is one of the core arithmetic operations. Use it to compute offsets, deltas, or distances between values.',
    tips: [
      'Follow with abs to get the unsigned distance between two values.',
      'Use to compute frame-to-frame deltas by subtracting the previous value from the current.',
    ],
    pairsWith: ['add', 'abs', 'multiply', 'smooth'],
  },
}
