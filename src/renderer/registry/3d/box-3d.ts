import type { NodeDefinition } from '../types'

export const box3dNode: NodeDefinition = {
  id: 'box-3d',
  name: 'Box 3D',
  version: '1.0.0',
  category: '3d',
  description: 'Create a box/cube mesh',
  icon: 'box',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'width', type: 'number', label: 'Width' },
    { id: 'height', type: 'number', label: 'Height' },
    { id: 'depth', type: 'number', label: 'Depth' },
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
    { id: 'depth', type: 'number', label: 'Depth', default: 1 },
    { id: 'color', type: 'color', label: 'Color', default: '#808080' },
  ],
}
