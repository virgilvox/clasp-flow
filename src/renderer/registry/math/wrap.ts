import type { NodeDefinition } from '../types'

export const wrapNode: NodeDefinition = {
  id: 'wrap',
  name: 'Wrap',
  version: '1.0.0',
  category: 'math',
  description: 'Wrap value to stay within range',
  icon: 'repeat',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'min', type: 'number', label: 'Min', default: 0 },
    { id: 'max', type: 'number', label: 'Max', default: 1 },
  ],
  tags: ['wrap', 'modulo', 'loop', 'cycle', 'circular'],
}
