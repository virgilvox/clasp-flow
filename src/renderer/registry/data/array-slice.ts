import type { NodeDefinition } from '../types'

export const arraySliceNode: NodeDefinition = {
  id: 'array-slice',
  name: 'Array Slice',
  version: '1.0.0',
  category: 'data',
  description: 'Get subset of array',
  icon: 'scissors',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [{ id: 'result', type: 'array', label: 'Result' }],
  controls: [
    { id: 'start', type: 'number', label: 'Start', default: 0 },
    { id: 'end', type: 'number', label: 'End', default: -1 },
  ],
  tags: ['array', 'slice', 'subset', 'range'],
  info: {
    overview: 'Extracts a portion of an array from a start index to an end index. Returns a new array containing only the selected elements. Negative indices count from the end of the array.',
    tips: [
      'Set end to -1 to slice from the start index through the last element.',
      'Use this to implement pagination by adjusting start and end based on page size.',
    ],
    pairsWith: ['array-length', 'array-range', 'counter', 'array-reverse'],
  },
}
