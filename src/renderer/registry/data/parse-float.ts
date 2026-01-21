import type { NodeDefinition } from '../types'

export const parseFloatNode: NodeDefinition = {
  id: 'parse-float',
  name: 'Parse Float',
  version: '1.0.0',
  category: 'data',
  description: 'Parse string to floating point number',
  icon: 'percent',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'string', label: 'Value' }],
  outputs: [
    { id: 'result', type: 'number', label: 'Result' },
    { id: 'valid', type: 'boolean', label: 'Valid' },
  ],
  controls: [
    { id: 'default', type: 'number', label: 'Default', default: 0 },
  ],
  tags: ['parse', 'float', 'decimal', 'convert'],
}
