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
  info: {
    overview: 'Returns the absolute value of the input, converting negative numbers to positive. Zero and positive values pass through unchanged. Commonly used to get magnitude without regard to sign.',
    tips: [
      'Use after subtract to get the distance between two values.',
      'Combine with compare to check if a value exceeds a threshold in either direction.',
    ],
    pairsWith: ['subtract', 'compare', 'clamp', 'smooth'],
  },
}
