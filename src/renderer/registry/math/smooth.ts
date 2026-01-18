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
}
