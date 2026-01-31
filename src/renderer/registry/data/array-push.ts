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
  info: {
    overview: 'Adds an element to an array at either the start or end position. Returns a new array with the element included. Use this to build up lists incrementally from individual values.',
    tips: [
      'Set position to "start" when you need a stack-like (LIFO) structure.',
      'Chain multiple Array Push nodes together to append several values in sequence.',
    ],
    pairsWith: ['array-length', 'array-unique', 'array-contains', 'to-array'],
  },
}
