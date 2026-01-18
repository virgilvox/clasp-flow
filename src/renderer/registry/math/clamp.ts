import type { NodeDefinition } from '../types'

export const clampNode: NodeDefinition = {
  id: 'clamp',
  name: 'Clamp',
  version: '1.0.0',
  category: 'math',
  description: 'Clamp a value between min and max',
  icon: 'shrink',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'min', type: 'number', label: 'Min', default: 0 },
    { id: 'max', type: 'number', label: 'Max', default: 1 },
  ],
}
