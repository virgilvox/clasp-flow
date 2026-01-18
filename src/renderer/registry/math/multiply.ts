import type { NodeDefinition } from '../types'

export const multiplyNode: NodeDefinition = {
  id: 'multiply',
  name: 'Multiply',
  version: '1.0.0',
  category: 'math',
  description: 'Multiply two numbers',
  icon: 'x',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'number', label: 'A' },
    { id: 'b', type: 'number', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [],
}
