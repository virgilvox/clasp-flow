import type { NodeDefinition } from '../types'

export const stepNode: NodeDefinition = {
  id: 'step',
  name: 'Step',
  version: '1.0.0',
  category: 'math',
  description: 'Returns 0 if value < edge, otherwise 1',
  icon: 'stairs',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'edge', type: 'number', label: 'Edge', default: 0.5 },
  ],
  tags: ['step', 'threshold', 'binary', 'heaviside'],
}
