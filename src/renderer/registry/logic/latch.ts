import type { NodeDefinition } from '../types'

export const latchNode: NodeDefinition = {
  id: 'latch',
  name: 'Latch',
  version: '1.0.0',
  category: 'logic',
  description: 'Flip-flop style latch with set and reset inputs',
  icon: 'toggle-left',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'set', type: 'trigger', label: 'Set' },
    { id: 'reset', type: 'trigger', label: 'Reset' },
  ],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [
    { id: 'initialState', type: 'toggle', label: 'Initial', default: false },
  ],
  tags: ['flip-flop', 'toggle', 'state', 'memory'],
}
