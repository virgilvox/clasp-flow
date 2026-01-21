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
}
