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
}
