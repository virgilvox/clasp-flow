import type { NodeDefinition } from '../types'

export const arrayUniqueNode: NodeDefinition = {
  id: 'array-unique',
  name: 'Array Unique',
  version: '1.0.0',
  category: 'data',
  description: 'Remove duplicate values',
  icon: 'fingerprint',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [{ id: 'result', type: 'array', label: 'Result' }],
  controls: [],
  tags: ['array', 'unique', 'distinct', 'dedupe'],
  info: {
    overview: 'Removes duplicate values from an array, keeping only the first occurrence of each value. Useful for deduplicating lists of IDs, tags, or any repeated data.',
    tips: [
      'Apply this after Array Push when accumulating values that may repeat.',
      'Combine with Array Length to compare the count before and after deduplication.',
    ],
    pairsWith: ['array-push', 'array-length', 'array-sort', 'array-filter-nulls'],
  },
}
