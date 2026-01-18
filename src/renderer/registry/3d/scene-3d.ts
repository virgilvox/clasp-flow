import type { NodeDefinition } from '../types'

export const scene3dNode: NodeDefinition = {
  id: 'scene-3d',
  name: 'Scene 3D',
  version: '1.0.0',
  category: '3d',
  description: 'Container for 3D objects',
  icon: 'box',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'objects', type: 'object3d', label: 'Objects', multiple: true },
  ],
  outputs: [
    { id: 'scene', type: 'scene3d', label: 'Scene' },
  ],
  controls: [
    { id: 'backgroundColor', type: 'color', label: 'Background', default: '#000000' },
    { id: 'showGrid', type: 'toggle', label: 'Show Grid', default: false },
  ],
}
