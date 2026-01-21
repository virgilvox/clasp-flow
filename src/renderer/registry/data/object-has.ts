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
}
