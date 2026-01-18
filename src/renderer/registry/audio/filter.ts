import type { NodeDefinition } from '../types'

export const filterNode: NodeDefinition = {
  id: 'filter',
  name: 'Filter',
  version: '1.0.0',
  category: 'audio',
  description: 'Filter audio frequencies',
  icon: 'sliders',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
    { id: 'frequency', type: 'number', label: 'Freq' },
  ],
  outputs: [{ id: 'audio', type: 'audio', label: 'Audio' }],
  controls: [
    { id: 'frequency', type: 'number', label: 'Frequency', default: 1000 },
    { id: 'Q', type: 'number', label: 'Q', default: 1 },
    { id: 'type', type: 'select', label: 'Type', default: 'lowpass', props: { options: ['lowpass', 'highpass', 'bandpass', 'notch'] } },
  ],
}
