import type { NodeDefinition } from '../types'

export const gainNode: NodeDefinition = {
  id: 'gain',
  name: 'Gain',
  version: '1.0.0',
  category: 'audio',
  description: 'Adjust audio volume',
  icon: 'volume-1',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
    { id: 'gain', type: 'number', label: 'Gain' },
  ],
  outputs: [{ id: 'audio', type: 'audio', label: 'Audio' }],
  controls: [
    { id: 'gain', type: 'number', label: 'Gain', default: 1 },
  ],
}
