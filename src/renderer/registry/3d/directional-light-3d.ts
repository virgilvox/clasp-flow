import type { NodeDefinition } from '../types'

export const directionalLight3dNode: NodeDefinition = {
  id: 'directional-light-3d',
  name: 'Directional Light',
  version: '1.0.0',
  category: '3d',
  description: 'Light from a specific direction (like sun)',
  icon: 'sun-dim',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'intensity', type: 'number', label: 'Intensity' },
    { id: 'posX', type: 'number', label: 'Pos X' },
    { id: 'posY', type: 'number', label: 'Pos Y' },
    { id: 'posZ', type: 'number', label: 'Pos Z' },
  ],
  outputs: [
    { id: 'light', type: 'light3d', label: 'Light' },
    { id: 'object', type: 'object3d', label: 'Object' },
  ],
  controls: [
    { id: 'color', type: 'color', label: 'Color', default: '#ffffff' },
    { id: 'intensity', type: 'slider', label: 'Intensity', default: 1, props: { min: 0, max: 5, step: 0.01 } },
    { id: 'posX', type: 'number', label: 'Position X', default: 5 },
    { id: 'posY', type: 'number', label: 'Position Y', default: 5 },
    { id: 'posZ', type: 'number', label: 'Position Z', default: 5 },
    { id: 'castShadow', type: 'toggle', label: 'Cast Shadow', default: true },
  ],
}
