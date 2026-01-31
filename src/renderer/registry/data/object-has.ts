import type { NodeDefinition } from '../types'

export const objectHasNode: NodeDefinition = {
  id: 'object-has',
  name: 'Object Has',
  version: '1.0.0',
  category: 'data',
  description: 'Check if object has property',
  icon: 'check-square',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'object', type: 'data', label: 'Object' },
    { id: 'path', type: 'string', label: 'Path' },
  ],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [
    { id: 'defaultPath', type: 'text', label: 'Path', default: '', props: { placeholder: 'data.name' } },
  ],
  tags: ['object', 'has', 'property', 'exists', 'check'],
  info: {
    overview: 'Checks whether an object contains a property at a given dot-notation path. Returns true if the path exists, false otherwise. Useful for validating data shape before accessing values.',
    tips: [
      'Use this before Object Get to avoid passing undefined into downstream nodes.',
      'Connect the result to a Gate to conditionally route data based on property existence.',
    ],
    pairsWith: ['object-get', 'gate', 'compare', 'json-parse'],
  },
}
