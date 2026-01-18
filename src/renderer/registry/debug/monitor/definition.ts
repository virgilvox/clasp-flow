import type { NodeDefinition } from '../../types'

export const monitorNode: NodeDefinition = {
  id: 'monitor',
  name: 'Monitor',
  version: '1.0.0',
  category: 'debug',
  description: 'Display input values',
  icon: 'eye',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'value', type: 'any', label: 'Pass' }],
  controls: [],
}
