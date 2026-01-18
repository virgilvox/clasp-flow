import type { NodeDefinition } from '../types'

export const colorCorrectionNode: NodeDefinition = {
  id: 'color-correction',
  name: 'Color Correction',
  version: '1.0.0',
  category: 'visual',
  description: 'Adjust brightness, contrast, saturation, hue, and gamma',
  icon: 'palette',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'texture', type: 'texture', label: 'Texture' },
    { id: 'brightness', type: 'number', label: 'Brightness' },
    { id: 'contrast', type: 'number', label: 'Contrast' },
    { id: 'saturation', type: 'number', label: 'Saturation' },
    { id: 'hue', type: 'number', label: 'Hue' },
    { id: 'gamma', type: 'number', label: 'Gamma' },
  ],
  outputs: [{ id: 'texture', type: 'texture', label: 'Texture' }],
  controls: [
    { id: 'brightness', type: 'slider', label: 'Brightness', default: 0, props: { min: -1, max: 1, step: 0.01 } },
    { id: 'contrast', type: 'slider', label: 'Contrast', default: 1, props: { min: 0, max: 3, step: 0.01 } },
    { id: 'saturation', type: 'slider', label: 'Saturation', default: 1, props: { min: 0, max: 3, step: 0.01 } },
    { id: 'hue', type: 'slider', label: 'Hue', default: 0, props: { min: -180, max: 180, step: 1 } },
    { id: 'gamma', type: 'slider', label: 'Gamma', default: 1, props: { min: 0.1, max: 3, step: 0.01 } },
  ],
}
