import type { NodeDefinition } from '../../types'

export const equalizerNode: NodeDefinition = {
  id: 'equalizer',
  name: 'Equalizer',
  version: '1.0.0',
  category: 'debug',
  description: 'Visualize audio frequency spectrum as bars',
  icon: 'bar-chart-3',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'audio', type: 'audio', label: 'Audio' }],
  outputs: [],
  controls: [
    { id: 'barCount', type: 'slider', label: 'Bars', default: 16, props: { min: 8, max: 32, step: 4 } },
    { id: 'colorMode', type: 'select', label: 'Color', default: 'gradient', props: { options: ['gradient', 'spectrum', 'solid'] } },
    { id: 'smoothing', type: 'slider', label: 'Smooth', default: 0.8, props: { min: 0, max: 0.95, step: 0.05 } },
  ],
}
