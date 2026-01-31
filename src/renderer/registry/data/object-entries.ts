import type { NodeDefinition } from '../types'

export const objectEntriesNode: NodeDefinition = {
  id: 'object-entries',
  name: 'Object Entries',
  version: '1.0.0',
  category: 'data',
  description: 'Get array of [key, value] pairs',
  icon: 'table',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'object', type: 'data', label: 'Object' }],
  outputs: [
    { id: 'entries', type: 'array', label: 'Entries' },
    { id: 'count', type: 'number', label: 'Count' },
  ],
  controls: [],
  tags: ['object', 'entries', 'pairs', 'iterate'],
  info: {
    overview: 'Converts an object into an array of [key, value] pairs. Also outputs the total count of entries. This is useful for iterating over object properties or transforming objects into tabular data.',
    tips: [
      'Use Array Get on the entries output to access specific key/value pairs by position.',
      'Combine with Array Length to verify the number of properties before processing.',
    ],
    pairsWith: ['object-keys', 'object-values', 'array-get', 'array-length'],
  },
}
