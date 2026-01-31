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
  info: {
    overview: 'Checks whether a string contains a given substring and outputs a boolean result along with the index of the first match. Supports both case-sensitive and case-insensitive searching.',
    tips: [
      'Use the index output to find where the match starts, then feed it into String Slice to extract surrounding context.',
      'Turn off case sensitivity when searching user-provided text.',
    ],
    pairsWith: ['string-slice', 'string-match', 'string-replace', 'gate'],
  },
}
