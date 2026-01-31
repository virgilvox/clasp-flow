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
  info: {
    overview: 'A wavetable oscillator that lets you select from preset waveforms or draw a custom waveshape. The drawn waveform is stored as a wavetable and played back at the specified frequency, giving you full control over the harmonic content.',
    tips: [
      'Select the custom preset and draw directly on the waveform display to create unique timbres.',
      'Start from a preset waveform and modify it slightly for variations on familiar sounds.',
      'Modulate the frequency input with an LFO for vibrato or with a MIDI source for melodic play.',
    ],
    pairsWith: ['gain', 'filter', 'envelope', 'audio-output', 'svf-filter'],
  },
}

// Export the custom node component
export { default as WavetableNode } from './WavetableNode.vue'
