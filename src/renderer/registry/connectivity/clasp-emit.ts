import type { NodeDefinition } from '../types'

export const claspEmitNode: NodeDefinition = {
  id: 'clasp-emit',
  name: 'CLASP Emit',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Emit a CLASP event (one-time trigger)',
  icon: 'zap',
  color: '#6366f1',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'connectionId', type: 'string', label: 'Connection ID' },
    { id: 'address', type: 'string', label: 'Address' },
    { id: 'payload', type: 'any', label: 'Payload' },
    { id: 'trigger', type: 'trigger', label: 'Emit' },
  ],
  outputs: [
    { id: 'sent', type: 'boolean', label: 'Sent' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'connectionId', type: 'text', label: 'Connection ID', default: 'default' },
    { id: 'address', type: 'text', label: 'Event Address', default: '/event', props: { placeholder: '/cue/fire' } },
  ],
  tags: ['clasp', 'emit', 'event', 'trigger'],
}
