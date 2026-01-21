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
}
