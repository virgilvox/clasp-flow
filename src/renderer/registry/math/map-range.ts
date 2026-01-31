import type { NodeDefinition } from '../types'

export const mapRangeNode: NodeDefinition = {
  id: 'map-range',
  name: 'Map Range',
  version: '1.0.0',
  category: 'math',
  description: 'Remap a value from one range to another',
  icon: 'arrow-right-left',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value', required: true }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'inMin', type: 'number', label: 'In Min', default: 0 },
    { id: 'inMax', type: 'number', label: 'In Max', default: 1 },
    { id: 'outMin', type: 'number', label: 'Out Min', default: 0 },
    { id: 'outMax', type: 'number', label: 'Out Max', default: 100 },
  ],
  info: {
    overview: 'Rescales a value from one numeric range to another. For example, an input in the 0-1 range can be mapped to 0-100. The mapping is linear and does not clamp, so values outside the input range will extrapolate.',
    tips: [
      'Follow with a clamp node if you need to prevent extrapolation beyond the output range.',
      'Use remap instead if you need built-in clamping and easing options.',
    ],
    pairsWith: ['clamp', 'remap', 'lerp', 'smooth', 'in-range'],
  },
}
