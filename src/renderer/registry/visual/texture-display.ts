import type { NodeDefinition } from '../types'

export const textureDisplayNode: NodeDefinition = {
  id: 'texture-display',
  name: 'Texture Display',
  version: '1.0.0',
  category: 'visual',
  description: 'Display texture on canvas',
  icon: 'monitor',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'texture', type: 'texture', label: 'Texture' }],
  outputs: [],
  controls: [],
}
