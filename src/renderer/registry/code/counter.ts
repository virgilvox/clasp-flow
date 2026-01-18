import type { NodeDefinition } from '../types'

export const counterNode: NodeDefinition = {
  id: 'counter',
  name: 'Counter',
  version: '1.0.0',
  category: 'code',
  description: 'Increment/decrement counter with min/max',
  icon: 'list-ordered',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'increment', type: 'trigger', label: 'Increment' },
    { id: 'decrement', type: 'trigger', label: 'Decrement' },
    { id: 'reset', type: 'trigger', label: 'Reset' },
    { id: 'set', type: 'number', label: 'Set Value' },
  ],
  outputs: [
    { id: 'count', type: 'number', label: 'Count' },
    { id: 'normalized', type: 'number', label: 'Normalized' },
    { id: 'atMin', type: 'boolean', label: 'At Min' },
    { id: 'atMax', type: 'boolean', label: 'At Max' },
  ],
  controls: [
    { id: 'min', type: 'number', label: 'Min', default: 0 },
    { id: 'max', type: 'number', label: 'Max', default: 100 },
    { id: 'step', type: 'number', label: 'Step', default: 1 },
    { id: 'wrap', type: 'toggle', label: 'Wrap Around', default: false },
  ],
}
