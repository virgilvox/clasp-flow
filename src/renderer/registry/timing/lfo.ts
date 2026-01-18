import type { NodeDefinition } from '../types'

export const lfoNode: NodeDefinition = {
  id: 'lfo',
  name: 'LFO',
  version: '1.0.0',
  category: 'timing',
  description: 'Low frequency oscillator',
  icon: 'waves',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [{ id: 'value', type: 'number', label: 'Value' }],
  controls: [
    { id: 'frequency', type: 'number', label: 'Frequency', default: 1 },
    { id: 'amplitude', type: 'number', label: 'Amplitude', default: 1 },
    { id: 'offset', type: 'number', label: 'Offset', default: 0 },
    { id: 'waveform', type: 'select', label: 'Waveform', default: 'sine', props: { options: ['sine', 'square', 'triangle', 'sawtooth'] } },
  ],
}
