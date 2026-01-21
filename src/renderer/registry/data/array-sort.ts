import type { NodeDefinition } from '../types'

export const arraySortNode: NodeDefinition = {
  id: 'array-sort',
  name: 'Array Sort',
  version: '1.0.0',
  category: 'data',
  description: 'Sort array values',
  icon: 'arrow-up-down',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [{ id: 'result', type: 'array', label: 'Result' }],
  controls: [
    {
      id: 'direction',
      type: 'select',
      label: 'Direction',
      default: 'ascending',
      props: { options: ['ascending', 'descending'] },
    },
    {
      id: 'type',
      type: 'select',
      label: 'Type',
      default: 'auto',
      props: { options: ['auto', 'numeric', 'alphabetic'] },
    },
  ],
  tags: ['array', 'sort', 'order', 'ascending', 'descending'],
}
