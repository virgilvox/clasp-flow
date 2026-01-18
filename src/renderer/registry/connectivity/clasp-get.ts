import type { NodeDefinition } from '../types'

export const claspGetNode: NodeDefinition = {
  id: 'clasp-get',
  name: 'CLASP Get',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Get current value of a CLASP parameter',
  icon: 'download',
  color: '#6366f1',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'connectionId', type: 'string', label: 'Connection ID' },
    { id: 'address', type: 'string', label: 'Address' },
    { id: 'trigger', type: 'trigger', label: 'Get' },
  ],
  outputs: [
    { id: 'value', type: 'any', label: 'Value' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'connectionId', type: 'text', label: 'Connection ID', default: 'default' },
    { id: 'address', type: 'text', label: 'Address', default: '/param', props: { placeholder: '/lights/strip1/brightness' } },
  ],
  tags: ['clasp', 'get', 'read', 'fetch'],
}
