import type { NodeDefinition } from '../types'

export const remapNode: NodeDefinition = {
  id: 'remap',
  name: 'Remap',
  version: '1.0.0',
  category: 'math',
  description: 'Remap value with clamping and easing',
  icon: 'sliders-horizontal',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'inMin', type: 'number', label: 'In Min', default: 0 },
    { id: 'inMax', type: 'number', label: 'In Max', default: 1 },
    { id: 'outMin', type: 'number', label: 'Out Min', default: 0 },
    { id: 'outMax', type: 'number', label: 'Out Max', default: 100 },
    { id: 'clamp', type: 'toggle', label: 'Clamp', default: true },
    {
      id: 'easing',
      type: 'select',
      label: 'Easing',
      default: 'linear',
      props: { options: ['linear', 'ease-in', 'ease-out', 'ease-in-out'] },
    },
  ],
  tags: ['remap', 'map', 'range', 'scale', 'easing'],
}
