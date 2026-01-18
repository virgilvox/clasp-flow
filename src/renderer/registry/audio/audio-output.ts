import type { NodeDefinition } from '../types'

export const audioOutputNode: NodeDefinition = {
  id: 'audio-output',
  name: 'Audio Output',
  version: '1.0.0',
  category: 'audio',
  description: 'Output audio to speakers',
  icon: 'volume-2',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'audio', type: 'audio', label: 'Audio' }],
  outputs: [],
  controls: [
    { id: 'volume', type: 'number', label: 'Volume (dB)', default: 0 },
    { id: 'mute', type: 'toggle', label: 'Mute', default: false },
  ],
}
