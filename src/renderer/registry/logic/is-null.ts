import type { NodeDefinition } from '../types'

export const isNullNode: NodeDefinition = {
  id: 'is-null',
  name: 'Is Null',
  version: '1.0.0',
  category: 'logic',
  description: 'Check if value is null or undefined',
  icon: 'circle-off',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [],
  tags: ['null', 'undefined', 'check', 'empty', 'missing'],
}
