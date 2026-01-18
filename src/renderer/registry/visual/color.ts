import type { NodeDefinition } from '../types'

export const colorNode: NodeDefinition = {
  id: 'color',
  name: 'Color',
  version: '1.0.0',
  category: 'visual',
  description: 'Create RGBA color value',
  icon: 'palette',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'r', type: 'number', label: 'R' },
    { id: 'g', type: 'number', label: 'G' },
    { id: 'b', type: 'number', label: 'B' },
    { id: 'a', type: 'number', label: 'A' },
  ],
  outputs: [
    { id: 'color', type: 'data', label: 'Color' },
    { id: 'r', type: 'number', label: 'R' },
    { id: 'g', type: 'number', label: 'G' },
    { id: 'b', type: 'number', label: 'B' },
    { id: 'a', type: 'number', label: 'A' },
  ],
  controls: [
    { id: 'r', type: 'slider', label: 'R', default: 1, props: { min: 0, max: 1, step: 0.01 } },
    { id: 'g', type: 'slider', label: 'G', default: 1, props: { min: 0, max: 1, step: 0.01 } },
    { id: 'b', type: 'slider', label: 'B', default: 1, props: { min: 0, max: 1, step: 0.01 } },
    { id: 'a', type: 'slider', label: 'A', default: 1, props: { min: 0, max: 1, step: 0.01 } },
  ],
}
