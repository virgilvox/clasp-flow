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
  info: {
    overview: 'Reads a value from an object using a dot-notation path such as "data.items[0].name". Returns the value and a boolean indicating whether the path resolved successfully. A default value can be specified for missing paths.',
    tips: [
      'Use bracket notation in the path to access array indices, like "items[2].id".',
      'Check the found output before using the value to handle missing data gracefully.',
    ],
    pairsWith: ['object-set', 'object-has', 'json-parse', 'gate'],
  },
}
