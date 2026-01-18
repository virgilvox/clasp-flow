import type { NodeDefinition } from '../types'

export const transform2dNode: NodeDefinition = {
  id: 'transform-2d',
  name: 'Transform 2D',
  version: '1.0.0',
  category: 'visual',
  description: 'Apply 2D transforms (scale, rotate, translate)',
  icon: 'move-3d',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'texture', type: 'texture', label: 'Texture' },
    { id: 'scale', type: 'number', label: 'Scale' },
    { id: 'rotation', type: 'number', label: 'Rotation' },
    { id: 'translateX', type: 'number', label: 'Translate X' },
    { id: 'translateY', type: 'number', label: 'Translate Y' },
  ],
  outputs: [{ id: 'texture', type: 'texture', label: 'Texture' }],
  controls: [
    { id: 'scale', type: 'slider', label: 'Scale', default: 1, props: { min: 0.1, max: 5, step: 0.01 } },
    { id: 'rotation', type: 'slider', label: 'Rotation', default: 0, props: { min: -180, max: 180, step: 1 } },
    { id: 'translateX', type: 'slider', label: 'Translate X', default: 0, props: { min: -1, max: 1, step: 0.01 } },
    { id: 'translateY', type: 'slider', label: 'Translate Y', default: 0, props: { min: -1, max: 1, step: 0.01 } },
  ],
}
