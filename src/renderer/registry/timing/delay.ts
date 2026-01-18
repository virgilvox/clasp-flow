import type { NodeDefinition } from '../types'

export const delayNode: NodeDefinition = {
  id: 'delay',
  name: 'Delay',
  version: '1.0.0',
  category: 'timing',
  description: 'Delays a value by specified time',
  icon: 'clock',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'value', type: 'any', label: 'Delayed' }],
  controls: [
    { id: 'delay', type: 'number', label: 'Delay (ms)', default: 500, props: { min: 0, max: 10000 } },
  ],
}
