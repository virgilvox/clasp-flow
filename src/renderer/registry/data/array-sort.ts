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
  info: {
    overview: 'Sorts the elements of an array in ascending or descending order. Supports auto-detection of type as well as explicit numeric or alphabetic sorting. Returns a new sorted array.',
    tips: [
      'Use the "numeric" type when sorting strings that contain numbers to avoid lexicographic ordering.',
      'Chain with Array First/Last to quickly extract the minimum or maximum value.',
    ],
    pairsWith: ['array-first-last', 'array-reverse', 'array-unique', 'array-slice'],
  },
}
