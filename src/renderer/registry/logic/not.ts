import type { NodeDefinition } from '../types'

export const notNode: NodeDefinition = {
  id: 'not',
  name: 'Not',
  version: '1.0.0',
  category: 'logic',
  description: 'Logical NOT',
  icon: 'circle-off',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'boolean', label: 'Value' }],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [],
  info: {
    overview: 'Inverts a boolean value, turning true into false and false into true. This is the standard logical NOT operation. Use it to negate conditions or reverse the behavior of boolean signals.',
    tips: [
      'Place after compare or equals to invert a condition without changing the operator.',
      'Combine with And to build NAND logic gates.',
    ],
    pairsWith: ['and', 'or', 'compare', 'equals', 'gate'],
  },
}
