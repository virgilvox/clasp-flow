import type { NodeDefinition } from '../types'

export const gateNode: NodeDefinition = {
  id: 'gate',
  name: 'Gate',
  version: '1.0.0',
  category: 'logic',
  description: 'Pass or block value',
  icon: 'door-open',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'value', type: 'any', label: 'Value' },
    { id: 'gate', type: 'boolean', label: 'Gate' },
  ],
  outputs: [{ id: 'result', type: 'any', label: 'Result' }],
  controls: [
    { id: 'open', type: 'toggle', label: 'Open', default: true },
  ],
}
