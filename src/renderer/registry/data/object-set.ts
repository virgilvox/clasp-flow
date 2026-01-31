import type { NodeDefinition } from '../types'

export const objectSetNode: NodeDefinition = {
  id: 'object-set',
  name: 'Object Set',
  version: '1.0.0',
  category: 'data',
  description: 'Set property on object (returns new object)',
  icon: 'pen-square',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'object', type: 'data', label: 'Object' },
    { id: 'path', type: 'string', label: 'Path' },
    { id: 'value', type: 'any', label: 'Value' },
  ],
  outputs: [{ id: 'result', type: 'data', label: 'Result' }],
  controls: [
    { id: 'defaultPath', type: 'text', label: 'Path', default: '', props: { placeholder: 'data.name' } },
  ],
  tags: ['object', 'set', 'property', 'path', 'modify'],
  info: {
    overview: 'Sets a property on an object at a given dot-notation path and returns a new object with the change applied. The original object is not mutated. Intermediate path segments are created automatically if they do not exist.',
    tips: [
      'Use dot-notation paths like "user.settings.theme" to set deeply nested values in one step.',
      'Chain with Object Get to read, modify, and write back a single property.',
    ],
    pairsWith: ['object-get', 'object-merge', 'object-create', 'json-stringify'],
  },
}
