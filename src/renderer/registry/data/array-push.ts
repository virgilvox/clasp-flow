import type { NodeDefinition } from '../types'

export const arrayPushNode: NodeDefinition = {
  id: 'array-push',
  name: 'Array Push',
  version: '1.0.0',
  category: 'data',
  description: 'Add element(s) to array',
  icon: 'plus-circle',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'array', type: 'array', label: 'Array' },
    { id: 'value', type: 'any', label: 'Value' },
  ],
  outputs: [{ id: 'result', type: 'array', label: 'Result' }],
  controls: [
    {
      id: 'position',
      type: 'select',
      label: 'Position',
      default: 'end',
      props: { options: ['end', 'start'] },
    },
  ],
  tags: ['array', 'push', 'add', 'append', 'prepend'],
}
