import type { NodeDefinition } from '../types'

export const isEmptyNode: NodeDefinition = {
  id: 'is-empty',
  name: 'Is Empty',
  version: '1.0.0',
  category: 'logic',
  description: 'Check if value is null, undefined, empty string, or empty array',
  icon: 'box',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [
    { id: 'result', type: 'boolean', label: 'Result' },
    { id: 'type', type: 'string', label: 'Type' },
  ],
  controls: [],
  tags: ['null', 'undefined', 'empty', 'check', 'array', 'string'],
}
