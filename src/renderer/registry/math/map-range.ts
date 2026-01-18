import type { NodeDefinition } from '../types'

export const mapRangeNode: NodeDefinition = {
  id: 'map-range',
  name: 'Map Range',
  version: '1.0.0',
  category: 'math',
  description: 'Remap a value from one range to another',
  icon: 'arrow-right-left',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value', required: true }],
  outputs: [{ id: 'result', type: 'number', label: 'Result' }],
  controls: [
    { id: 'inMin', type: 'number', label: 'In Min', default: 0 },
    { id: 'inMax', type: 'number', label: 'In Max', default: 1 },
    { id: 'outMin', type: 'number', label: 'Out Min', default: 0 },
    { id: 'outMax', type: 'number', label: 'Out Max', default: 100 },
  ],
}
