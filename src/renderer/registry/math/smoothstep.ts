import type { NodeDefinition } from '../types'

export const smoothstepNode: NodeDefinition = {
  id: 'smoothstep',
  name: 'Smoothstep',
  version: '1.0.0',
  category: 'math',
  description: 'Hermite interpolation between 0 and 1',
  icon: 'wave',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'edge0', type: 'number', label: 'Edge 0', default: 0 },
    { id: 'edge1', type: 'number', label: 'Edge 1', default: 1 },
  ],
  tags: ['smoothstep', 'ease', 'hermite', 'smooth'],
  info: {
    overview: 'Applies Hermite interpolation to produce a smooth S-curve between 0 and 1. Values below edge0 output 0, values above edge1 output 1, and values between are smoothly interpolated. This is the classic smoothstep function from shader programming.',
    tips: [
      'Use as a softer alternative to step when you want gradual transitions instead of hard cutoffs.',
      'Set edge0 and edge1 to control where the transition begins and ends.',
    ],
    pairsWith: ['step', 'lerp', 'remap', 'clamp', 'smooth'],
  },
}
