import type { NodeDefinition } from '../types'

export const cylinder3dNode: NodeDefinition = {
  id: 'cylinder-3d',
  name: 'Cylinder 3D',
  version: '1.0.0',
  category: '3d',
  description: 'Create a cylinder mesh',
  icon: 'cylinder',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'radiusTop', type: 'number', label: 'Radius Top' },
    { id: 'radiusBottom', type: 'number', label: 'Radius Bottom' },
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
    { id: 'radiusTop', type: 'number', label: 'Radius Top', default: 0.5 },
    { id: 'radiusBottom', type: 'number', label: 'Radius Bottom', default: 0.5 },
    { id: 'height', type: 'number', label: 'Height', default: 1 },
    { id: 'radialSegments', type: 'number', label: 'Segments', default: 32, props: { min: 3, max: 64 } },
    { id: 'color', type: 'color', label: 'Color', default: '#808080' },
  ],
}
