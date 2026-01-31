import type { NodeDefinition } from '../types'

export const smoothNode: NodeDefinition = {
  id: 'smooth',
  name: 'Smooth',
  version: '1.0.0',
  category: 'math',
  description: 'Smooth value changes over time',
  icon: 'trending-up',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'value', type: 'number', label: 'Value' },
  ],
  outputs: [
    { id: 'result', type: 'number', label: 'Result' },
  ],
  controls: [
    { id: 'factor', type: 'slider', label: 'Factor', default: 0.1, props: { min: 0.01, max: 1, step: 0.01 } },
  ],
  info: {
    overview: 'Applies exponential smoothing to a value, gradually moving the output toward the input over time. Lower factor values produce slower, smoother transitions while higher values track the input more closely. Useful for dampening noisy or jittery signals.',
    tips: [
      'Start with a factor around 0.1 and adjust based on how responsive you need the output to be.',
      'Place after any sensor or rapidly changing input to remove noise.',
    ],
    pairsWith: ['lerp', 'clamp', 'map-range', 'lfo', 'remap'],
  },
}
