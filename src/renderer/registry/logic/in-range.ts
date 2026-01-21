import type { NodeDefinition } from '../types'

export const inRangeNode: NodeDefinition = {
  id: 'in-range',
  name: 'In Range',
  version: '1.0.0',
  category: 'logic',
  description: 'Check if number is within a range',
  icon: 'arrow-left-right',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'boolean', label: 'Result' }],
  controls: [
    { id: 'min', type: 'number', label: 'Min', default: 0 },
    { id: 'max', type: 'number', label: 'Max', default: 1 },
    { id: 'inclusive', type: 'toggle', label: 'Inclusive', default: true },
  ],
  tags: ['range', 'between', 'threshold', 'bounds'],
}
