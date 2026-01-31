import type { NodeDefinition } from '../types'

export const stringReplaceNode: NodeDefinition = {
  id: 'string-replace',
  name: 'String Replace',
  version: '1.0.0',
  category: 'string',
  description: 'Replace text in a string',
  icon: 'replace',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'string', label: 'Input' },
    { id: 'search', type: 'string', label: 'Search' },
    { id: 'replace', type: 'string', label: 'Replace' },
  ],
  outputs: [
    { id: 'result', type: 'string', label: 'Result' },
    { id: '_error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'search', type: 'text', label: 'Search', default: '' },
    { id: 'replace', type: 'text', label: 'Replace', default: '' },
    { id: 'useRegex', type: 'toggle', label: 'Use Regex', default: false },
    { id: 'replaceAll', type: 'toggle', label: 'Replace All', default: true },
  ],
  info: {
    overview: 'Replaces occurrences of a search string or regex pattern within the input. Can replace the first match or all matches. The search and replace values can come from either the controls or the connected inputs.',
    tips: [
      'Enable the Use Regex toggle to use patterns like \\d+ for matching numbers.',
      'Connect dynamic search and replace values from other nodes to do data-driven substitution.',
    ],
    pairsWith: ['string-match', 'string-contains', 'string-template', 'string-concat'],
  },
}
