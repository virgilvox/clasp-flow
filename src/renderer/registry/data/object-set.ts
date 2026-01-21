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
}
