import type { NodeDefinition } from '../types'

export const objectMergeNode: NodeDefinition = {
  id: 'object-merge',
  name: 'Object Merge',
  version: '1.0.0',
  category: 'data',
  description: 'Merge two objects (shallow merge)',
  icon: 'combine',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'data', label: 'A' },
    { id: 'b', type: 'data', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'data', label: 'Result' }],
  controls: [],
  tags: ['object', 'merge', 'combine', 'spread'],
}
