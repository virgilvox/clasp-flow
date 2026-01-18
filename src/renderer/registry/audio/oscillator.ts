import type { NodeDefinition } from '../types'

export const oscillatorNode: NodeDefinition = {
  id: 'oscillator',
  name: 'Oscillator',
  version: '1.0.0',
  category: 'audio',
  description: 'Generate audio waveform',
  icon: 'waves',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'frequency', type: 'number', label: 'Freq' },
    { id: 'detune', type: 'number', label: 'Detune' },
  ],
  outputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
    { id: 'frequency', type: 'number', label: 'Freq' },
  ],
  controls: [
    { id: 'frequency', type: 'number', label: 'Frequency', default: 440 },
    { id: 'detune', type: 'number', label: 'Detune', default: 0 },
    { id: 'waveform', type: 'select', label: 'Waveform', default: 'sine', props: { options: ['sine', 'square', 'triangle', 'sawtooth'] } },
    { id: 'volume', type: 'number', label: 'Volume (dB)', default: -6 },
  ],
}
