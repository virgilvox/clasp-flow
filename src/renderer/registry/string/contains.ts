import type { NodeDefinition } from '../types'

export const stringContainsNode: NodeDefinition = {
  id: 'string-contains',
  name: 'String Contains',
  version: '1.0.0',
  category: 'string',
  description: 'Check if string contains a substring',
  icon: 'search',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'string', label: 'Input' },
    { id: 'search', type: 'string', label: 'Search' },
  ],
  outputs: [
    { id: 'result', type: 'boolean', label: 'Result' },
    { id: 'index', type: 'number', label: 'Index' },
  ],
  controls: [
    { id: 'caseSensitive', type: 'toggle', label: 'Case Sensitive', default: true },
  ],
  tags: ['contains', 'includes', 'search', 'find'],
}
