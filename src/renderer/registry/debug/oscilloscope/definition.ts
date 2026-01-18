import type { NodeDefinition } from '@/stores/nodes'

export const oscilloscopeNode: NodeDefinition = {
  id: 'oscilloscope',
  name: 'Oscilloscope',
  version: '1.0.0',
  category: 'debug',
  description: 'Visualize signal waveform over time',
  icon: 'activity',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'signal', type: 'number', label: 'Signal' },
    { id: 'audio', type: 'audio', label: 'Audio' },
  ],
  outputs: [],
  controls: [
    { id: 'timeScale', type: 'slider', label: 'Time Scale', default: 1, props: { min: 0.25, max: 4, step: 0.25 } },
    { id: 'amplitude', type: 'slider', label: 'Amplitude', default: 1, props: { min: 0.1, max: 2, step: 0.1 } },
  ],
}
