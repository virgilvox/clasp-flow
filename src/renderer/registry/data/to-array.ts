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
  info: {
    overview: 'Converts a value into an array using one of three modes: wrap places the value inside a single-element array, split divides a string by a separator, and from attempts to convert iterable values. Useful for normalizing input into array form.',
    tips: [
      'Use split mode with a comma separator to turn CSV-style strings into arrays.',
      'Use wrap mode to ensure a value is always an array before feeding it to array-processing nodes.',
    ],
    pairsWith: ['array-join', 'array-filter-nulls', 'array-push', 'json-parse'],
  },
}
