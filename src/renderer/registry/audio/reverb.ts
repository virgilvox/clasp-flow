import type { NodeDefinition } from '../types'

export const reverbNode: NodeDefinition = {
  id: 'reverb',
  name: 'Reverb',
  version: '1.0.0',
  category: 'audio',
  description: 'Add reverb effect',
  icon: 'waves',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'audio', type: 'audio', label: 'Audio', required: true },
  ],
  outputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
  ],
  controls: [
    { id: 'decay', type: 'slider', label: 'Decay', default: 1.5, props: { min: 0.1, max: 10, step: 0.1 } },
    { id: 'wet', type: 'slider', label: 'Wet', default: 0.5, props: { min: 0, max: 1, step: 0.01 } },
    { id: 'preDelay', type: 'slider', label: 'Pre-Delay', default: 0.01, props: { min: 0, max: 0.1, step: 0.001 } },
  ],
}
