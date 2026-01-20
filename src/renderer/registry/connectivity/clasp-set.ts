import type { NodeDefinition } from '../types'

export const claspSetNode: NodeDefinition = {
  id: 'clasp-set',
  name: 'CLASP Set',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Set a CLASP parameter value (persistent state)',
  icon: 'edit-3',
  color: '#6366f1',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'connectionId', type: 'string', label: 'Connection ID' },
    { id: 'address', type: 'string', label: 'Address' },
    { id: 'value', type: 'any', label: 'Value' },
    { id: 'trigger', type: 'trigger', label: 'Send' },
  ],
  outputs: [
    { id: 'sent', type: 'boolean', label: 'Sent' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'connectionId', type: 'connection', label: 'Connection', default: '', props: { protocol: 'clasp', placeholder: 'Select CLASP connection...' } },
    { id: 'address', type: 'text', label: 'Address', default: '/param', props: { placeholder: '/lights/strip1/brightness' } },
  ],
  tags: ['clasp', 'set', 'parameter', 'send'],
}
