import type { NodeDefinition } from '../types'

export const midiInputNode: NodeDefinition = {
  id: 'midi-input',
  name: 'MIDI Input',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Receive MIDI messages from devices',
  icon: 'music',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [
    { id: 'note', type: 'number', label: 'Note' },
    { id: 'velocity', type: 'number', label: 'Velocity' },
    { id: 'noteOn', type: 'boolean', label: 'Note On' },
    { id: 'cc', type: 'number', label: 'CC Number' },
    { id: 'ccValue', type: 'number', label: 'CC Value' },
    { id: 'connected', type: 'boolean', label: 'Connected' },
  ],
  controls: [
    { id: 'enabled', type: 'toggle', label: 'Enabled', default: true },
    { id: 'channel', type: 'number', label: 'Channel (-1=all)', default: -1, props: { min: -1, max: 15 } },
  ],
}
