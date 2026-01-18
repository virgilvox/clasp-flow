import type { NodeDefinition } from '../types'

export const gltfLoaderNode: NodeDefinition = {
  id: 'gltf-loader',
  name: 'GLTF Loader',
  version: '1.0.0',
  category: '3d',
  description: 'Load 3D models in GLTF/GLB format',
  icon: 'file-box',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'url', type: 'string', label: 'URL' },
    { id: 'posX', type: 'number', label: 'Pos X' },
    { id: 'posY', type: 'number', label: 'Pos Y' },
    { id: 'posZ', type: 'number', label: 'Pos Z' },
  ],
  outputs: [
    { id: 'object', type: 'object3d', label: 'Object' },
    { id: 'loading', type: 'boolean', label: 'Loading' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'url', type: 'text', label: 'URL', default: '' },
    { id: 'posX', type: 'number', label: 'Position X', default: 0 },
    { id: 'posY', type: 'number', label: 'Position Y', default: 0 },
    { id: 'posZ', type: 'number', label: 'Position Z', default: 0 },
    { id: 'scale', type: 'number', label: 'Scale', default: 1, props: { min: 0.001, max: 100 } },
  ],
}
