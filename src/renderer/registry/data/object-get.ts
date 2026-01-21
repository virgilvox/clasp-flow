import type { NodeDefinition } from '../types'

export const objectGetNode: NodeDefinition = {
  id: 'object-get',
  name: 'Object Get',
  version: '1.0.0',
  category: 'data',
  description: 'Get property from object by path',
  icon: 'braces',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'object', type: 'data', label: 'Object' },
    { id: 'path', type: 'string', label: 'Path' },
  ],
  outputs: [
    { id: 'value', type: 'any', label: 'Value' },
    { id: 'found', type: 'boolean', label: 'Found' },
  ],
  controls: [
    { id: 'defaultPath', type: 'text', label: 'Path', default: '', props: { placeholder: 'data.items[0].name' } },
    { id: 'default', type: 'text', label: 'Default', default: '' },
  ],
  tags: ['object', 'get', 'property', 'path', 'access'],
}
