import type { NodeDefinition } from '../types'

export const stringSplitNode: NodeDefinition = {
  id: 'string-split',
  name: 'String Split',
  version: '1.0.0',
  category: 'string',
  description: 'Split string into parts',
  icon: 'scissors',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'string', label: 'Input' },
  ],
  outputs: [
    { id: 'parts', type: 'array', label: 'Parts' },
    { id: 'first', type: 'string', label: 'First' },
    { id: 'count', type: 'number', label: 'Count' },
  ],
  controls: [
    { id: 'separator', type: 'text', label: 'Separator', default: ',' },
    { id: 'limit', type: 'number', label: 'Limit', default: 0, props: { min: 0 } },
  ],
  info: {
    overview: 'Splits a string into an array of parts using a separator. Outputs the array, the first element, and the total count of parts. An optional limit controls the maximum number of splits.',
    tips: [
      'Split by newline to break multi-line text into individual lines.',
      'Use the count output to determine how many tokens were found before processing the array.',
    ],
    pairsWith: ['string-concat', 'string-replace', 'string-contains', 'json-parse'],
  },
}
