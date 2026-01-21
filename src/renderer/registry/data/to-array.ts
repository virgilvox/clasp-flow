import type { NodeDefinition } from '../types'

export const toArrayNode: NodeDefinition = {
  id: 'to-array',
  name: 'To Array',
  version: '1.0.0',
  category: 'data',
  description: 'Wrap value in array, or split string to array',
  icon: 'brackets',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'result', type: 'array', label: 'Result' }],
  controls: [
    {
      id: 'mode',
      type: 'select',
      label: 'Mode',
      default: 'wrap',
      props: { options: ['wrap', 'split', 'from'] },
    },
    { id: 'separator', type: 'text', label: 'Separator', default: ',' },
  ],
  tags: ['convert', 'array', 'wrap', 'split'],
}
