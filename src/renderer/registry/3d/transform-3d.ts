import type { NodeDefinition } from '../types'

export const transform3dNode: NodeDefinition = {
  id: 'transform-3d',
  name: 'Transform 3D',
  version: '1.0.0',
  category: '3d',
  description: 'Apply position, rotation, and scale',
  icon: 'move-3d',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'object', type: 'object3d', label: 'Object', required: true },
    { id: 'posX', type: 'number', label: 'Pos X' },
    { id: 'posY', type: 'number', label: 'Pos Y' },
    { id: 'posZ', type: 'number', label: 'Pos Z' },
    { id: 'rotX', type: 'number', label: 'Rot X' },
    { id: 'rotY', type: 'number', label: 'Rot Y' },
    { id: 'rotZ', type: 'number', label: 'Rot Z' },
    { id: 'scaleX', type: 'number', label: 'Scale X' },
    { id: 'scaleY', type: 'number', label: 'Scale Y' },
    { id: 'scaleZ', type: 'number', label: 'Scale Z' },
  ],
  outputs: [
    { id: 'object', type: 'object3d', label: 'Object' },
    { id: 'transform', type: 'transform3d', label: 'Transform' },
  ],
  controls: [
    { id: 'posX', type: 'number', label: 'Position X', default: 0 },
    { id: 'posY', type: 'number', label: 'Position Y', default: 0 },
    { id: 'posZ', type: 'number', label: 'Position Z', default: 0 },
    { id: 'rotX', type: 'number', label: 'Rotation X', default: 0 },
    { id: 'rotY', type: 'number', label: 'Rotation Y', default: 0 },
    { id: 'rotZ', type: 'number', label: 'Rotation Z', default: 0 },
    { id: 'scaleX', type: 'number', label: 'Scale X', default: 1 },
    { id: 'scaleY', type: 'number', label: 'Scale Y', default: 1 },
    { id: 'scaleZ', type: 'number', label: 'Scale Z', default: 1 },
  ],
}
