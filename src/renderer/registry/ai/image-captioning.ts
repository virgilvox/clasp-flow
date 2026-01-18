import type { NodeDefinition } from '../types'

export const imageCaptioningNode: NodeDefinition = {
  id: 'image-captioning',
  name: 'Caption Image',
  version: '1.0.0',
  category: 'ai',
  description: 'Generate captions for images',
  icon: 'image',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'image', type: 'data', label: 'Image' },
    { id: 'trigger', type: 'trigger', label: 'Caption' },
  ],
  outputs: [
    { id: 'caption', type: 'string', label: 'Caption' },
    { id: 'loading', type: 'boolean', label: 'Loading' },
  ],
  controls: [
    { id: 'interval', type: 'number', label: 'Frame Interval', default: 60, props: { min: 1, max: 300 } },
  ],
}
