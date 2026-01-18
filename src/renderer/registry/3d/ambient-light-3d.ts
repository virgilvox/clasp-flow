import type { NodeDefinition } from '../types'

export const ambientLight3dNode: NodeDefinition = {
  id: 'ambient-light-3d',
  name: 'Ambient Light',
  version: '1.0.0',
  category: '3d',
  description: 'Uniform lighting from all directions',
  icon: 'sun',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'intensity', type: 'number', label: 'Intensity' },
  ],
  outputs: [
    { id: 'light', type: 'light3d', label: 'Light' },
    { id: 'object', type: 'object3d', label: 'Object' },
  ],
  controls: [
    { id: 'color', type: 'color', label: 'Color', default: '#ffffff' },
    { id: 'intensity', type: 'slider', label: 'Intensity', default: 0.5, props: { min: 0, max: 2, step: 0.01 } },
  ],
}
