import type { NodeDefinition } from '../types'

export const blendNode: NodeDefinition = {
  id: 'blend',
  name: 'Blend',
  version: '1.0.0',
  category: 'visual',
  description: 'Blend two textures together',
  icon: 'layers',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'texture', label: 'A' },
    { id: 'b', type: 'texture', label: 'B' },
    { id: 'mix', type: 'number', label: 'Mix' },
  ],
  outputs: [{ id: 'texture', type: 'texture', label: 'Texture' }],
  controls: [
    { id: 'mix', type: 'slider', label: 'Mix', default: 0.5, props: { min: 0, max: 1, step: 0.01 } },
    { id: 'mode', type: 'select', label: 'Mode', default: 'normal', props: { options: ['normal', 'add', 'multiply', 'screen', 'overlay'] } },
  ],
}
