import type { NodeDefinition } from '../types'

export const arrayUniqueNode: NodeDefinition = {
  id: 'array-unique',
  name: 'Array Unique',
  version: '1.0.0',
  category: 'data',
  description: 'Remove duplicate values',
  icon: 'fingerprint',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [{ id: 'result', type: 'array', label: 'Result' }],
  controls: [],
  tags: ['array', 'unique', 'distinct', 'dedupe'],
}
