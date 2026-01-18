import type { NodeDefinition } from '../types'

export const toggleNode: NodeDefinition = {
  id: 'toggle',
  name: 'Toggle',
  version: '1.0.0',
  category: 'code',
  description: 'Flip-flop toggle with set/reset',
  icon: 'toggle-left',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'trigger', type: 'trigger', label: 'Toggle' },
    { id: 'set', type: 'trigger', label: 'Set' },
    { id: 'reset', type: 'trigger', label: 'Reset' },
  ],
  outputs: [
    { id: 'value', type: 'boolean', label: 'Value' },
    { id: 'inverted', type: 'boolean', label: 'Inverted' },
    { id: 'number', type: 'number', label: 'Number' },
  ],
  controls: [
    { id: 'initial', type: 'toggle', label: 'Initial Value', default: false },
  ],
}
