import type { NodeDefinition } from '../types'

export const stepNode: NodeDefinition = {
  id: 'step',
  name: 'Step',
  version: '1.0.0',
  category: 'math',
  description: 'Returns 0 if value < edge, otherwise 1',
  icon: 'stairs',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'edge', type: 'number', label: 'Edge', default: 0.5 },
  ],
  tags: ['step', 'threshold', 'binary', 'heaviside'],
  info: {
    overview: 'Outputs 0 when the input is below the edge value and 1 when it is at or above the edge. This is a hard threshold function, also known as the Heaviside step. Useful for converting continuous signals into binary on/off states.',
    tips: [
      'Use smoothstep instead if you need a gradual transition around the threshold.',
      'Feed the output into a gate or switch to control flow based on a threshold.',
    ],
    pairsWith: ['smoothstep', 'compare', 'gate', 'quantize'],
  },
}
