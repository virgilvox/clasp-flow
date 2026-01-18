import type { NodeDefinition } from '../types'

export const objectDetectionNode: NodeDefinition = {
  id: 'object-detection',
  name: 'Detect Objects',
  version: '1.0.0',
  category: 'ai',
  description: 'Detect and locate objects in images',
  icon: 'box',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'image', type: 'data', label: 'Image' },
  ],
  outputs: [
    { id: 'objects', type: 'data', label: 'Objects' },
    { id: 'count', type: 'number', label: 'Count' },
    { id: 'loading', type: 'boolean', label: 'Loading' },
  ],
  controls: [
    { id: 'threshold', type: 'slider', label: 'Threshold', default: 0.5, props: { min: 0.1, max: 1, step: 0.05 } },
    { id: 'interval', type: 'number', label: 'Frame Interval', default: 30, props: { min: 1, max: 120 } },
  ],
}
