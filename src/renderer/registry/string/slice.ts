import type { NodeDefinition } from '../types'

export const stringSliceNode: NodeDefinition = {
  id: 'string-slice',
  name: 'String Slice',
  version: '1.0.0',
  category: 'string',
  description: 'Extract a portion of a string',
  icon: 'slice',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'string', label: 'Input' },
    { id: 'start', type: 'number', label: 'Start' },
    { id: 'end', type: 'number', label: 'End' },
  ],
  outputs: [
    { id: 'result', type: 'string', label: 'Result' },
    { id: 'length', type: 'number', label: 'Length' },
  ],
  controls: [
    { id: 'start', type: 'number', label: 'Start', default: 0 },
    { id: 'end', type: 'number', label: 'End', default: -1 },
  ],
  info: {
    overview: 'Extracts a substring from the input using start and end indices. Negative indices count from the end of the string. Also outputs the length of the extracted portion.',
    tips: [
      'Set end to -1 to slice from the start index through the rest of the string.',
      'Combine with String Length to dynamically calculate slice boundaries.',
    ],
    pairsWith: ['string-length', 'string-contains', 'string-split', 'expression'],
  },
}
