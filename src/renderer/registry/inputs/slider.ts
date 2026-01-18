import type { NodeDefinition } from '../types'

export const sliderNode: NodeDefinition = {
  id: 'slider',
  name: 'Slider',
  version: '1.0.0',
  category: 'inputs',
  description: 'Slider control (0-1)',
  icon: 'sliders-horizontal',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [{ id: 'value', type: 'number', label: 'Value' }],
  controls: [
    { id: 'value', type: 'slider', label: 'Value', default: 0.5, exposable: true, props: { min: 0, max: 1, step: 0.01 } },
  ],
}
