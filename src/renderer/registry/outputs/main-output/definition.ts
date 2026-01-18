import type { NodeDefinition } from '../../types'

export const mainOutputNode: NodeDefinition = {
  id: 'main-output',
  name: 'Main Output',
  version: '1.0.0',
  category: 'outputs',
  description: 'Final output viewer with large preview',
  icon: 'monitor-play',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'texture', type: 'texture', label: 'Texture' }],
  outputs: [],
  controls: [],
}
