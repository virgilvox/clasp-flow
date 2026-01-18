import type { NodeDefinition } from '../types'

export const orNode: NodeDefinition = {
  id: 'or',
  name: 'Or',
  version: '1.0.0',
  category: 'logic',
  description: 'Logical OR',
  icon: 'circle',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'boolean', label: 'A' },
    { id: 'b', type: 'boolean', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [],
}
