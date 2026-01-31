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
  info: {
    overview: 'Constrains a value to stay within a minimum and maximum range. Values below the minimum are raised to the minimum, and values above the maximum are lowered to the maximum. Values already within range pass through unchanged.',
    tips: [
      'Place after map-range to ensure the output never exceeds the target bounds.',
      'Use with lerp to keep interpolation parameters in the 0 to 1 range.',
    ],
    pairsWith: ['map-range', 'lerp', 'smooth', 'in-range', 'wrap'],
  },
}
