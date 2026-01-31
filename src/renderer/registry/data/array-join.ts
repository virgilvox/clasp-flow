import type { NodeDefinition } from '../types'

export const arrayJoinNode: NodeDefinition = {
  id: 'array-join',
  name: 'Array Join',
  version: '1.0.0',
  category: 'data',
  description: 'Join array elements into string',
  icon: 'link',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [{ id: 'result', type: 'string', label: 'Result' }],
  controls: [
    { id: 'separator', type: 'text', label: 'Separator', default: ',' },
  ],
  tags: ['array', 'join', 'concat', 'string'],
  info: {
    overview: 'Joins all elements of an array into a single string using a configurable separator. This is the inverse of splitting a string into an array. Useful for building comma-separated lists, paths, or display text from array data.',
    tips: [
      'Use a newline character in the separator field to produce multi-line output.',
      'Filter nulls before joining to avoid "null" or "undefined" appearing in the result string.',
    ],
    pairsWith: ['to-array', 'array-filter-nulls', 'to-string', 'json-stringify'],
  },
}
