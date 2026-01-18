import type { NodeDefinition } from '../types'

export const compareNode: NodeDefinition = {
  id: 'compare',
  name: 'Compare',
  version: '1.0.0',
  category: 'logic',
  description: 'Compare two values',
  icon: 'git-compare',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'number', label: 'A' },
    { id: 'b', type: 'number', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [
    { id: 'operator', type: 'select', label: 'Op', default: '==', props: { options: ['==', '!=', '>', '>=', '<', '<='] } },
  ],
}
