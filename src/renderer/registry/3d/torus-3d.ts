import type { NodeDefinition } from '../types'

export const torus3dNode: NodeDefinition = {
  id: 'torus-3d',
  name: 'Torus 3D',
  version: '1.0.0',
  category: '3d',
  description: 'Create a torus (donut) mesh',
  icon: 'circle-dot',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'radius', type: 'number', label: 'Radius' },
    { id: 'tube', type: 'number', label: 'Tube' },
    { id: 'material', type: 'material3d', label: 'Material' },
    { id: 'posX', type: 'number', label: 'Pos X' },
    { id: 'posY', type: 'number', label: 'Pos Y' },
    { id: 'posZ', type: 'number', label: 'Pos Z' },
  ],
  outputs: [
    { id: 'object', type: 'object3d', label: 'Object' },
  ],
  controls: [
    { id: 'radius', type: 'number', label: 'Radius', default: 0.5 },
    { id: 'tube', type: 'number', label: 'Tube', default: 0.2 },
    { id: 'radialSegments', type: 'number', label: 'Radial Segs', default: 16, props: { min: 2, max: 32 } },
    { id: 'tubularSegments', type: 'number', label: 'Tubular Segs', default: 100, props: { min: 3, max: 200 } },
    { id: 'color', type: 'color', label: 'Color', default: '#808080' },
  ],
}
