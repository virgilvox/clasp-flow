import type { NodeDefinition } from '../types'

export const parseIntNode: NodeDefinition = {
  id: 'parse-int',
  name: 'Parse Int',
  version: '1.0.0',
  category: 'data',
  description: 'Parse string to integer with radix support',
  icon: 'binary',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'string', label: 'Value' }],
  outputs: [
    { id: 'result', type: 'number', label: 'Result' },
    { id: 'valid', type: 'boolean', label: 'Valid' },
  ],
  controls: [
    { id: 'radix', type: 'number', label: 'Radix', default: 10 },
    { id: 'default', type: 'number', label: 'Default', default: 0 },
  ],
  tags: ['parse', 'integer', 'hex', 'binary', 'convert'],
}
