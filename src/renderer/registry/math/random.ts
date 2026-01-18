import type { NodeDefinition } from '../types'

export const randomNode: NodeDefinition = {
  id: 'random',
  name: 'Random',
  version: '1.0.0',
  category: 'math',
  description: 'Generate random number',
  icon: 'shuffle',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'seed', type: 'number', label: 'Seed' }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'min', type: 'number', label: 'Min', default: 0 },
    { id: 'max', type: 'number', label: 'Max', default: 1 },
  ],
}
