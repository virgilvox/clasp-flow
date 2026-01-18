import type { NodeDefinition } from '../types'

export const midiOutputNode: NodeDefinition = {
  id: 'midi-output',
  name: 'MIDI Output',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Send MIDI messages to devices',
  icon: 'music',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'note', type: 'number', label: 'Note' },
    { id: 'velocity', type: 'number', label: 'Velocity' },
    { id: 'trigger', type: 'trigger', label: 'Send' },
  ],
  outputs: [
    { id: 'connected', type: 'boolean', label: 'Connected' },
  ],
  controls: [
    { id: 'channel', type: 'number', label: 'Channel', default: 0, props: { min: 0, max: 15 } },
  ],
}
