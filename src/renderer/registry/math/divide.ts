import type { NodeDefinition } from '../types'

export const divideNode: NodeDefinition = {
  id: 'divide',
  name: 'Divide',
  version: '1.0.0',
  category: 'math',
  description: 'Divide two numbers',
  icon: 'divide',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'number', label: 'A' },
    { id: 'b', type: 'number', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [],
  info: {
    overview: 'Divides the first input by the second and outputs the quotient. This is standard numeric division. Be aware that dividing by zero will produce Infinity or NaN.',
    tips: [
      'Use a compare node to guard against division by zero before this node.',
      'Combine with modulo to get both the quotient and remainder of a division.',
    ],
    pairsWith: ['multiply', 'modulo', 'compare', 'clamp'],
  },
}
