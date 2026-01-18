import type { NodeDefinition } from '../types'

export const constantNode: NodeDefinition = {
  id: 'constant',
  name: 'Constant',
  version: '1.0.0',
  category: 'inputs',
  description: 'Output a constant value',
  icon: 'hash',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [{ id: 'value', type: 'number', label: 'Value' }],
  controls: [
    { id: 'value', type: 'number', label: 'Value', default: 0, exposable: true },
  ],
}
