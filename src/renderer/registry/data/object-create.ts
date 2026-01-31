import type { NodeDefinition } from '../types'

export const objectCreateNode: NodeDefinition = {
  id: 'object-create',
  name: 'Object Create',
  version: '1.0.0',
  category: 'data',
  description: 'Create object from key/value pairs',
  icon: 'plus-square',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'key1', type: 'string', label: 'Key 1' },
    { id: 'value1', type: 'any', label: 'Value 1' },
    { id: 'key2', type: 'string', label: 'Key 2' },
    { id: 'value2', type: 'any', label: 'Value 2' },
    { id: 'key3', type: 'string', label: 'Key 3' },
    { id: 'value3', type: 'any', label: 'Value 3' },
  ],
  outputs: [{ id: 'result', type: 'data', label: 'Result' }],
  controls: [],
  tags: ['object', 'create', 'build', 'construct'],
  info: {
    overview: 'Builds a new object from up to three key/value pairs. Each key is a string input and each value can be any type. Unused pairs are omitted from the output.',
    tips: [
      'Leave key inputs empty to skip those pairs and create objects with fewer properties.',
      'Chain with Object Merge to combine the result with an existing object.',
    ],
    pairsWith: ['object-merge', 'object-set', 'json-stringify', 'http-request'],
  },
}
