import type { NodeDefinition } from '../../types'

export const wavetableNode: NodeDefinition = {
  id: 'wavetable',
  name: 'Wavetable',
  version: '1.0.0',
  category: 'audio',
  description: 'Wavetable oscillator with drawable/editable waveform',
  icon: 'waves',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'frequency', type: 'number', label: 'Freq' },
  ],
  outputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
  ],
  controls: [
    { id: 'frequency', type: 'number', label: 'Frequency', default: 440, props: { min: 20, max: 2000, step: 1 } },
    { id: 'volume', type: 'slider', label: 'Volume', default: 0.5, props: { min: 0, max: 1, step: 0.01 } },
    { id: 'preset', type: 'select', label: 'Preset', default: 'sine', props: { options: ['sine', 'square', 'sawtooth', 'triangle', 'custom'] } },
  ],
}

// Export the custom node component
export { default as WavetableNode } from './WavetableNode.vue'
