import type { NodeDefinition } from '../types'

export const toBooleanNode: NodeDefinition = {
  id: 'to-boolean',
  name: 'To Boolean',
  version: '1.0.0',
  category: 'data',
  description: 'Convert value to boolean (truthy/falsy)',
  icon: 'toggle-right',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [
    {
      id: 'mode',
      type: 'select',
      label: 'Mode',
      default: 'truthy',
      props: { options: ['truthy', 'strict'] },
    },
  ],
  tags: ['convert', 'boolean', 'truthy', 'cast'],
}
