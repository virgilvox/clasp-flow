import type { NodeDefinition } from '../types'

export const blurNode: NodeDefinition = {
  id: 'blur',
  name: 'Blur',
  version: '1.0.0',
  category: 'visual',
  description: 'Apply Gaussian blur to texture',
  icon: 'droplet',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'texture', type: 'texture', label: 'Texture' },
    { id: 'radius', type: 'number', label: 'Radius' },
  ],
  outputs: [{ id: 'texture', type: 'texture', label: 'Texture' }],
  controls: [
    { id: 'radius', type: 'slider', label: 'Radius', default: 5, props: { min: 0, max: 50, step: 0.5 } },
    { id: 'passes', type: 'number', label: 'Passes', default: 2, props: { min: 1, max: 10 } },
  ],
}
