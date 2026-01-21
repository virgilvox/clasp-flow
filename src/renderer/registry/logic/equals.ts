import type { NodeDefinition } from '../types'

export const equalsNode: NodeDefinition = {
  id: 'equals',
  name: 'Equals',
  version: '1.0.0',
  category: 'logic',
  description: 'Type-agnostic equality comparison',
  icon: 'equal',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'any', label: 'A' },
    { id: 'b', type: 'any', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [
    { id: 'strict', type: 'toggle', label: 'Strict (===)', default: true },
  ],
  tags: ['compare', 'equal', 'match', 'same'],
}
