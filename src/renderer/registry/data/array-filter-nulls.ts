import type { NodeDefinition } from '../types'

export const arrayFilterNullsNode: NodeDefinition = {
  id: 'array-filter-nulls',
  name: 'Filter Nulls',
  version: '1.0.0',
  category: 'data',
  description: 'Remove null/undefined/empty values from array',
  icon: 'filter-x',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [
    { id: 'result', type: 'array', label: 'Result' },
    { id: 'removed', type: 'number', label: 'Removed' },
  ],
  controls: [
    { id: 'removeEmpty', type: 'toggle', label: 'Remove Empty Strings', default: true },
  ],
  tags: ['array', 'filter', 'null', 'clean', 'compact'],
}
