import type { NodeDefinition } from '../types'

export const textureToDataNode: NodeDefinition = {
  id: 'texture-to-data',
  name: 'Texture to Data',
  version: '1.0.0',
  category: 'data',
  description: 'Convert texture to image data for AI processing',
  icon: 'image-down',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'texture', type: 'texture', label: 'Texture', required: true },
    { id: 'trigger', type: 'trigger', label: 'Capture' },
  ],
  outputs: [
    { id: 'data', type: 'data', label: 'Image Data' },
    { id: 'width', type: 'number', label: 'Width' },
    { id: 'height', type: 'number', label: 'Height' },
  ],
  controls: [
    { id: 'format', type: 'select', label: 'Format', default: 'imageData', props: { options: ['imageData', 'base64', 'blob'] } },
    { id: 'continuous', type: 'toggle', label: 'Continuous', default: false },
  ],
}
