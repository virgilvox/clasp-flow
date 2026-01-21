import type { NodeDefinition } from '../types'

export const lerpNode: NodeDefinition = {
  id: 'lerp',
  name: 'Lerp',
  version: '1.0.0',
  category: 'math',
  description: 'Linear interpolation between two values',
  icon: 'git-commit-horizontal',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'number', label: 'A' },
    { id: 'b', type: 'number', label: 'B' },
    { id: 't', type: 'number', label: 'T' },
  ],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [],
  tags: ['lerp', 'interpolate', 'blend', 'mix'],
}
