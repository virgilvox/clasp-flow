import type { NodeDefinition } from '../types'

export const absNode: NodeDefinition = {
  id: 'abs',
  name: 'Absolute',
  version: '1.0.0',
  category: 'math',
  description: 'Get absolute value',
  icon: 'flip-horizontal',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [],
}
