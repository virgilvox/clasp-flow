import type { NodeDefinition } from '../types'

export const claspBundleNode: NodeDefinition = {
  id: 'clasp-bundle',
  name: 'CLASP Bundle',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Send atomic bundles of operations',
  icon: 'package',
  color: '#6366f1',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'connectionId', type: 'string', label: 'Connection ID' },
    { id: 'messages', type: 'data', label: 'Messages' },
    { id: 'at', type: 'number', label: 'Schedule At (us)' },
    { id: 'trigger', type: 'trigger', label: 'Send' },
  ],
  outputs: [
    { id: 'sent', type: 'boolean', label: 'Sent' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'connectionId', type: 'connection', label: 'Connection', default: '', props: { protocol: 'clasp', placeholder: 'Select CLASP connection...' } },
  ],
  tags: ['clasp', 'bundle', 'atomic', 'batch'],
}
