import type { NodeDefinition } from '../types'

export const lerpNode: NodeDefinition = {
  id: 'lerp',
  name: 'Lerp',
  version: '1.0.0',
  category: 'math',
  description: 'Linear interpolation between two values',
  icon: 'git-commit-horizontal',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'number', label: 'A' },
    { id: 'b', type: 'number', label: 'B' },
    { id: 't', type: 'number', label: 'T' },
  ],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [],
  tags: ['lerp', 'interpolate', 'blend', 'mix'],
  info: {
    overview: 'Performs linear interpolation between values A and B using parameter T. When T is 0, the output equals A. When T is 1, the output equals B. Values of T between 0 and 1 produce a proportional blend.',
    tips: [
      'Clamp T to the 0-1 range to prevent extrapolation beyond A and B.',
      'Feed an LFO or time-based signal into T for animated transitions.',
    ],
    pairsWith: ['clamp', 'smooth', 'map-range', 'lfo', 'time'],
  },
}
