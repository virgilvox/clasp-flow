import type { NodeDefinition } from '../types'

export const coalesceNode: NodeDefinition = {
  id: 'coalesce',
  name: 'Coalesce',
  version: '1.0.0',
  category: 'logic',
  description: 'Return first non-null/undefined value',
  icon: 'layers',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'any', label: 'A' },
    { id: 'b', type: 'any', label: 'B' },
    { id: 'c', type: 'any', label: 'C' },
    { id: 'd', type: 'any', label: 'D' },
  ],
  outputs: [{ id: 'result', type: 'any', label: 'Result' }],
  controls: [],
  tags: ['nullish', 'fallback', 'default', 'first'],
}
