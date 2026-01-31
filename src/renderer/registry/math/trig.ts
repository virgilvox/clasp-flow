import type { NodeDefinition } from '../types'

export const trigNode: NodeDefinition = {
  id: 'trig',
  name: 'Trig',
  version: '1.0.0',
  category: 'math',
  description: 'Trigonometric functions',
  icon: 'waves',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'value', type: 'number', label: 'Value' },
  ],
  outputs: [
    { id: 'result', type: 'number', label: 'Result' },
  ],
  controls: [
    {
      id: 'function',
      type: 'select',
      label: 'Function',
      default: 'sin',
      props: {
        options: ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh'],
      },
    },
    { id: 'degrees', type: 'toggle', label: 'Use Degrees', default: false },
  ],
  info: {
    overview: 'Applies trigonometric functions including sin, cos, tan, and their inverses and hyperbolic variants. The input is treated as radians by default, but a toggle lets you work in degrees instead. Useful for circular motion, oscillation, and angle calculations.',
    tips: [
      'Enable Use Degrees if your angle source provides values in degrees rather than radians.',
      'Feed a time-based ramp into sin or cos to generate smooth oscillations.',
    ],
    pairsWith: ['multiply', 'add', 'time', 'lfo', 'power'],
  },
}
