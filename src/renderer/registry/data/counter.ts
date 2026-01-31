import type { NodeDefinition } from '../types'

export const counterNode: NodeDefinition = {
  id: 'counter',
  name: 'Counter',
  version: '1.0.0',
  category: 'data',
  description: 'Count triggers with optional min/max bounds',
  icon: 'plus-minus',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'increment', type: 'trigger', label: 'Increment' },
    { id: 'decrement', type: 'trigger', label: 'Decrement' },
    { id: 'reset', type: 'trigger', label: 'Reset' },
  ],
  outputs: [{ id: 'count', type: 'number', label: 'Count' }],
  controls: [
    { id: 'min', type: 'number', label: 'Min', default: 0 },
    { id: 'max', type: 'number', label: 'Max', default: 100 },
    { id: 'wrap', type: 'toggle', label: 'Wrap', default: false },
    { id: 'initial', type: 'number', label: 'Initial', default: 0 },
  ],
  tags: ['counter', 'count', 'increment', 'decrement'],
  info: {
    overview: 'Maintains a numeric count that responds to increment, decrement, and reset triggers. Supports configurable min/max bounds and optional wrapping. Useful for sequencing, stepping through arrays, or tracking events.',
    tips: [
      'Enable wrap mode to cycle through a fixed range of values continuously.',
      'Connect the count output to Array Get to step through array elements one at a time.',
    ],
    pairsWith: ['array-get', 'gate', 'compare', 'router'],
  },
}
