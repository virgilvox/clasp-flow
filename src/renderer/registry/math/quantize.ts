import type { NodeDefinition } from '../types'

export const quantizeNode: NodeDefinition = {
  id: 'quantize',
  name: 'Quantize',
  version: '1.0.0',
  category: 'math',
  description: 'Round value to nearest step',
  icon: 'grid',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'step', type: 'number', label: 'Step', default: 1 },
  ],
  tags: ['quantize', 'snap', 'round', 'grid', 'step'],
}
