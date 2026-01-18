import type { NodeDefinition } from '../types'

export const claspStreamNode: NodeDefinition = {
  id: 'clasp-stream',
  name: 'CLASP Stream',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Stream high-rate data (continuous updates)',
  icon: 'activity',
  color: '#6366f1',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'connectionId', type: 'string', label: 'Connection ID' },
    { id: 'address', type: 'string', label: 'Address' },
    { id: 'value', type: 'any', label: 'Value' },
  ],
  outputs: [
    { id: 'sent', type: 'boolean', label: 'Sent' },
  ],
  controls: [
    { id: 'connectionId', type: 'text', label: 'Connection ID', default: 'default' },
    { id: 'address', type: 'text', label: 'Address', default: '/stream', props: { placeholder: '/sensor/temperature' } },
    { id: 'enabled', type: 'toggle', label: 'Enabled', default: true },
  ],
  tags: ['clasp', 'stream', 'continuous', 'high-rate'],
}
