import type { NodeDefinition } from '../types'

export const intervalNode: NodeDefinition = {
  id: 'interval',
  name: 'Interval',
  version: '1.0.0',
  category: 'timing',
  description: 'Fires at regular intervals',
  icon: 'timer',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'enabled', type: 'boolean', label: 'Enabled' }],
  outputs: [{ id: 'trigger', type: 'trigger', label: 'Trigger' }],
  controls: [
    { id: 'interval', type: 'number', label: 'Interval (ms)', default: 1000, props: { min: 10, max: 60000 } },
    { id: 'enabled', type: 'toggle', label: 'Enabled', default: true },
  ],
}
