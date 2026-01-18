import type { NodeDefinition } from '../types'

export const notNode: NodeDefinition = {
  id: 'not',
  name: 'Not',
  version: '1.0.0',
  category: 'logic',
  description: 'Logical NOT',
  icon: 'circle-off',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'boolean', label: 'Value' }],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [],
}
