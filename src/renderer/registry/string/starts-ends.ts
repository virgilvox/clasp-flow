import type { NodeDefinition } from '../types'

export const stringStartsEndsNode: NodeDefinition = {
  id: 'string-starts-ends',
  name: 'Starts/Ends With',
  version: '1.0.0',
  category: 'string',
  description: 'Check if string starts or ends with substring',
  icon: 'arrow-right-from-line',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'string', label: 'Input' },
    { id: 'search', type: 'string', label: 'Search' },
  ],
  outputs: [
    { id: 'startsWith', type: 'boolean', label: 'Starts With' },
    { id: 'endsWith', type: 'boolean', label: 'Ends With' },
  ],
  controls: [
    { id: 'caseSensitive', type: 'toggle', label: 'Case Sensitive', default: true },
  ],
  tags: ['prefix', 'suffix', 'starts', 'ends', 'begins'],
  info: {
    overview: 'Tests whether a string starts or ends with a given substring. Outputs separate booleans for each check. Supports case-sensitive and case-insensitive comparison.',
    tips: [
      'Use this to detect file extensions by checking if a path ends with ".png" or ".jpg".',
      'Connect the boolean outputs to a Gate node to route data based on prefix or suffix matches.',
    ],
    pairsWith: ['string-contains', 'string-slice', 'gate', 'string-match'],
  },
}
