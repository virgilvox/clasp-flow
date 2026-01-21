import type { NodeDefinition } from '../types'

export const arraySliceNode: NodeDefinition = {
  id: 'array-slice',
  name: 'Array Slice',
  version: '1.0.0',
  category: 'data',
  description: 'Get subset of array',
  icon: 'scissors',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [{ id: 'result', type: 'array', label: 'Result' }],
  controls: [
    { id: 'start', type: 'number', label: 'Start', default: 0 },
    { id: 'end', type: 'number', label: 'End', default: -1 },
  ],
  tags: ['array', 'slice', 'subset', 'range'],
}
