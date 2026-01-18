import type { NodeDefinition } from '../types'

export const plane3dNode: NodeDefinition = {
  id: 'plane-3d',
  name: 'Plane 3D',
  version: '1.0.0',
  category: '3d',
  description: 'Create a plane mesh',
  icon: 'square',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'width', type: 'number', label: 'Width' },
    { id: 'height', type: 'number', label: 'Height' },
    { id: 'material', type: 'material3d', label: 'Material' },
    { id: 'posX', type: 'number', label: 'Pos X' },
    { id: 'posY', type: 'number', label: 'Pos Y' },
    { id: 'posZ', type: 'number', label: 'Pos Z' },
  ],
  outputs: [
    { id: 'object', type: 'object3d', label: 'Object' },
  ],
  controls: [
    { id: 'width', type: 'number', label: 'Width', default: 1 },
    { id: 'height', type: 'number', label: 'Height', default: 1 },
    { id: 'color', type: 'color', label: 'Color', default: '#808080' },
  ],
}
