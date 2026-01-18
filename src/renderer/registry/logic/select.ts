import type { NodeDefinition } from '../types'

export const selectNode: NodeDefinition = {
  id: 'select',
  name: 'Select',
  version: '1.0.0',
  category: 'logic',
  description: 'Select one of multiple inputs by index',
  icon: 'list',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'index', type: 'number', label: 'Index' },
    { id: 'a', type: 'any', label: 'A' },
    { id: 'b', type: 'any', label: 'B' },
    { id: 'c', type: 'any', label: 'C' },
    { id: 'd', type: 'any', label: 'D' },
  ],
  outputs: [
    { id: 'result', type: 'any', label: 'Result' },
  ],
  controls: [],
}
