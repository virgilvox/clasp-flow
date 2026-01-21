import type { NodeDefinition } from '../types'

export const toNumberNode: NodeDefinition = {
  id: 'to-number',
  name: 'To Number',
  version: '1.0.0',
  category: 'data',
  description: 'Convert value to number',
  icon: 'hash',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [
    { id: 'result', type: 'number', label: 'Result' },
    { id: 'valid', type: 'boolean', label: 'Valid' },
  ],
  controls: [
    { id: 'default', type: 'number', label: 'Default', default: 0 },
  ],
  tags: ['convert', 'number', 'parse', 'cast'],
}
