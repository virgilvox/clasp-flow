import type { NodeDefinition } from '../types'

export const switchNode: NodeDefinition = {
  id: 'switch',
  name: 'Switch',
  version: '1.0.0',
  category: 'logic',
  description: 'Select between two values',
  icon: 'git-branch',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'condition', type: 'boolean', label: 'Condition' },
    { id: 'true', type: 'any', label: 'True' },
    { id: 'false', type: 'any', label: 'False' },
  ],
  outputs: [{ id: 'result', type: 'any', label: 'Result' }],
  controls: [],
  info: {
    overview: 'Outputs one of two values depending on a boolean condition. When the condition is true, the True input is forwarded. When false, the False input is forwarded. This is the basic if/else building block for data flow.',
    tips: [
      'Feed the output of compare or equals into the condition input for threshold-based switching.',
      'Use select instead when you need to choose from more than two options.',
    ],
    pairsWith: ['compare', 'equals', 'select', 'gate', 'not'],
  },
}
