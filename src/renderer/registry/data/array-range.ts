import type { NodeDefinition } from '../types'

export const arrayRangeNode: NodeDefinition = {
  id: 'array-range',
  name: 'Array Range',
  version: '1.0.0',
  category: 'data',
  description: 'Generate an array of sequential numbers',
  icon: 'list-tree',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [{ id: 'result', type: 'array', label: 'Result' }],
  controls: [
    { id: 'start', type: 'number', label: 'Start', default: 0 },
    { id: 'end', type: 'number', label: 'End', default: 10 },
    { id: 'step', type: 'number', label: 'Step', default: 1 },
  ],
  tags: ['array', 'range', 'sequence', 'generate'],
}
