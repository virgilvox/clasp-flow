import type { NodeDefinition } from '../types'

export const toStringNode: NodeDefinition = {
  id: 'to-string',
  name: 'To String',
  version: '1.0.0',
  category: 'data',
  description: 'Convert any value to string',
  icon: 'type',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'result', type: 'string', label: 'Result' }],
  controls: [
    {
      id: 'format',
      type: 'select',
      label: 'Format',
      default: 'default',
      props: { options: ['default', 'json', 'fixed'] },
    },
    { id: 'precision', type: 'number', label: 'Precision', default: 2 },
  ],
  tags: ['convert', 'string', 'format', 'stringify'],
}
