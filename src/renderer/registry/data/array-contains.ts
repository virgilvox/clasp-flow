import type { NodeDefinition } from '../types'

export const arrayContainsNode: NodeDefinition = {
  id: 'array-contains',
  name: 'Array Contains',
  version: '1.0.0',
  category: 'data',
  description: 'Check if array contains a value',
  icon: 'search',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'array', type: 'array', label: 'Array' },
    { id: 'value', type: 'any', label: 'Value' },
  ],
  outputs: [
    { id: 'result', type: 'boolean', label: 'Result' },
    { id: 'index', type: 'number', label: 'Index' },
  ],
  controls: [],
  tags: ['array', 'contains', 'includes', 'find', 'search'],
  info: {
    overview: 'Checks whether a given value exists in an array. Returns a boolean result and the index where the value was found, or -1 if it was not found.',
    tips: [
      'Use the index output to feed directly into Array Get when you need the matched element.',
      'Connect the boolean result to a Gate node to conditionally pass data based on membership.',
    ],
    pairsWith: ['array-get', 'array-filter-nulls', 'gate', 'compare'],
  },
}
