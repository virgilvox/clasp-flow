import type { NodeDefinition } from '../types'

export const divideNode: NodeDefinition = {
  id: 'divide',
  name: 'Divide',
  version: '1.0.0',
  category: 'math',
  description: 'Divide two numbers',
  icon: 'divide',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'number', label: 'A' },
    { id: 'b', type: 'number', label: 'B' },
  ],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [],
}
