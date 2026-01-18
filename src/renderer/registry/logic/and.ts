import type { NodeDefinition } from '../types'

export const andNode: NodeDefinition = {
  id: 'and',
  name: 'And',
  version: '1.0.0',
  category: 'logic',
  description: 'Logical AND',
  icon: 'circle-dot',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'boolean', label: 'A' },
    { id: 'b', type: 'boolean', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [],
}
