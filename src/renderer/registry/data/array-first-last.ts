import type { NodeDefinition } from '../types'

export const arrayFirstLastNode: NodeDefinition = {
  id: 'array-first-last',
  name: 'Array First/Last',
  version: '1.0.0',
  category: 'data',
  description: 'Get first and last elements',
  icon: 'move-horizontal',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [
    { id: 'first', type: 'any', label: 'First' },
    { id: 'last', type: 'any', label: 'Last' },
    { id: 'length', type: 'number', label: 'Length' },
  ],
  controls: [],
  tags: ['array', 'first', 'last', 'head', 'tail'],
  info: {
    overview: 'Extracts the first and last elements from an array and outputs them individually. Also provides the array length. This is a quick way to peek at the boundaries of a list without indexing manually.',
    tips: [
      'Use this after Array Sort to grab the minimum and maximum values in one step.',
      'Check the length output to guard against empty arrays before using the element values.',
    ],
    pairsWith: ['array-sort', 'array-reverse', 'array-length', 'compare'],
  },
}
