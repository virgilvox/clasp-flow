import type { NodeDefinition } from '../types'

export const selectNode: NodeDefinition = {
  id: 'select',
  name: 'Select',
  version: '1.0.0',
  category: 'logic',
  description: 'Select one of multiple inputs by index',
  icon: 'list',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'index', type: 'number', label: 'Index' },
    { id: 'a', type: 'any', label: 'A' },
    { id: 'b', type: 'any', label: 'B' },
    { id: 'c', type: 'any', label: 'C' },
    { id: 'd', type: 'any', label: 'D' },
  ],
  outputs: [
    { id: 'result', type: 'any', label: 'Result' },
  ],
  controls: [],
  info: {
    overview: 'Picks one of up to four inputs based on a numeric index. Index 0 selects input A, index 1 selects B, and so on. This is useful for cycling through values or building lookup-style selection from a numeric source.',
    tips: [
      'Use modulo before the index input to cycle through inputs in a loop.',
      'Combine with quantize to snap a continuous signal to discrete selection steps.',
    ],
    pairsWith: ['switch', 'modulo', 'quantize', 'compare'],
  },
}
