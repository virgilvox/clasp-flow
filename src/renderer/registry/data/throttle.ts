import type { NodeDefinition } from '../types'

export const throttleNode: NodeDefinition = {
  id: 'throttle',
  name: 'Throttle',
  version: '1.0.0',
  category: 'data',
  description: 'Limit how often value is output',
  icon: 'gauge',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'result', type: 'any', label: 'Result' }],
  controls: [
    { id: 'interval', type: 'number', label: 'Interval (ms)', default: 100 },
  ],
  tags: ['throttle', 'limit', 'rate', 'frequency'],
}
