import type { NodeDefinition } from '../types'

export const render3dNode: NodeDefinition = {
  id: 'render-3d',
  name: 'Render 3D',
  version: '1.0.0',
  category: '3d',
  description: 'Render 3D scene to texture',
  icon: 'image',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'scene', type: 'scene3d', label: 'Scene', required: true },
    { id: 'camera', type: 'camera3d', label: 'Camera', required: true },
  ],
  outputs: [
    { id: 'texture', type: 'texture', label: 'Texture' },
    { id: 'depth', type: 'texture', label: 'Depth' },
  ],
  controls: [
    { id: 'width', type: 'number', label: 'Width', default: 512, props: { min: 64, max: 2048 } },
    { id: 'height', type: 'number', label: 'Height', default: 512, props: { min: 64, max: 2048 } },
    { id: 'includeDepth', type: 'toggle', label: 'Include Depth', default: false },
  ],
}
